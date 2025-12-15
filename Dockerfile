# ============================
# Base stage
# ============================
FROM node:20-slim AS base

WORKDIR /app

# 只启用 corepack
RUN corepack enable


# ============================
# Deps stage (Install dependencies)
# ============================
FROM base AS deps

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Copy workspace source code
COPY packages ./packages
COPY apps/server ./apps/server

# pnpm network configuration
RUN pnpm config set registry https://registry.npmmirror.com \
  && pnpm config set fetch-retries 5 \
  && pnpm config set fetch-timeout 300000

# Install dependencies
RUN pnpm install --frozen-lockfile


# ============================
# Build stage
# ============================
FROM deps AS build

WORKDIR /app

# 1. Build shared-schemas first (server depends on it)
RUN pnpm -C packages/shared-schemas build

# 2. Generate Prisma Client
RUN pnpm -C apps/server prisma:generate

# 3. Build server app
RUN pnpm -C apps/server build


# ============================
# Production stage
# ============================
FROM node:20-slim AS production

WORKDIR /app

# Keep only runtime system dependencies
RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Enable corepack (read packageManager)
RUN corepack enable

# Copy workspace config
COPY --from=deps /app/package.json /app/pnpm-workspace.yaml ./

# Copy all node_modules (includes prisma CLI)
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules

# Copy shared-schemas (runtime dependency)
COPY --from=build /app/packages/shared-schemas/dist ./packages/shared-schemas/dist
COPY --from=deps /app/packages/shared-schemas/package.json ./packages/shared-schemas/

# Copy server files
COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY --from=deps /app/apps/server/prisma ./apps/server/prisma
COPY --from=deps /app/apps/server/package.json ./apps/server/package.json

WORKDIR /app/apps/server

EXPOSE 3000

CMD ["node", "dist/index.js"]