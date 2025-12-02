# Server

IoT Smart Parking System - Backend Server

## Tech Stack

- Node.js
- TypeScript
- Express
- CORS
- dotenv

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

The server will start on `http://localhost:3000`

### Build

```bash
pnpm build
```

### Production

```bash
pnpm start
```

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
PORT=3000
NODE_ENV=development
```
