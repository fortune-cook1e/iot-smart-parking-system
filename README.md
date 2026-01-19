# IoT Smart Parking System

**Monorepo** for a smart parking system: **Mobile App**, **Admin Dashboard**, **Backend API** (Socket.IO realtime), **Shared schemas/types**, plus a **Python AI/ML** service for **occupancy probability**.

## Monorepo Structure

- **apps/mobile**: React Native + Expo (user mobile app)
- **apps/dashboard**: Next.js (admin dashboard)
- **apps/server**: Express + Prisma (**REST API** + **Socket.IO** + **Swagger**)
- **packages/shared-schemas**: shared **Zod** schemas + **TypeScript** types
- **AI-ML**: FastAPI prediction service + training scripts
- **docs**: API/WebSocket notes

## Key Features

- **Parking spaces**: list/detail/filter/CRUD (server + dashboard)
- **Realtime updates**: subscription-based notifications via **Socket.IO**
- **IoT webhook ingestion**: update occupancy/price by **sensorId** and notify subscribers
- **Dashboard AI Chatbot**: parking analysis & pricing suggestions via **Ollama** (**gpt-oss**) with **streaming (SSE)**
- **Occupancy prediction**: Python **FastAPI** service returns **occupied_probability**
- **Shared DTO validation**: **@iot-smart-parking-system/shared-schemas** across Mobile/Dashboard/Server

## Tech Stack

- **Mobile**: React Native + Expo + TypeScript + Expo Router + Socket.IO Client
- **Dashboard**: Next.js + TypeScript + Tailwind + Zustand
- **Server**: Node.js + Express + TypeScript + Prisma + PostgreSQL + Socket.IO + Swagger
- **AI/ML**: Python + FastAPI + scikit-learn
- **Tooling**: pnpm workspaces + ESLint + Prettier

## Prerequisites

- Node.js >= 18
- pnpm >= 8
- Docker / Docker Compose (for local PostgreSQL and production deployment)
- (Optional) Python 3.11 (for running/training AI-ML locally)

## Quick Start (Local Development)

### 1) Install dependencies

```bash
pnpm install
```

### 2) Start PostgreSQL

```bash
docker compose up -d
```

### 3) Configure the server and initialize the database

```bash
cp apps/server/.env.example apps/server/.env

pnpm --filter server prisma:generate
pnpm --filter server prisma:migrate
pnpm --filter server prisma:seed
```

### 4) (Optional) Enable Dashboard AI Chatbot (Ollama)

The AI Chatbot uses the server endpoint `/api/ai-chat` and requires **Ollama** running locally.

```bash
# Start Ollama (if not already running)
ollama serve

# Pull the default model used by this repo
ollama pull gpt-oss:latest
```

### 5) (Optional) Start the AI/ML prediction service

Option A: Run locally with Python

```bash
cd AI-ML
python train_model.py
python service.py
```

Option B: Run only the ML service with Docker

```bash
docker build -t ht2025-parking-ml ./AI-ML
docker run --rm -p 3002:3002 ht2025-parking-ml
```

### 6) Start dev (recommended)

```bash
pnpm dev
```

Or start only what you need:

```bash
pnpm dev:server
pnpm dev:dashboard
pnpm dev:mobile
```

## Service URLs

- **Server API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api-docs
- **Dashboard**: http://localhost:8080
- **Prisma Studio**: run `pnpm --filter server prisma:studio`, then open http://localhost:5555
- **AI/ML Service** (FastAPI): http://localhost:3002 (OpenAPI: http://localhost:3002/docs)

## Environment Variables (Common)

### Server (apps/server/.env)

- **PORT**: default 3000
- **DATABASE_URL**: PostgreSQL connection string
- **JWT_SECRET** / **JWT_EXPIRES_IN**: auth configuration
- **AI_ML_SERVICE_URL** (optional): ML service base URL (defaults to http://localhost:3002)
- **OLLAMA_MODEL** (optional): chatbot model name (defaults to **gpt-oss:latest**)

### Dashboard (apps/dashboard/.env)

- **NEXT_PUBLIC_API_BASE_URL**: server base URL (defaults to http://localhost:3000)

### Mobile (apps/mobile/.env)

- **EXPO_PUBLIC_API_BASE_URL**: production/custom server base URL (in dev, the app derives your local IP from the Expo host)

## Seed Accounts

- Admin: admin@parking.com / admin123
- User: user@parking.com / user123

## Common Commands

```bash
# Full dev (mobile + server + dashboard + shared-schemas)
pnpm dev

# Run a specific app/package
pnpm server
pnpm dashboard
pnpm mobile

# Database / Prisma
pnpm --filter server prisma:migrate
pnpm --filter server prisma:seed
pnpm --filter server prisma:studio

# Shared schemas (watch/build)
pnpm schemas
pnpm build:schemas

# Code quality
pnpm lint
pnpm format
```

## Documentation

- System and APIs: docs/PARKING_SYSTEM.md
- WebSocket guide: docs/WEBSOCKET_GUIDE.md
- WebSocket troubleshooting: docs/WEBSOCKET_TROUBLESHOOTING.md
- shared-schemas usage: docs/shared-schemas-USAGE.md

## Preview

https://private-user-images.githubusercontent.com/29733380/530798908-767aa198-3d44-4c37-b058-83441419e47f.mp4?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjcwMzM5MzgsIm5iZiI6MTc2NzAzMzYzOCwicGF0aCI6Ii8yOTczMzM4MC81MzA3OTg5MDgtNzY3YWExOTgtM2Q0NC00YzM3LWIwNTgtODM0NDE0MTllNDdmLm1wND9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTEyMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUxMjI5VDE4NDAzOFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTNhNTFjOWUxNTIxODVlYTc4ZWYzMTY2YmQ1ZWNlYWJmZjhiYmRlOTdhYjVjYTcxYjEzNzYyNmYwYTgzZDlhNWQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.IO9eBPakIDKPMPBJqZG3FBzCWV3zrnuH2YL1FJlSeM0

https://private-user-images.githubusercontent.com/29733380/537631965-230fa436-3ced-43a5-9e80-28189c934ddd.mp4?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Njg4MzU1MjcsIm5iZiI6MTc2ODgzNTIyNywicGF0aCI6Ii8yOTczMzM4MC81Mzc2MzE5NjUtMjMwZmE0MzYtM2NlZC00M2E1LTllODAtMjgxODljOTM0ZGRkLm1wND9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjAxMTklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwMTE5VDE1MDcwN1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTdhYjYyNDVhYWVkNmNlODg4ODJjZTE5Njk4MTExZjRjZWNiZjMyNDVkNDVlNzhkY2VmYzE2MjkxMDRiN2UxNmEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.WnScc_J23U8U-en-sV76izt-FF9_MPDyQTq4kh0Q9Kk

## License

ISC
