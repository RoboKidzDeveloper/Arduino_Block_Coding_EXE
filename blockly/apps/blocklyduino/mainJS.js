

let boardFqbn = "";  // Global variable to store selected board's fqbn

function init() {
    var container = document.getElementById('content_blocks');
    var toolbox = document.getElementById('toolbox');

    workspace = Blockly.inject(container, {
        toolbox: toolbox,
        grid: {
            spacing: 25,
            length: 3,
            colour: '#ccc',
            snap: true
        },
        zoom: {
            controls: true,
            wheel: true
        }
    });


    // Fetch board options from the backend
    fetch('/get-boards')
  .then(response => response.json())
  .then(boards => {
      const boardSelect = document.getElementById('boardSelect');
      boardSelect.innerHTML = '<option value="" disabled selected>Select Board</option>';
      
      boards.forEach(board => {
          const option = document.createElement('option');
          option.value = board.fqbn;
          option.textContent = board.name;
          boardSelect.appendChild(option);
      });
  })
  .catch(error => console.error('Error fetching boards:', error));
  
window.addEventListener('resize', onresize, false);
onresize();
auto_save_and_restore_blocks();
}

function selectBoard() {
    const boardSelect = document.getElementById('boardSelect');
    boardFqbn = boardSelect.value;  // Store the selected fqbn
}

function uploadClick() {
    const arduinoCode = Blockly.Arduino.workspaceToCode(workspace);

    // Check if a board is selected before attempting to upload
    if (!boardFqbn) {
        writeToTerminal("Error: No board selected. Please select a board before uploading.");
        return;
    }

    if (!arduinoCode || arduinoCode.trim() === "") {
        writeToTerminal("Error: No Arduino code generated. Please create code before uploading.");
        return;
    }

    try {
        // Send upload request to the main process via IPC
        ipcRenderer.send('start-upload', {
            sketchname: arduinoCode,
            fqbn: boardFqbn
        });

        // Listen for upload progress and output it to the terminal
        ipcRenderer.on('upload-progress', (event, message) => {
            if (message.includes("Error")) {
                writeToTerminal(`Error during upload: ${message}`);
            } else {
                writeToTerminal(message);
            }
        });

        writeToTerminal("Compiling code and starting the upload process...");
    } catch (error) {
        writeToTerminal(`Error: Failed to initiate upload - ${error.message}`);
    }
}




function startUploadStream() {
    const eventSource = new EventSource("/upload-stream");

    eventSource.onmessage = function (event) {
        writeToTerminal(event.data);
    };

    eventSource.onerror = function (event) {
        eventSource.close();
    };

    eventSource.addEventListener('end', function () {
        writeToTerminal("Upload completed successfully.");
        eventSource.close();
    });
}

function writeToTerminal(message) {
    var terminal = document.getElementById('terminal');
    terminal.value += message + '\n';
    terminal.scrollTop = terminal.scrollHeight;
}

function resetClick() {
    workspace.clear();
    writeToTerminal("Workspace reset.");
}

/**
 * Derive a CryptoKey using the password "Robokidz2010"
 * @returns {Promise<CryptoKey>} - The derived key.
 */
async function getDerivedKey() {
    const password = "Robokidz2010"; 
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode("static_salt"),  // Static salt to ensure consistent key derivation
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

/**
 * Encrypt the data using AES-GCM and the derived key.
 * @param {String} data - The plain text data to encrypt.
 * @returns {Promise} - A promise that resolves to the encrypted data (in Base64 format).
 */
async function encryptData(data) {
    const key = await getDerivedKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);

    const encryptedData = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encodedData
    );

    return {
        encrypted: btoa(String.fromCharCode(...new Uint8Array(encryptedData))),
        iv: btoa(String.fromCharCode(...iv)),
    };
}

/**
 * Decrypt the encrypted data using AES-GCM and the derived key.
 * @param {Object} encryptedObj - An object containing encrypted data and iv.
 * @returns {Promise} - A promise that resolves to the decrypted data (plain text).
 */
async function decryptData(encryptedObj) {
    const key = await getDerivedKey();
    const iv = new Uint8Array(atob(encryptedObj.iv).split('').map(char => char.charCodeAt(0)));
    const encryptedData = new Uint8Array(atob(encryptedObj.encrypted).split('').map(char => char.charCodeAt(0)));

    const decryptedData = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encryptedData
    );

    return new TextDecoder().decode(decryptedData);
}

/**
 * Save blocks to an encrypted local file with `.robokidz` extension.
 */
async function save() {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var data = Blockly.Xml.domToText(xml);
    const encryptedObj = await encryptData(data);

    var fileName = window.prompt('What would you like to name your file?', 'RoboKidzDuino');
    if (fileName) {
        const blob = new Blob([JSON.stringify(encryptedObj)], { type: 'text/json' });
        saveAs(blob, fileName + ".robokidz"); // Save the encrypted data as .robokidz
    }
}

/**
 * Load blocks from an encrypted local file with `.robokidz` extension.
 */
