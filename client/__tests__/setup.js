// Mock window.alert
window.alert = jest.fn();

// Mock console methods
console.log = jest.fn();
console.error = jest.fn();

// Mock fetch
global.fetch = jest.fn(); 