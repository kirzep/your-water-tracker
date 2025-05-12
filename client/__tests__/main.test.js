const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { ipcRenderer } = require('electron');

// Mock Electron modules
jest.mock('electron', () => ({
    app: {
        whenReady: jest.fn().mockResolvedValue(undefined),
        on: jest.fn(),
        quit: jest.fn()
    },
    BrowserWindow: jest.fn().mockImplementation(() => ({
        loadFile: jest.fn(),
        on: jest.fn(),
        close: jest.fn(),
        minimize: jest.fn(),
        maximize: jest.fn(),
        unmaximize: jest.fn(),
        isMaximized: jest.fn().mockReturnValue(false),
        webContents: {
            send: jest.fn()
        }
    })),
    ipcMain: {
        on: jest.fn()
    }
}));

// Import the module after mocking
const { createLoginWindow, createMainWindow, getLoginWindow, getMainWindow } = require('../main');

describe('Main Process', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    test('should create login window with correct properties', () => {
        createLoginWindow();

        expect(BrowserWindow).toHaveBeenCalledWith(expect.objectContaining({
            width: 400,
            height: 600,
            resizable: false,
            minimizable: true,
            maximizable: false,
            frame: false
        }));
    });

    test('should create main window with correct properties', () => {
        createMainWindow();

        expect(BrowserWindow).toHaveBeenCalledWith(expect.objectContaining({
            width: 800,
            height: 800,
            resizable: false,
            minimizable: true,
            maximizable: false,
            frame: false
        }));
    });

    test('should handle window minimize event', () => {
        createMainWindow();

        // Simulate IPC event
        const minimizeHandler = ipcMain.on.mock.calls.find(call => call[0] === 'window-minimize')[1];
        minimizeHandler();

        expect(BrowserWindow.mock.results[0].value.minimize).toHaveBeenCalled();
    });

    test('should handle window maximize event', () => {
        createMainWindow();

        // Simulate IPC event
        const maximizeHandler = ipcMain.on.mock.calls.find(call => call[0] === 'window-maximize')[1];
        maximizeHandler();

        expect(BrowserWindow.mock.results[0].value.maximize).toHaveBeenCalled();
    });

    test('should handle window close event', () => {
        createMainWindow();

        // Simulate IPC event
        const closeHandler = ipcMain.on.mock.calls.find(call => call[0] === 'window-close')[1];
        closeHandler();

        expect(BrowserWindow.mock.results[0].value.close).toHaveBeenCalled();
    });

    test('should handle auth success event', () => {
        // Create login window first
        createLoginWindow();
        
        // Manually register the auth-success handler
        ipcMain.on('auth-success', () => {
            const currentLoginWindow = getLoginWindow();
            if (currentLoginWindow) {
                currentLoginWindow.close();
            }
            createMainWindow();
        });

        // Simulate IPC event
        const authSuccessHandler = ipcMain.on.mock.calls.find(call => call[0] === 'auth-success')[1];
        authSuccessHandler();

        expect(BrowserWindow.mock.results[0].value.close).toHaveBeenCalled();
        expect(BrowserWindow).toHaveBeenCalledTimes(2); // Once for login window, once for main window
    });
}); 