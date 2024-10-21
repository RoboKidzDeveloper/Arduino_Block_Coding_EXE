const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const http = require('http');  // Add this line to import the http module

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false,
        }
    });

    win.loadURL('http://localhost:8080/blockly/apps/blocklyduino/index.html');
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
    startPythonServer();
    setTimeout(createWindow, 5000);
});

ipcMain.on('start-upload', (event, args) => {
    const { sketchname, fqbn } = args;

    const data = JSON.stringify({
        code: sketchname,
        fqbn: fqbn
    });

    const options = {
        hostname: 'localhost',
        port: 8080,
        path: '/upload',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        let output = '';
        res.on('data', (chunk) => {
            output += chunk;
        });
        res.on('end', () => {
            event.sender.send('upload-progress', output);
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
        event.sender.send('upload-progress', `Error: ${e.message}`);
    });

    req.write(data);
    req.end();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
