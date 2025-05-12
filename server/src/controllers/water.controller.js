const WaterIntake = require('../models/water.model');
const { validationResult } = require('express-validator');

class WaterController {
    static async addWater(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { amount } = req.body;
            const result = await WaterIntake.addWater(req.userId, amount);
            
            res.json({
                message: 'Потребление воды успешно записано',
                data: {
                    amount: result.amount,
                    date: result.date,
                    dailyGoal: result.daily_water_goal
                }
            });
        } catch (error) {
            console.error('Ошибка при добавлении воды:', error);
            res.status(500).json({ message: 'Ошибка при записи потребления воды' });
        }
    }

    static async getProgress(req, res) {
        try {
            const progress = await WaterIntake.getDailyProgress(req.userId);
            
            if (!progress) {
                return res.status(404).json({ message: 'Данные не найдены' });
            }

            res.json({
                amount: progress.today_intake || 0,
                dailyGoal: progress.daily_water_goal,
                progressPercentage: progress.progress_percentage || 0
            });
        } catch (error) {
            console.error('Ошибка при получении прогресса:', error);
            res.status(500).json({ message: 'Ошибка при получении прогресса потребления воды' });
        }
    }
}

module.exports = WaterController; 