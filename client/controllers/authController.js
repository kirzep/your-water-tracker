const authModel = require('../models/AuthModel');

class AuthController {
    constructor() {
        this.authModel = authModel;
    }

    // Валидация полей
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePassword(password) {
        return password.length >= 6;
    }

    validateWeight(weight) {
        const numWeight = parseFloat(weight);
        return !isNaN(numWeight) && numWeight >= 30 && numWeight <= 300;
    }

    validateUsername(username) {
        return username.length >= 3;
    }

    // Основные методы
    async register(userData) {
        try {
            if (!this.validateUsername(userData.username)) {
                throw new Error('Имя пользователя должно содержать минимум 3 символа');
            }

            if (!this.validateEmail(userData.email)) {
                throw new Error('Пожалуйста, введите корректный email');
            }

            if (!this.validatePassword(userData.password)) {
                throw new Error('Пароль должен содержать минимум 6 символов');
            }

            if (!this.validateWeight(userData.weight)) {
                throw new Error('Вес должен быть от 30 до 300 кг');
            }

            const result = await this.authModel.register(userData);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async login(credentials) {
        try {
            if (!this.validateEmail(credentials.email)) {
                throw new Error('Пожалуйста, введите корректный email');
            }

            if (!this.validatePassword(credentials.password)) {
                throw new Error('Пароль должен содержать минимум 6 символов');
            }

            const result = await this.authModel.login(credentials);
            return result;
        } catch (error) {
            throw error;
        }
    }

    logout() {
        this.authModel.logout();
    }

    isAuthenticated() {
        return this.authModel.isAuthenticated();
    }
}

const authController = new AuthController();
module.exports = authController;
