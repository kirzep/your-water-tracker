class AuthModel {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
        this.token = localStorage.getItem('token');
    }

    // Работа с токеном
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    // Получение токена
    getToken() {
        return this.token;
    }

    // Удаление токена
    removeToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    // Проверка наличия токена
    isAuthenticated() {
        return !!this.token;
    }

    // API запросы
    async register(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при регистрации');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Вход пользователя
    async login(credentials) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при входе');
            }

            this.setToken(data.token);
            return data;
        } catch (error) {
            throw error;
        }
    }

    // Выход пользователя
    logout() {
        this.removeToken();
    }
}

// Экспортируем экземпляр модели
const authModel = new AuthModel();
module.exports = authModel; 