const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('views/register.html');
}

app.whenReady().then(createWindow);

ipcMain.on('load-main-page', () => {
  mainWindow.loadFile('views/main.html');
});