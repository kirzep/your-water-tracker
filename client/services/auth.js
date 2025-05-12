const User = require('../models/user');

class AuthService {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api/auth';
    }

    // Регистрация пользователя
    async register(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // Создаем экземпляр пользователя
            const user = User.fromJSON(data.user);
            
            // Сохраняем токен и данные пользователя
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(user.toJSON()));

            return user;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // Вход пользователя
    async login(credentials) {
        try {
            const response = await fetch(`${this.baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // Создаем экземпляр пользователя
            const user = User.fromJSON(data.user);
            
            // Сохраняем токен и данные пользователя
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(user.toJSON()));

            return user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Выход пользователя
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Получение текущего пользователя
    getCurrentUser() {
        const userData = localStorage.getItem('user');
        return userData ? User.fromJSON(JSON.parse(userData)) : null;
    }

    // Проверка авторизации
    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    // Получение токена
    getToken() {
        return localStorage.getItem('token');
    }
}

module.exports = new AuthService(); 