const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

// Валидация для регистрации
const registerValidation = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('weight').isFloat({ min: 30, max: 300 }).withMessage('Weight must be between 30 and 300 kg')
];

// Валидация для входа
const loginValidation = [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

// Маршруты
router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);

module.exports = router; 