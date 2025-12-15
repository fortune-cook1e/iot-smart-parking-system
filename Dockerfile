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

# Build server app
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

# Copy runtime files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY --from=deps /app/apps/server/package.json ./apps/server/package.json

WORKDIR /app/apps/server

EXPOSE 3000

CMD ["node", "dist/main.js"]