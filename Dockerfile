# ============================================
# Base
# ============================================
FROM node:20-slim AS base

# 启用 corepack（自动使用最新 pnpm）
RUN corepack enable

WORKDIR /app

# 系统依赖（Prisma / tfjs-node 需要）
RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  curl \
  && rm -rf /var/lib/apt/lists/*

# ============================================
# Dependencies
# ============================================
FROM base AS deps

# pnpm 网络与 registry 配置（pnpm v10+）
RUN pnpm config set registry https://registry.npmmirror.com \
  && pnpm config set fetch-retries 5 \
  && pnpm config set fetch-timeout 300000

# workspace 配置
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY tsconfig.base.json ./

# monorepo 源码
COPY packages ./packages
COPY apps/server ./apps/server

# ⚠️ 只 install 一次（dev + prod）
RUN pnpm install --frozen-lockfile

# ============================================
# Build
# ============================================
FROM deps AS builder

WORKDIR /app/apps/server

# Prisma
RUN pnpm prisma generate --schema=./prisma/schema.prisma

# Build
RUN pnpm build

# ============================================
# Production
# ============================================
FROM node:20-slim AS production

ENV NODE_ENV=production

RUN corepack enable

WORKDIR /app

# 复制依赖（包含 Prisma engine）
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# server package.json
COPY apps/server/package.json ./apps/server/package.json

# 剪裁为生产依赖（pnpm v10 推荐方式）
RUN pnpm --filter server --prod prune

# 构建产物
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/prisma ./apps/server/prisma

WORKDIR /app/apps/server

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "dist/index.js"]