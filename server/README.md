# Water Tracker Server

Серверная часть приложения для отслеживания потребления воды.

## Требования

- Node.js (версия 14 или выше)
- PostgreSQL (версия 12 или выше)

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корневой директории проекта со следующим содержимым:
```
# Конфигурация сервера
PORT=3000
NODE_ENV=development

# Конфигурация базы данных PostgreSQL
DB_HOST=localhost
DB_PORT=5431
DB_NAME=water-tracker-test
DB_USER=postgres
DB_PASSWORD=2284

# JWT конфигурация
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# CORS конфигурация
CORS_ORIGIN=http://localhost:3000
```

4. Создайте базу данных и таблицы:
```bash
psql -U postgres -d water-tracker-test -f src/database/init.sql
```

## Запуск

Для запуска в режиме разработки:
```bash
npm run dev
```

Для запуска в продакшн режиме:
```bash
npm start
```

## API Endpoints

### Аутентификация

- `POST /api/auth/register` - Регистрация нового пользователя
- `POST /api/auth/login` - Вход в систему

### Пользователь

- `GET /api/users/profile` - Получение профиля пользователя
- `PUT /api/users/weight` - Обновление веса пользователя

## Тестирование

Для запуска тестов:
```bash
npm test
```

## Структура проекта

```
server/
├── src/
│   ├── config/         # Конфигурация приложения
│   ├── controllers/    # Контроллеры
│   ├── middleware/     # Middleware
│   ├── models/         # Модели данных
│   ├── routes/         # Маршруты API
│   ├── database/       # SQL скрипты
│   └── tests/          # Тесты
├── .env               # Конфигурация окружения
└── package.json       # Зависимости и скрипты
``` 