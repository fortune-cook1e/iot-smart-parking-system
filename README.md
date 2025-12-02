# IoT Smart Parking System

A modern IoT-based smart parking management system built with a mobile-first approach. This monorepo contains both the mobile application and backend server.

## 🏗️ Project Structure

```
ht2025-iot-smart-parking-system/
├── apps/
│   ├── mobile/          # React Native mobile app (Expo)
│   └── server/          # Node.js + Express backend
├── .eslintrc.js         # Shared ESLint configuration
├── .prettierrc          # Shared Prettier configuration
└── pnpm-workspace.yaml  # PNPM workspace configuration
```

## 🚀 Tech Stack

### Mobile App

- **Framework**: React Native with Expo
- **Router**: Expo Router
- **Language**: TypeScript
- **UI Components**: Expo Vector Icons, React Navigation

### Backend Server

- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Features**: CORS support, Environment variables

## 📋 Prerequisites

- Node.js >= 18.x
- pnpm >= 8.x
- Expo CLI (will be installed with dependencies)

## 🛠️ Installation

```bash
# Install all dependencies across the monorepo
pnpm install
```

## 💻 Development

### Run Both Apps Simultaneously

```bash
# Run mobile and server in parallel
pnpm run dev
```

### Run Individual Apps

```bash
# Mobile app only
pnpm --filter mobile start

# Backend server only
pnpm --filter server dev
```

### Mobile-Specific Commands

```bash
# Start Expo with Android
pnpm --filter mobile android

# Start Expo with iOS
pnpm --filter mobile ios

# Start Expo web version
pnpm --filter mobile web
```

### Server-Specific Commands

```bash
# Build TypeScript
pnpm --filter server build

# Run production build
pnpm --filter server start

# Type checking
pnpm --filter server type-check
```

## 🔧 Code Quality

### Linting

```bash
# Lint entire project
pnpm lint

# Auto-fix linting issues
pnpm lint:fix
```

### Formatting

```bash
# Format all files
pnpm format

# Check formatting without modifying
pnpm format:check
```

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

## 🌐 Environment Variables

### Server

Create `.env` file in `apps/server/`:

```env
PORT=3000
NODE_ENV=development
```

See `apps/server/.env.example` for all available options.

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

## 🏃‍♂️ Quick Start Guide

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ht2025-iot-smart-parking-system
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp apps/server/.env.example apps/server/.env
   ```

4. **Start development**

   ```bash
   pnpm run dev
   ```

5. **Access the applications**
   - Mobile: Scan QR code with Expo Go app
   - Server: http://localhost:3000

## 📝 Available Scripts

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `pnpm install`      | Install all dependencies           |
| `pnpm run dev`      | Run mobile and server concurrently |
| `pnpm mobile`       | Start mobile app only              |
| `pnpm server`       | Start server only                  |
| `pnpm lint`         | Lint all code                      |
| `pnpm lint:fix`     | Fix linting issues                 |
| `pnpm format`       | Format all code                    |
| `pnpm format:check` | Check code formatting              |

## 🤝 Contributing

1. Follow the ESLint and Prettier configurations
2. Write meaningful commit messages
3. Test your changes before committing
4. Keep dependencies up to date

## 📄 License

ISC
