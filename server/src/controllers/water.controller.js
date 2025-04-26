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
                message: 'Water intake recorded successfully',
                data: result
            });
        } catch (error) {
            console.error('Add water error:', error);
            res.status(500).json({ message: 'Error recording water intake' });
        }
    }

    static async getProgress(req, res) {
        try {
            const progress = await WaterIntake.getDailyProgress(req.userId);
            res.json(progress);
        } catch (error) {
            console.error('Get progress error:', error);
            res.status(500).json({ message: 'Error getting water intake progress' });
        }
    }
}

module.exports = WaterController; 