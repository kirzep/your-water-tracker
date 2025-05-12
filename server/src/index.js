require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const waterRoutes = require('./routes/water.routes');
const settingsRoutes = require('./routes/settings.routes');
const WaterIntake = require('./models/water.model');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));
app.use(express.json());

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/settings', settingsRoutes);

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Что-то пошло не так!' });
});

// Функция для сброса счетчиков воды
async function resetWaterCounters() {
    try {
        await WaterIntake.resetDailyIntake();
        console.log('Счетчики воды успешно сброшены');
    } catch (error) {
        console.error('Ошибка при сбросе счетчиков воды:', error);
    }
}

// Запускаем сброс счетчиков каждый день в полночь
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetWaterCounters();
    }
}, 60000); // Проверяем каждую минуту

// Подключение к базе данных
db.connect()
    .then(() => {
        console.log('База данных успешно подключена');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Ошибка подключения к базе данных:', err);
        process.exit(1);
    }); 