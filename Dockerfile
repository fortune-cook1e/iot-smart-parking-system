# ============================
# Base stage
# ============================
FROM node:20-slim AS base
WORKDIR /app
RUN corepack enable


# ============================
# Deps stage
# ============================
FROM base AS deps
WORKDIR /app

RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./
COPY packages ./packages
COPY apps/server ./apps/server

RUN pnpm config set registry https://registry.npmmirror.com \
  && pnpm config set fetch-retries 5 \
  && pnpm config set fetch-timeout 300000

RUN pnpm install --frozen-lockfile


# ============================
# Build stage
# ============================
FROM deps AS build
WORKDIR /app

RUN pnpm -C packages/shared-schemas build
RUN pnpm -C apps/server prisma:generate
RUN pnpm -C apps/server build


# ============================
# Production stage
# ============================
FROM node:20-slim AS production
WORKDIR /app

RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# ⛔ 不启用 corepack
# ⛔ 不需要 pnpm

COPY --from=deps /app/node_modules ./node_modules

COPY --from=build /app/packages/shared-schemas/dist ./packages/shared-schemas/dist
COPY --from=deps /app/packages/shared-schemas/package.json ./packages/shared-schemas/

COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY --from=deps /app/apps/server/prisma ./apps/server/prisma
COPY --from=deps /app/apps/server/package.json ./apps/server/package.json

WORKDIR /app/apps/server

EXPOSE 3000
CMD ["node", "dist/index.js"]