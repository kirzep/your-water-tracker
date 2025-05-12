const { ipcRenderer } = require('electron');
const authService = require('../services/auth');
const waterService = require('../services/water');
const settingsService = require('../services/settings');

// DOM Elements
const todayProgress = document.getElementById('todayProgress');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const dailyGoal = document.getElementById('dailyGoal');
const currentWeight = document.getElementById('currentWeight');
const waterForm = document.getElementById('waterForm');
const weightForm = document.getElementById('weightForm');
const logoutButton = document.getElementById('logoutButton');

// Кастомные кнопки управления окном
const minimizeBtn = document.getElementById('minimizeBtn');
const maximizeBtn = document.getElementById('maximizeBtn');
const closeBtn = document.getElementById('closeBtn');

// Проверка аутентификации
if (!authService.isAuthenticated()) {
    ipcRenderer.send('show-login');
}

// Загрузка профиля пользователя
async function loadUserProfile() {
    try {
        console.log('Loading user profile...');
        const user = authService.getCurrentUser();
        console.log('User profile loaded:', user);
        
        // Обновляем отображение данных пользователя
        currentWeight.textContent = `${user.weight} кг`;
        dailyGoal.textContent = `${user.dailyWaterGoal} мл`;
        
        // Загружаем прогресс потребления воды
        updateProgress();
    } catch (error) {
        console.error('Error loading profile:', error);
        alert('Ошибка при загрузке профиля');
        if (error.message.includes('401')) {
            ipcRenderer.send('show-login');
        }
    }
}

// Обновление прогресса
async function updateProgress() {
    try {
        console.log('Updating water progress...');
        const waterData = await waterService.getDailyWater();
        console.log('Progress data:', waterData);
        
        const intake = waterData.amount || 0;
        const goal = waterData.dailyGoal;
        const percentage = waterData.getProgressPercentage();

        todayProgress.textContent = `${intake} мл`;
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${Math.round(percentage)}% от дневной нормы`;

        // Добавляем анимацию при обновлении прогресса
        progressBar.classList.add('transition-all', 'duration-500', 'ease-in-out');
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

// Функция для показа ошибки
function showError(message) {
    const modal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    const closeBtn = document.getElementById('errorCloseBtn');

    errorMessage.textContent = message;
    modal.classList.add('show');

    // Закрытие модального окна при клике на кнопку
    closeBtn.onclick = () => {
        modal.classList.remove('show');
    };

    // Закрытие модального окна при клике вне его
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    };
}

// Обработчик отправки формы веса
weightForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const weight = parseFloat(weightInput.value);

    if (isNaN(weight) || weight < 20 || weight > 300) {
        showError('Введите корректный вес (от 20 до 300 кг)');
        return;
    }

    try {
        const data = await settingsService.updateWeight(weight);
        if (!data || !data.user) {
            throw new Error('Invalid server response format');
        }

        // Обновляем отображение веса и дневной нормы
        currentWeight.textContent = `${data.user.weight} кг`;
        dailyGoal.textContent = `${data.user.daily_water_goal} мл`;

        // Анимация обновления
        currentWeight.classList.add('updated');
        dailyGoal.classList.add('updated');
        setTimeout(() => {
            currentWeight.classList.remove('updated');
            dailyGoal.classList.remove('updated');
        }, 1000);

        // Очищаем поле ввода
        weightInput.value = '';

        // Обновляем прогресс после изменения веса
        const waterData = await waterService.getDailyWater();
        if (waterData) {
            updateProgress(waterData.amount, waterData.dailyGoal);
        }
    } catch (error) {
        console.error('Error updating weight:', error);
        showError(error.message || 'Ошибка при обновлении веса');
    }
});

// Обработчик отправки формы воды
waterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = parseInt(waterAmount.value);

    if (isNaN(amount) || amount <= 0) {
        showError('Введите корректное количество воды');
        return;
    }

    try {
        const data = await waterService.addWaterEntry(amount);
        if (!data || !data.amount) {
            throw new Error('Invalid server response format');
        }

        // Обновляем прогресс
        updateProgress(data.amount, data.dailyGoal);

        // Анимация добавления воды
        const progressBar = document.getElementById('progressBar');
        progressBar.classList.add('updated');
        setTimeout(() => {
            progressBar.classList.remove('updated');
        }, 1000);

        // Очищаем поле ввода
        waterAmount.value = '';
    } catch (error) {
        console.error('Error adding water:', error);
        showError(error.message || 'Ошибка при добавлении воды');
    }
});

// Выход из системы
logoutButton.addEventListener('click', () => {
    authService.logout();
    ipcRenderer.send('show-login');
});

// Начальная загрузка
loadUserProfile();

if (minimizeBtn) minimizeBtn.addEventListener('click', () => ipcRenderer.send('window-minimize'));
if (maximizeBtn) maximizeBtn.addEventListener('click', () => ipcRenderer.send('window-maximize'));
if (closeBtn) closeBtn.addEventListener('click', () => ipcRenderer.send('window-close')); 