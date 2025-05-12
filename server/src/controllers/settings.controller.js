const User = require('../models/user.model');
const { validationResult } = require('express-validator');

class SettingsController {
    static async updateWeight(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { weight } = req.body;
            const user = await User.updateWeight(req.userId, weight);
            
            res.json({
                message: 'Вес успешно обновлен',
                user: {
                    weight: user.weight,
                    daily_water_goal: user.daily_water_goal
                }
            });
        } catch (error) {
            console.error('Ошибка при обновлении веса:', error);
            res.status(500).json({ message: 'Ошибка при обновлении веса' });
        }
    }
}

module.exports = SettingsController; 