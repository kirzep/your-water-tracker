const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let loginWindow;

function createLoginWindow() {
    loginWindow = new BrowserWindow({
        width: 400,
        height: 600,
        resizable: false,
        minimizable: true,
        maximizable: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    loginWindow.loadFile('views/login.html');
    
    loginWindow.on('closed', () => {
        loginWindow = null;
    });

    // IPC управление окном
    ipcMain.on('window-minimize', () => {
        if (loginWindow) loginWindow.minimize();
    });
    ipcMain.on('window-maximize', () => {
        if (loginWindow) {
            if (loginWindow.isMaximized()) {
                loginWindow.unmaximize();
            } else {
                loginWindow.maximize();
            }
        }
    });
    ipcMain.on('window-close', () => {
        if (loginWindow) loginWindow.close();
    });
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        resizable: false,
        minimizable: true,
        maximizable: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('views/main.html');
    
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Обработка фокуса окна
    mainWindow.on('focus', () => {
        mainWindow.webContents.send('window-focused');
    });

    // IPC управление окном
    ipcMain.on('window-minimize', () => {
        if (mainWindow) mainWindow.minimize();
    });
    ipcMain.on('window-maximize', () => {
        if (mainWindow) {
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
        }
    });
    ipcMain.on('window-close', () => {
        if (mainWindow) mainWindow.close();
    });
}

app.whenReady().then(() => {
    createLoginWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createLoginWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Обработчики IPC для аутентификации
ipcMain.on('auth-success', () => {
    console.log('Auth success received');
    if (loginWindow) {
        loginWindow.close();
    }
    createMainWindow();
});

ipcMain.on('show-login', () => {
    console.log('Show login received');
    if (mainWindow) {
        mainWindow.close();
    }
    createLoginWindow();
});

// Export functions and variables for testing
module.exports = {
    createLoginWindow,
    createMainWindow,
    getLoginWindow: () => loginWindow,
    getMainWindow: () => mainWindow
};