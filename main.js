const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,  // This enables remote module access for certain Electron versions
            webSecurity: false,  // Disable for local development, secure for production later
        }
    });

    // Load the local server into the Electron window
    win.loadURL('http://localhost:8080/blockly/apps/blocklyduino/index.html');

    // Uncomment for debugging
    // win.webContents.openDevTools();
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

app.whenReady().then(() => {
    startPythonServer();  // Start the Python server
    setTimeout(createWindow, 5000);  // Wait 5 seconds to ensure the server starts before opening the window
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
