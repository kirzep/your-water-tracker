const { ipcRenderer } = require('electron');

// Mock Electron modules
jest.mock('electron', () => ({
    ipcRenderer: {
        send: jest.fn()
    }
}));

// Mock DOM elements and localStorage
document.body.innerHTML = `
    <form id="loginForm">
        <input id="loginEmail" type="email" value="test@example.com">
        <input id="loginPassword" type="password" value="password123">
        <button type="submit">Login</button>
    </form>
    <form id="registerForm" class="hidden">
        <input id="registerUsername" type="text" value="testuser">
        <input id="registerEmail" type="email" value="test@example.com">
        <input id="registerPassword" type="password" value="password123">
        <input id="registerWeight" type="number" value="70">
        <button type="submit">Register</button>
    </form>
    <a id="showRegister">Show Register</a>
    <a id="showLogin">Show Login</a>
    <button id="minimizeBtn">Minimize</button>
    <button id="maximizeBtn">Maximize</button>
    <button id="closeBtn">Close</button>
`;

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Import the module after mocking
require('../scripts/auth');

describe('Authentication', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
                clear: jest.fn()
            },
            writable: true
        });
    });

    describe('Form Navigation', () => {
        test('should show register form when clicking show register link', () => {
            document.getElementById('showRegister').click();
            expect(document.getElementById('loginForm').classList.contains('hidden')).toBe(true);
            expect(document.getElementById('registerForm').classList.contains('hidden')).toBe(false);
        });

        test('should show login form when clicking show login link', () => {
            document.getElementById('showRegister').click(); // First show register
            document.getElementById('showLogin').click(); // Then show login
            expect(document.getElementById('loginForm').classList.contains('hidden')).toBe(false);
            expect(document.getElementById('registerForm').classList.contains('hidden')).toBe(true);
        });
    });

    describe('Login Form', () => {
        test('should show alert when submitting empty login form', () => {
            const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
            expect(alertMock).toHaveBeenCalledWith('Пожалуйста, заполните все поля');
            alertMock.mockRestore();
        });

        test('should handle successful login', async () => {
            const mockResponse = {
                ok: true,
                json: () => Promise.resolve({
                    token: 'test-token',
                    user: { id: 1, email: 'test@example.com' }
                })
            };
            global.fetch.mockResolvedValueOnce(mockResponse);
            document.getElementById('loginEmail').value = 'test@example.com';
            document.getElementById('loginPassword').value = 'password123';
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
            expect(window.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ id: 1, email: 'test@example.com' }));
            expect(ipcRenderer.send).toHaveBeenCalledWith('auth-success');
        });

        test('should handle failed login', async () => {
            const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
            document.getElementById('loginEmail').value = 'test@example.com';
            document.getElementById('loginPassword').value = 'password123';
            const mockResponse = {
                ok: false,
                json: () => Promise.resolve({
                    message: 'Invalid credentials'
                })
            };
            global.fetch.mockResolvedValueOnce(mockResponse);
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(alertMock).toHaveBeenCalledWith('Неверный email или пароль');
            expect(document.getElementById('loginPassword').value).toBe('');
            alertMock.mockRestore();
        });
    });

    describe('Register Form', () => {
        test('should show alert when submitting empty register form', () => {
            const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
            document.getElementById('registerUsername').value = '';
            document.getElementById('registerEmail').value = '';
            document.getElementById('registerPassword').value = '';
            document.getElementById('registerWeight').value = '';
            document.getElementById('registerForm').dispatchEvent(new Event('submit'));
            expect(alertMock).toHaveBeenCalledWith('Пожалуйста, заполните все поля');
            alertMock.mockRestore();
        });

        test('should show alert for invalid weight', () => {
            const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
            document.getElementById('registerUsername').value = 'testuser';
            document.getElementById('registerEmail').value = 'test@example.com';
            document.getElementById('registerPassword').value = 'password123';
            document.getElementById('registerWeight').value = '10';
            document.getElementById('registerForm').dispatchEvent(new Event('submit'));
            expect(alertMock).toHaveBeenCalledWith('Пожалуйста, введите корректный вес (от 20 до 300 кг)');
            alertMock.mockRestore();
        });

        test('should handle successful registration', async () => {
            const mockResponse = {
                ok: true,
                json: () => Promise.resolve({
                    token: 'test-token',
                    user: { id: 1, email: 'test@example.com' }
                })
            };
            global.fetch.mockResolvedValueOnce(mockResponse);
            document.getElementById('registerUsername').value = 'testuser';
            document.getElementById('registerEmail').value = 'test@example.com';
            document.getElementById('registerPassword').value = 'password123';
            document.getElementById('registerWeight').value = '70';
            document.getElementById('registerForm').dispatchEvent(new Event('submit'));
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
            expect(window.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ id: 1, email: 'test@example.com' }));
            expect(ipcRenderer.send).toHaveBeenCalledWith('auth-success');
        });

        test('should handle failed registration', async () => {
            const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
            document.getElementById('registerUsername').value = 'testuser';
            document.getElementById('registerEmail').value = 'test@example.com';
            document.getElementById('registerPassword').value = 'password123';
            document.getElementById('registerWeight').value = '70';
            const mockResponse = {
                ok: false,
                json: () => Promise.resolve({
                    message: 'User with this email already exists'
                })
            };
            global.fetch.mockResolvedValueOnce(mockResponse);
            document.getElementById('registerForm').dispatchEvent(new Event('submit'));
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(alertMock).toHaveBeenCalledWith('Пользователь с таким email уже существует');
            expect(document.getElementById('registerPassword').value).toBe('');
            expect(document.getElementById('registerEmail').value).toBe('');
            alertMock.mockRestore();
        });
    });

    describe('Window Controls', () => {
        test('should send minimize event when clicking minimize button', () => {
            document.getElementById('minimizeBtn').click();
            expect(ipcRenderer.send).toHaveBeenCalledWith('window-minimize');
        });

        test('should send maximize event when clicking maximize button', () => {
            document.getElementById('maximizeBtn').click();
            expect(ipcRenderer.send).toHaveBeenCalledWith('window-maximize');
        });

        test('should send close event when clicking close button', () => {
            document.getElementById('closeBtn').click();
            expect(ipcRenderer.send).toHaveBeenCalledWith('window-close');
        });
    });
}); 