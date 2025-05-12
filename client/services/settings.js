const authService = require('./auth');

class SettingsService {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api/settings';
    }

    // Получение заголовков с токеном авторизации
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
        };
    }

    // Получение настроек пользователя
    async getSettings() {
        try {
            const response = await fetch(`${this.baseUrl}`, {
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return data;
        } catch (error) {
            console.error('Error getting settings:', error);
            throw error;
        }
    }

    // Обновление настроек пользователя
    async updateSettings(settings) {
        try {
            const response = await fetch(`${this.baseUrl}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(settings)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return data;
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    }

    // Обновление веса пользователя
    async updateWeight(weight) {
        try {
            const response = await fetch(`${this.baseUrl}/weight`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({ weight })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return data;
        } catch (error) {
            console.error('Error updating weight:', error);
            throw error;
        }
    }

    // Получение уведомлений
    async getNotifications() {
        try {
            const response = await fetch(`${this.baseUrl}/notifications`, {
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return data;
        } catch (error) {
            console.error('Error getting notifications:', error);
            throw error;
        }
    }

    // Обновление настроек уведомлений
    async updateNotificationSettings(settings) {
        try {
            const response = await fetch(`${this.baseUrl}/notifications`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(settings)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return data;
        } catch (error) {
            console.error('Error updating notification settings:', error);
            throw error;
        }
    }
}

module.exports = new SettingsService(); 