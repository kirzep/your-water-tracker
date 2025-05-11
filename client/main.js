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

  mainWindow.loadFile(path.join(__dirname, 'views/login.html'));

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Инициализация приложения
app.whenReady().then(createWindow);

// Обработка закрытия окна
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Обработка активации приложения
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Обработка навигации
ipcMain.on('navigate', (event, page) => {
  mainWindow.loadFile(path.join(__dirname, `views/${page}.html`));
});