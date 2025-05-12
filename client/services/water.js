const Water = require('../models/water');
const authService = require('./auth');

class WaterService {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api/water';
    }

    // Получение заголовков с токеном авторизации
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
        };
    }

    // Добавление записи о потреблении воды
    async addWaterEntry(amount) {
        try {
            console.log('Sending request to add water:', amount);
            const response = await fetch(`${this.baseUrl}/add`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ amount })
            });

            const data = await response.json();
            console.log('Server response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add water entry');
            }

            // Проверяем структуру ответа
            if (!data.data) {
                throw new Error('Invalid server response format');
            }

            return Water.fromJSON(data.data);
        } catch (error) {
            console.error('Error adding water entry:', error);
            throw error;
        }
    }

    // Получение данных о потреблении воды за день
    async getDailyWater() {
        try {
            console.log('Fetching daily water data...');
            const response = await fetch(`${this.baseUrl}/progress`, {
                headers: this.getHeaders()
            });

            const data = await response.json();
            console.log('Daily water data:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to get daily water data');
            }

            // Проверяем структуру ответа
            if (!data || typeof data.amount === 'undefined') {
                throw new Error('Invalid server response format');
            }

            return Water.fromJSON(data);
        } catch (error) {
            console.error('Error getting daily water:', error);
            throw error;
        }
    }

    // Получение статистики за период
    async getStatistics(startDate, endDate) {
        try {
            const response = await fetch(
                `${this.baseUrl}/statistics?startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: this.getHeaders()
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return data.map(entry => Water.fromJSON(entry));
        } catch (error) {
            console.error('Error getting statistics:', error);
            throw error;
        }
    }

    // Обновление дневной цели
    async updateDailyGoal(goal) {
        try {
            const response = await fetch(`${this.baseUrl}/goal`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({ goal })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return data;
        } catch (error) {
            console.error('Error updating daily goal:', error);
            throw error;
        }
    }
}

module.exports = new WaterService(); 