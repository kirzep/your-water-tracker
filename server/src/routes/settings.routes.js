const express = require('express');
const { body } = require('express-validator');
const SettingsController = require('../controllers/settings.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Валидация для обновления веса
const updateWeightValidation = [
    body('weight').isFloat({ min: 20, max: 300 }).withMessage('Weight must be between 20 and 300 kg')
];

// Применяем middleware аутентификации ко всем маршрутам
router.use(authMiddleware);

// Маршруты
router.put('/weight', updateWeightValidation, SettingsController.updateWeight);

module.exports = router; 