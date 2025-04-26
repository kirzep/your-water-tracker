const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create({ username, email, password, weight }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO users (username, email, password, weight, daily_water_goal)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, username, email, weight, daily_water_goal
        `;
        const dailyWaterGoal = weight * 30; // 30 мл воды на 1 кг веса
        const values = [username, email, hashedPassword, weight, dailyWaterGoal];
        
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT id, username, email, password, weight, daily_water_goal FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT id, username, email, weight, daily_water_goal FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async updateWeight(userId, weight) {
        const dailyWaterGoal = weight * 30;
        const query = `
            UPDATE users 
            SET weight = $1, daily_water_goal = $2
            WHERE id = $3
            RETURNING id, username, email, weight, daily_water_goal
        `;
        const result = await pool.query(query, [weight, dailyWaterGoal, userId]);
        return result.rows[0];
    }
}

module.exports = User; 