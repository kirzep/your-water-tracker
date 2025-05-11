const authMiddleware = require('../middleware/auth.middleware'); 
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Middleware (Unit)', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = {
            headers: {},
            // userId будет установлен middleware'ом
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn(); // Мок для функции next()

        // Используем тот же секрет, что и в тестах контроллера
        process.env.JWT_SECRET = 'your-test-secret';
    });

    it('должен вызвать next() и установить req.userId, если токен валиден', () => {
        mockReq.headers.authorization = 'Bearer validtoken123';
        const decodedPayload = { userId: 'testUserId' };
        // Мок успешной проверки токена
        jwt.verify.mockReturnValue(decodedPayload);

        authMiddleware(mockReq, mockRes, mockNext);

        expect(jwt.verify).toHaveBeenCalledWith('validtoken123', 'your-test-secret');
        expect(mockReq.userId).toBe('testUserId');
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith(); // next() вызван без ошибок
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('должен вернуть 401, если токен отсутствует', () => {
        authMiddleware(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'No token provided' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('должен вернуть 401, если формат токена неправильный (нет Bearer)', () => {
        mockReq.headers.authorization = 'invalidtoken123'; // Неправильный формат токена

        authMiddleware(mockReq, mockRes, mockNext);
        
        // В auth.middleware.js, если `split(' ')[1]` не найдет токен,
        // `token` будет undefined, и сработает проверка `if (!token)`
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'No token provided' });
        expect(jwt.verify).not.toHaveBeenCalled();
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('должен вернуть 401, если jwt.verify выбрасывает ошибку (невалидный токен)', () => {
        mockReq.headers.authorization = 'Bearer invalidtoken123';
        // Мок ошибки проверки JWT
        jwt.verify.mockImplementation(() => {
            throw new Error('jwt malformed');
        });

        authMiddleware(mockReq, mockRes, mockNext);

        expect(jwt.verify).toHaveBeenCalledWith('invalidtoken123', 'your-test-secret');
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid token' });
        expect(mockNext).not.toHaveBeenCalled();
    });
});