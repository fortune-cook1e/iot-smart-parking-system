# IoT Smart Parking System

Modern smart parking management system with React Native mobile app and Node.js backend.

## Tech Stack

- Mobile: React Native + Expo + TypeScript
- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL

## Prerequisites

- Node.js >= 18.x
- pnpm >= 8.x
- Docker & Docker Compose

## 📱 Mobile App Features

- Tab-based navigation
- Cross-platform support (iOS, Android, Web)
- Modern UI with Expo components
- Type-safe routing with Expo Router

## 🖥️ Server Features

- RESTful API endpoints
- TypeScript for type safety
- CORS enabled
- Environment-based configuration
- Health check endpoint

## Quick Start

```bash
# 1. Install
git clone <repository-url>
cd ht2025-iot-smart-parking-system
pnpm install

# 2. Start database
docker-compose up -d

# 3. Setup backend
cp apps/server/.env.example apps/server/.env
cd apps/server
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
cd ../..

# 4. Start dev
pnpm run dev
```

## Access

- Mobile: Scan QR with Expo Go
- Server: http://localhost:3000
- Prisma Studio: `pnpm --filter server prisma:studio` → http://localhost:5555
- pgAdmin: http://localhost:5050 (admin@parking.com / admin)

## Commands

```bash
# Run
pnpm run dev                       # Both apps
pnpm --filter mobile start         # Mobile only
pnpm --filter server dev           # Server only

# Database
pnpm --filter server prisma:migrate    # Run migrations
pnpm --filter server prisma:studio     # Open GUI
pnpm --filter server prisma:seed       # Seed data

# Code quality
pnpm lint && pnpm format
```

## Database

**PostgreSQL**: `localhost:5432` / `smart_parking` / `parking_user` / `parking_password`

**pgAdmin**: Use host `postgres` (not localhost) when adding server

## Test Accounts

- `admin@parking.com` / `admin123`
- `user@parking.com` / `user123`

## 📦 Managing Dependencies

### Add Dependencies to Specific Workspace

```bash
# Add to mobile app
pnpm --filter mobile add <package-name>

# Add to server
pnpm --filter server add <package-name>

# Add dev dependency
pnpm --filter mobile add -D <package-name>
```

### Examples

```bash
# Add React Native UI library to mobile
pnpm --filter mobile add react-native-paper

# Add database library to server
pnpm --filter server add mongoose

# Add testing library to server
pnpm --filter server add -D jest @types/jest
```

## 🤝 Contributing

1. Follow the ESLint and Prettier configurations
2. Write meaningful commit messages
3. Test your changes before committing
4. Keep dependencies up to date

## 📄 License

ISC
