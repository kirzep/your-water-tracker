require('dotenv').config();
const { Pool } = require('pg');

async function setupDatabase() {
    // Создаем пул для подключения к PostgreSQL без указания базы данных
    const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres' // Подключаемся к стандартной базе данных
    });

    try {
        console.log('Подключение к PostgreSQL...');
        const client = await pool.connect();
        
        // Создаем базу данных, если она не существует
        console.log('Создание базы данных...');
        await client.query(`
            SELECT 'CREATE DATABASE ${process.env.DB_NAME}'
            WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${process.env.DB_NAME}')
        `);
        
        // Закрываем текущее соединение
        await client.release();
        
        // Создаем новый пул для подключения к нашей базе данных
        const dbPool = new Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const dbClient = await dbPool.connect();
        
        // Создаем таблицы
        console.log('Создание таблиц...');
        
        // Сначала удаляем существующие таблицы, если они есть
        console.log('Удаление существующих таблиц...');
        await dbClient.query(`
            DROP TABLE IF EXISTS water_intake;
            DROP TABLE IF EXISTS users;
        `);
        
        // Создаем таблицы заново
        console.log('Создание таблицы users...');
        await dbClient.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(100) NOT NULL,
                weight FLOAT NOT NULL,
                daily_water_goal FLOAT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        console.log('Создание таблицы water_intake...');
        await dbClient.query(`
            CREATE TABLE water_intake (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                amount FLOAT NOT NULL,
                date DATE NOT NULL DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, date)
            );
        `);

        // Проверяем, что таблицы созданы
        console.log('Проверка структуры таблиц...');
        const usersTable = await dbClient.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users';
        `);
        console.log('Структура таблицы users:', usersTable.rows);

        console.log('База данных и таблицы успешно созданы!');
        await dbClient.release();
    } catch (error) {
        console.error('Ошибка при настройке базы данных:', error);
    } finally {
        await pool.end();
    }
}

setupDatabase(); 