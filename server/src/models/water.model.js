const { pool } = require('../config/database');

class WaterIntake {
    static async addWater(userId, amount) {
        const query = `
            INSERT INTO water_intake (user_id, amount)
            VALUES ($1, $2)
            ON CONFLICT (user_id, date) 
            DO UPDATE SET amount = water_intake.amount + $2
            RETURNING amount, date
        `;
        const result = await pool.query(query, [userId, amount]);
        return result.rows[0];
    }

    static async getTodayIntake(userId) {
        const query = `
            SELECT amount, date 
            FROM water_intake 
            WHERE user_id = $1 AND date = CURRENT_DATE
        `;
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    }

    static async getDailyProgress(userId) {
        const query = `
            SELECT 
                w.amount as today_intake,
                u.daily_water_goal,
                (w.amount / u.daily_water_goal * 100) as progress_percentage
            FROM users u
            LEFT JOIN water_intake w ON w.user_id = u.id AND w.date = CURRENT_DATE
            WHERE u.id = $1
        `;
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    }

    static async resetDailyIntake() {
        // Эта функция будет вызываться по расписанию для сброса счетчиков
        const query = `
            DELETE FROM water_intake 
            WHERE date < CURRENT_DATE
        `;
        await pool.query(query);
    }
}

module.exports = WaterIntake; 