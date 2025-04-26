const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Валидация для обновления веса
const updateWeightValidation = [
    body('weight').isFloat({ min: 30, max: 300 }).withMessage('Weight must be between 30 and 300 kg')
];

// Применяем middleware аутентификации ко всем маршрутам
router.use(authMiddleware);

// Маршруты
router.get('/profile', UserController.getProfile);
router.put('/weight', updateWeightValidation, UserController.updateWeight);

module.exports = router; 