async function load(event) {
    var files = event.target.files;
    if (files.length != 1) {
        return;
    }

    var reader = new FileReader();
    reader.onloadend = async function(event) {
        var target = event.target;
        if (target.readyState == 2) {
            try {
                const encryptedObj = JSON.parse(target.result); // Read encrypted data
                const decryptedData = await decryptData(encryptedObj); // Decrypt the data

                var xml = Blockly.Xml.textToDom(decryptedData); // Convert back to XML DOM
            } catch (e) {
                alert('Error parsing or decrypting XML:\n' + e);
                return;
            }
            var count = workspace.getAllBlocks().length;
            if (count && confirm('Replace existing blocks?\n"Cancel" will merge.')) {
                workspace.clear();
            }
            Blockly.Xml.domToWorkspace(workspace, xml); // Restore the blocks
        }
        document.getElementById('load').value = ''; // Reset the input
    };
    reader.readAsText(files[0]);
}

function onresize() {
    var container = document.getElementById('content_area');
    var bBox = getBBox_(container);

    var blocks = document.getElementById('content_blocks');
    var arduino = document.getElementById('content_arduino');

    blocks.style.height = bBox.height + 'px';
    blocks.style.width = 'calc(100% - 20px)';
    arduino.style.height = bBox.height + 'px';
    arduino.style.width = 'calc(100% - 20px)';
}

function getBBox_(element) {
    var height = element.offsetHeight;
    var width = element.offsetWidth;
    var x = 0;
    var y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    return { height: height, width: width, x: x, y: y };
}

function tabClick(clickedName) {
    var blocksTab = document.getElementById('tab_blocks');
    var arduinoTab = document.getElementById('tab_arduino');

    blocksTab.className = clickedName === 'blocks' ? 'tabon' : 'taboff';
    arduinoTab.className = clickedName === 'arduino' ? 'tabon' : 'taboff';

    var blocksContent = document.getElementById('content_blocks');
    var arduinoContent = document.getElementById('content_arduino');

    blocksContent.style.display = clickedName === 'blocks' ? 'block' : 'none';
    arduinoContent.style.display = clickedName === 'arduino' ? 'block' : 'none';

    if (clickedName === 'blocks') {
        workspace.setVisible(true);
        Blockly.svgResize(workspace);
    } else {
        workspace.setVisible(false);
        var arduinoTextarea = document.getElementById('content_arduino');
        arduinoTextarea.value = Blockly.Arduino.workspaceToCode(workspace);
        arduinoTextarea.focus();
    }
}

function auto_save_and_restore_blocks() {
    window.setTimeout(restore_blocks, 0);
    bindEvent(window, 'beforeunload', backup_blocks);  // Use 'beforeunload' to ensure the event is triggered
    tabClick('blocks');  // Initialize the blocks tab as the default view

    var loadInput = document.getElementById('load');
    loadInput.addEventListener('change', load, false);
    document.getElementById('fakeload').onclick = function () {
        loadInput.click();
    };
}


function showTerminal() {
    document.getElementById('terminal').style.display = 'block';
    document.getElementById('serialMonitor').style.display = 'none';
}

function showSerialMonitor() {
    document.getElementById('serialMonitor').style.display = 'block';
    document.getElementById('terminal').style.display = 'none';
}

async function disconnectSerial() {
    if (serialPort) {
        await serialPort.close();
        serialPort = null;
        writeToSerialMonitor("Serial port disconnected.");
    }
}

let serialPort;
let reader;
let textDecoder;
let inputBuffer = '';

async function connectSerial() {
    try {
        // Request and open the serial port.
        serialPort = await navigator.serial.requestPort();
        await serialPort.open({ baudRate: 9600 });

        // Create a text decoder and start reading from the serial port.
        textDecoder = new TextDecoderStream();
        const readableStreamClosed = serialPort.readable.pipeTo(textDecoder.writable);
        reader = textDecoder.readable.getReader();

        // Continuously read data and append it to the buffer.
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                console.log('Serial port has been closed.');
                reader.releaseLock();
                break;
            }

            if (value) {
                // Accumulate data until a newline is found
                inputBuffer += value;
                let newlineIndex;
                
                // Process complete lines in the buffer
                while ((newlineIndex = inputBuffer.indexOf('\n')) >= 0) {
                    const line = inputBuffer.slice(0, newlineIndex).trim();
                    inputBuffer = inputBuffer.slice(newlineIndex + 1);
                    writeToSerialMonitor(line); // Output complete line to the serial monitor
                }
            }
        }
    } catch (error) {
        console.error('Error accessing serial port:', error);
        alert('Could not open serial port. Ensure your device supports Web Serial API and is connected.');
    }
}

function writeToSerialMonitor(message) {
    const serialMonitor = document.getElementById('serialMonitor');
    serialMonitor.value += message + '\n';
    serialMonitor.scrollTop = serialMonitor.scrollHeight;
}

async function disconnectSerial() {
    if (reader) {
        await reader.cancel();
        await serialPort.close();
        reader = null;
        serialPort = null;
        writeToSerialMonitor("Disconnected from serial port.");
    }
}


function listPorts() {
    fetch('/list-ports')
        .then(response => response.json())
        .then(data => {
            if (data && data.ports) {
                let portsList = data.ports.map(port => 
                    `Port: ${port.port}, Protocol: ${port.protocol}, Type: ${port.type}`
                ).join('\n'); // Join each port detail with a newline for a clear, single-line format
                writeToTerminal("Available Ports:\n" + portsList);
            } else {
                writeToTerminal("No ports available.");
            }
        })
        .catch(error => {
            writeToTerminal("Error fetching ports: " + error);
        });
}
