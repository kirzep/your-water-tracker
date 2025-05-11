const AuthController = require('../controllers/auth.controller');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Подготавливаем моки для тестирования
jest.mock('../models/user.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('express-validator');

describe('AuthController (Unit)', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        // Сбрасываем все моки перед каждым тестом
        jest.clearAllMocks();

        mockReq = {
            body: {},
            // Здесь можно добавить другие свойства req (params, query, headers)
        };
        mockRes = {
            status: jest.fn().mockReturnThis(), // Для цепочки вызовов res.status().json()
            json: jest.fn(),
        };

        // Устанавливаем переменные окружения для тестов
        process.env.JWT_SECRET = 'your-test-secret';
        process.env.JWT_EXPIRES_IN = '1h';
    });

    describe('register', () => {
        it('должен успешно зарегистрировать пользователя', async () => {
            mockReq.body = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                weight: 70,
            };

            // Настраиваем мок валидации - ошибок нет
            validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
            // Мок для поиска пользователя - пользователь не найден
            User.findByEmail.mockResolvedValue(null);
            // Мок для создания пользователя - успешно
            const mockCreatedUser = {
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                weight: 70,
                daily_water_goal: 2100, // 70 * 30
            };
            User.create.mockResolvedValue(mockCreatedUser);
            // Мок для генерации JWT токена
            const mockToken = 'mocked-jwt-token';
            jwt.sign.mockReturnValue(mockToken);

            await AuthController.register(mockReq, mockRes);

            expect(validationResult).toHaveBeenCalledWith(mockReq);
            expect(User.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(User.create).toHaveBeenCalledWith({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123', // Пароль передается как есть, хеширование происходит в user.model.js
                weight: 70,
            });
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: mockCreatedUser.id },
                'your-test-secret',
                { expiresIn: '1h' }
            );
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User registered successfully',
                user: {
                    id: mockCreatedUser.id,
                    username: mockCreatedUser.username,
                    email: mockCreatedUser.email,
                    weight: mockCreatedUser.weight,
                    dailyWaterGoal: mockCreatedUser.daily_water_goal,
                },
                token: mockToken,
            });
        });

        it('должен вернуть 400, если есть ошибки валидации', async () => {
            // Настраиваем мок с ошибками валидации
            validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'Invalid email' }] });

            await AuthController.register(mockReq, mockRes);

            expect(validationResult).toHaveBeenCalledWith(mockReq);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ errors: [{ msg: 'Invalid email' }] });
            expect(User.findByEmail).not.toHaveBeenCalled();
        });

        it('должен вернуть 400, если пользователь с таким email уже существует', async () => {
            mockReq.body = { email: 'existing@example.com', password: 'password123', username: 'existing' };
            validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
            // Мок для поиска пользователя - пользователь найден
            User.findByEmail.mockResolvedValue({ id: 2, email: 'existing@example.com' });

            await AuthController.register(mockReq, mockRes);

            expect(User.findByEmail).toHaveBeenCalledWith('existing@example.com');
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'User with this email already exists' });
            expect(User.create).not.toHaveBeenCalled();
        });

        it('должен вернуть 500 при ошибке во время регистрации', async () => {
            mockReq.body = { username: 'erroruser', email: 'error@example.com', password: 'password', weight: 60 };
            validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
            User.findByEmail.mockResolvedValue(null);
            // Мок для ошибки базы данных
            User.create.mockRejectedValue(new Error('DB error'));

            await AuthController.register(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error during registration' });
        });
    });

    describe('login', () => {
        it('должен успешно аутентифицировать пользователя', async () => {
            mockReq.body = { email: 'test@example.com', password: 'password123' };
            const mockUser = {
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                password: 'hashedPassword', // Хешированный пароль из БД
                weight: 70,
                daily_water_goal: 2100,
            };
            const mockToken = 'mocked-login-token';

            validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
            User.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true); // Пароль совпадает
            jwt.sign.mockReturnValue(mockToken);

            await AuthController.login(mockReq, mockRes);

            expect(User.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: mockUser.id },
                'your-test-secret',
                { expiresIn: '1h' }
            );
            // Примечание: успешный ответ логина использует статус 200 по умолчанию
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Login successful',
                user: {
                    id: mockUser.id,
                    username: mockUser.username,
                    email: mockUser.email,
                    weight: mockUser.weight,
                    dailyWaterGoal: mockUser.daily_water_goal,
                },
                token: mockToken,
            });
        });

        it('должен вернуть 400 при ошибках валидации при логине', async () => {
            // Настраиваем мок с ошибками валидации
            validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{msg: 'Password required'}] });

            await AuthController.login(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ errors: [{msg: 'Password required'}] });
            expect(User.findByEmail).not.toHaveBeenCalled();
        });

        it('должен вернуть 401, если пользователь не найден', async () => {
            mockReq.body = { email: 'notfound@example.com', password: 'password123' };
            validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
            // Мок для поиска пользователя - пользователь не найден
            User.findByEmail.mockResolvedValue(null);

            await AuthController.login(mockReq, mockRes);

            expect(User.findByEmail).toHaveBeenCalledWith('notfound@example.com');
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
            expect(bcrypt.compare).not.toHaveBeenCalled();
        });

        it('должен вернуть 401, если пароль неверный', async () => {
            mockReq.body = { email: 'test@example.com', password: 'wrongpassword' };
            const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
            validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
            User.findByEmail.mockResolvedValue(mockUser);
            // Мок для несовпадения паролей
            bcrypt.compare.mockResolvedValue(false);

            await AuthController.login(mockReq, mockRes);

            expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it('должен вернуть 500 при ошибке во время логина', async () => {
            mockReq.body = { email: 'error@example.com', password: 'password' };
            validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
            // Мок для ошибки подключения к БД
            User.findByEmail.mockRejectedValue(new Error('DB connection error'));

            await AuthController.login(mockReq, mockRes);
            
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error during login' });
        });
    });
});