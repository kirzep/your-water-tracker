const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // На macOS обычно приложения остаются активными до явного выхода пользователем
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // На macOS принято пересоздавать окно, когда иконка приложения нажата
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});