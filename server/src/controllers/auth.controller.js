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
                return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
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
                message: 'Пользователь успешно зарегистрирован',
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
            console.error('Ошибка при регистрации:', error);
            res.status(500).json({ message: 'Ошибка при регистрации' });
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
            console.log('Найден пользователь:', user);
            
            if (!user) {
                return res.status(401).json({ message: 'Неверные учетные данные' });
            }

            // Проверяем пароль
            console.log('Сравнение пароля:', password, 'с хешем:', user.password);
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Неверные учетные данные' });
            }

            // Генерируем JWT токен
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.json({
                message: 'Вход выполнен успешно',
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
            console.error('Ошибка при входе:', error);
            res.status(500).json({ message: 'Ошибка при входе' });
        }
    }
}

module.exports = AuthController; 