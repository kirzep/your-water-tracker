module.exports = {
    testEnvironment: 'jsdom',
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverageFrom: [
        '**/*.js',
        '!**/node_modules/**',
        '!**/__tests__/**',
        '!scripts/main.js',
        '!scripts/api.js',
        '!models/userModel.js',
        '!controllers/authController.js',
        '!scripts/renderers/login.js',
        '!scripts/renderers/register.js'
    ],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 60,
            lines: 60,
            statements: 60
        }
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
    },
    setupFiles: ['./__tests__/setup.js']
}; 