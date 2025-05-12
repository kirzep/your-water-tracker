const { ipcRenderer } = require('electron');
const authService = require('../services/auth');

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');

// Кастомные кнопки управления окном
const minimizeBtn = document.getElementById('minimizeBtn');
const maximizeBtn = document.getElementById('maximizeBtn');
const closeBtn = document.getElementById('closeBtn');

console.log('Auth script loaded');

// Show/Hide Forms
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Login Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Login form submitted');
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const submitButton = loginForm.querySelector('button[type="submit"]');

    if (!email || !password) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    try {
        // Отключаем кнопку на время запроса
        submitButton.disabled = true;
        submitButton.classList.add('opacity-50', 'cursor-not-allowed');
        
        console.log('Sending login request...');
        await authService.login({ email, password });
        console.log('Login successful, sending auth-success event');
        ipcRenderer.send('auth-success');
    } catch (error) {
        console.error('Login error:', error);
        // Очищаем поле пароля при ошибке
        document.getElementById('loginPassword').value = '';
        // Показываем ошибку в более дружелюбном формате
        alert(error.message === 'Invalid credentials' ? 'Неверный email или пароль' : error.message);
    } finally {
        // Включаем кнопку обратно
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }
});

// Register Handler
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Register form submitted');
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const weight = document.getElementById('registerWeight').value;
    const submitButton = registerForm.querySelector('button[type="submit"]');

    console.log('Form data:', { username, email, weight }); // Не логируем пароль

    if (!username || !email || !password || !weight) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    if (weight < 30 || weight > 300) {
        alert('Пожалуйста, введите корректный вес (от 30 до 300 кг)');
        return;
    }

    try {
        // Отключаем кнопку на время запроса
        submitButton.disabled = true;
        submitButton.classList.add('opacity-50', 'cursor-not-allowed');

        console.log('Sending register request...');
        await authService.register({ username, email, password, weight });
        console.log('Registration successful, sending auth-success event');
        ipcRenderer.send('auth-success');
    } catch (error) {
        console.error('Registration error:', error);
        // Очищаем поля пароля и email при ошибке
        document.getElementById('registerPassword').value = '';
        document.getElementById('registerEmail').value = '';
        // Показываем ошибку в более дружелюбном формате
        alert(error.message === 'User with this email already exists' ? 
            'Пользователь с таким email уже существует' : 
            error.message);
    } finally {
        // Включаем кнопку обратно
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }
});

if (minimizeBtn) minimizeBtn.addEventListener('click', () => ipcRenderer.send('window-minimize'));
if (maximizeBtn) maximizeBtn.addEventListener('click', () => ipcRenderer.send('window-maximize'));
if (closeBtn) closeBtn.addEventListener('click', () => ipcRenderer.send('window-close')); 