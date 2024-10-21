// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose ipcRenderer to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    sendUpload: (data) => ipcRenderer.send('start-upload', data),
    onUploadProgress: (callback) => ipcRenderer.on('upload-progress', callback)
});
