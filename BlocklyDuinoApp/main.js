const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Load your BlocklyDuino page
  win.loadFile(path.join(__dirname, 'blockly/apps/blocklyduino/index.html'));
}

app.whenReady().then(() => {
  // Start the local server for BlocklyDuino
  exec('python -m http.server', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting server: ${error.message}`);
      return;
    }
    console.log(`Server started: ${stdout}`);
  });

  // Start the Arduino upload server
  exec('python arduino_web_server.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting Arduino server: ${error.message}`);
      return;
    }
    console.log(`Arduino server started: ${stdout}`);
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
