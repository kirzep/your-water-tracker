const authController = require('../controllers/AuthController');

// Вспомогательные функции
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
}

function clearError() {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = '';
}

function redirectToDashboard() {
    window.location.href = 'dashboard.html';
}

// Обработчики форм
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearError();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await authController.login({ email, password });
            redirectToDashboard();
        } catch (error) {
            showError(error.message);
        }
    });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearError();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const weight = parseFloat(document.getElementById('weight').value);

        try {
            await authController.register({ username, email, password, weight });
            redirectToDashboard();
        } catch (error) {
            showError(error.message);
        }
    });
}

// Проверка аутентификации при загрузке
document.addEventListener('DOMContentLoaded', () => {
    if (authController.isAuthenticated()) {
        redirectToDashboard();
    }
}); 