# ============================
# Base stage
# ============================
FROM node:20-slim AS base

WORKDIR /app

# 系统依赖（Prisma / HTTPS / Node native deps 常用）
RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  curl \
  && rm -rf /var/lib/apt/lists/*

# 启用 corepack（不要用 npm install -g pnpm）
RUN corepack enable

# ============================
# Deps stage（只负责安装依赖）
# ============================
FROM base AS deps

WORKDIR /app

# 先复制 package.json 和 lockfile
# ⚠️ package.json 中必须包含：
# "packageManager": "pnpm@8.11.0"
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# 再复制 workspace 源码（保证 lockfile 命中缓存）
COPY packages ./packages
COPY apps/server ./apps/server

# pnpm 国内镜像 & 网络参数（按你现有配置保留）
RUN pnpm config set registry https://registry.npmmirror.com \
  && pnpm config set fetch-retries 5 \
  && pnpm config set fetch-timeout 300000

# 安装依赖（严格使用 lockfile）
RUN pnpm install --frozen-lockfile

# ============================
# Build stage（如果你需要 build）
# ============================
FROM deps AS build

WORKDIR /app

# 如果是 NestJS / TS 项目
RUN pnpm -C apps/server build

# ============================
# Production stage
# ============================
FROM node:20-slim AS production

WORKDIR /app

# 只安装运行期必需的系统依赖
RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# 启用 corepack（仍然会读取 packageManager）
RUN corepack enable

# 复制运行所需文件
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY --from=deps /app/apps/server/package.json ./apps/server/package.json

WORKDIR /app/apps/server

EXPOSE 3000

CMD ["node", "dist/main.js"]
