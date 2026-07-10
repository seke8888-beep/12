# Baǵa — агрегатор цен Казахстана

Полнофункциональный стартовый проект агрегатора цен: FastAPI API, PostgreSQL, React/Next.js интерфейс, Redis и Nginx в Docker Compose.

## Быстрый запуск

```bash
docker compose up --build
```

После запуска:

- Сайт: http://localhost
- API и Swagger: http://localhost/api/docs

В интерфейсе уже есть демонстрационные предложения для Logitech M185. Поиск выполняется по названию, бренду, модели и штрихкоду.

## Структура

- `backend/` — API, модели, JWT-аутентификация, парсеры и тесты.
- `frontend/` — Next.js интерфейс поиска и просмотра цен.
- `nginx/` — единая точка входа для сайта и API.

## Основные API

`GET /api/products`, `GET /api/products/{id}`, `GET /api/search?q=...`, `GET /api/offers`, `GET /api/statistics/{product_id}`, `POST /api/auth/login`, `POST /api/favorites`.
