const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),  // Add the preload.js path here
            contextIsolation: true,  // Keep contextIsolation enabled for security
            enableRemoteModule: false,  // Disable remote module if not required
            nodeIntegration: false  // Ensure nodeIntegration is false
        }
    });

    win.loadURL('http://127.0.0.1:8080/blockly/apps/blocklyduino/index.html');
}

// Start the Python server when Electron starts
function startPythonServer() {
    const pythonProcess = exec('python arduino_web_server.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting Python server: ${error.message}`);
        }
        if (stderr) {
            console.error(`Python server stderr: ${stderr}`);
        }
        console.log(`Python server stdout: ${stdout}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python server exited with code ${code}`);
    });
}

ipcMain.on('start-upload', (event, data) => {
    const { sketchname, fqbn } = data;

    // Log the received data for debugging
    console.log("Sketchname:", sketchname);
    console.log("FQBN:", fqbn);

    // Use JSON.stringify to properly format the data
    const postData = JSON.stringify({
        code: sketchname,
        fqbn: fqbn
    });

    // Write JSON data to a temporary file to avoid shell interpretation issues
    const fs = require('fs');
    const path = require('path');
    const tempFilePath = path.join(__dirname, 'temp_upload_data.json');

    fs.writeFileSync(tempFilePath, postData);

    // Use the temp file with curl
    const curlCommand = `curl -X POST -H "Content-Type: application/json" --data @${tempFilePath} http://127.0.0.1:8080/upload`;

    console.log("Running curl command:", curlCommand);  // Debugging output

    exec(curlCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error uploading sketch: ${error.message}`);
            event.reply('upload-progress', `Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Upload stderr: ${stderr}`);
        }
        console.log(`Upload stdout: ${stdout}`);  // Print stdout to track progress
        event.reply('upload-progress', stdout);

        // Remove the temp file after upload
        fs.unlinkSync(tempFilePath);
    });
});





app.whenReady().then(() => {
    startPythonServer();
    setTimeout(createWindow, 5000);  // Delay window creation to allow the server to start
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
