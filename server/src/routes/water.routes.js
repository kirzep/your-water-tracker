const express = require('express');
const { body } = require('express-validator');
const WaterController = require('../controllers/water.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Валидация для добавления воды
const addWaterValidation = [
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number')
];

// Применяем middleware аутентификации ко всем маршрутам
router.use(authMiddleware);

// Маршруты
router.post('/add', addWaterValidation, WaterController.addWater);
router.get('/progress', WaterController.getProgress);

module.exports = router; 