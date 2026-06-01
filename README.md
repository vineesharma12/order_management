# Inventory & Order Management System

A simplified full-stack assessment project for managing products, customers, orders, and inventory tracking.

## Tech Stack

- Backend: Python, FastAPI, SQLAlchemy
- Frontend: React, Vite
- Database: PostgreSQL
- Containers: Docker and Docker Compose

## Business Rules Implemented

- Product SKUs are unique.
- Customer emails are unique.
- Product stock cannot be negative.
- Orders cannot be created for missing customers or products.
- Orders cannot be created when product stock is insufficient.
- Product stock is automatically reduced when an order is placed.
- Database credentials and service URLs are configured through environment variables.

## Run With Docker Compose

1. Create an environment file:

```bash
cp .env.example .env
```

2. Start the application:

```bash
docker compose up --build
```

3. Open the app:

- Frontend: http://localhost:5173
- Backend API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

## Local Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/order_management uvicorn app.main:app --reload
```

## Local Frontend

```bash
cd frontend
npm install
VITE_API_URL=http://localhost:8000 npm run dev
```

## API Overview

- `GET /products`
- `POST /products`
- `PATCH /products/{product_id}`
- `DELETE /products/{product_id}`
- `GET /customers`
- `POST /customers`
- `PATCH /customers/{customer_id}`
- `GET /orders`
- `POST /orders`

## Deployment Notes

For free hosting, use a hosted PostgreSQL provider such as Neon or Supabase, deploy the backend on Render, Railway, or Fly.io, and deploy the frontend on Vercel or Netlify.

Set these production environment variables:

- Backend: `DATABASE_URL`, `FRONTEND_URL`
- Frontend build: `VITE_API_URL`

For Neon, use the PostgreSQL connection string from the Neon dashboard as
`DATABASE_URL`, including `sslmode=require`.

Submission checklist:

- GitHub repository link
- Docker image link
- Live frontend URL
- Live backend/API URL
