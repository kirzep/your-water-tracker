const User = require('../models/user.model');
const { validationResult } = require('express-validator');

class UserController {
    static async getProfile(req, res) {
        try {
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ message: 'Error getting user profile' });
        }
    }

    static async updateWeight(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { weight } = req.body;
            const user = await User.updateWeight(req.userId, weight);
            
            res.json({
                message: 'Weight updated successfully',
                user
            });
        } catch (error) {
            console.error('Update weight error:', error);
            res.status(500).json({ message: 'Error updating weight' });
        }
    }
}

module.exports = UserController; 