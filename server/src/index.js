require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const waterRoutes = require('./routes/water.routes');
const WaterIntake = require('./models/water.model');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/water', waterRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Функция для сброса счетчиков воды
async function resetWaterCounters() {
    try {
        await WaterIntake.resetDailyIntake();
        console.log('Water counters reset successfully');
    } catch (error) {
        console.error('Error resetting water counters:', error);
    }
}

// Запускаем сброс счетчиков каждый день в полночь
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetWaterCounters();
    }
}, 60000); // Проверяем каждую минуту

// Database connection
db.connect()
    .then(() => {
        console.log('Database connected successfully');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1);
    }); 