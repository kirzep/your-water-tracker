const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

class AuthController {
    static async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username, email, password, weight } = req.body;
            
            // Проверяем, существует ли пользователь с таким email
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email already exists' });
            }

            // Создаем нового пользователя
            const user = await User.create({ username, email, password, weight });

            // Генерируем JWT токен
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    weight: user.weight,
                    dailyWaterGoal: user.daily_water_goal
                },
                token
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Error during registration' });
        }
    }

    static async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;
            
            // Находим пользователя по email
            const user = await User.findByEmail(email);
            console.log('Found user:', user);
            
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Проверяем пароль
            console.log('Comparing password:', password, 'with hash:', user.password);
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Генерируем JWT токен
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    weight: user.weight,
                    dailyWaterGoal: user.daily_water_goal
                },
                token
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Error during login' });
        }
    }
}

module.exports = AuthController; 