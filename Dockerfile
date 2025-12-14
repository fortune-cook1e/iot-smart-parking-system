# Dockerfile
FROM node:20-alpine AS base

# 安装指定版本的 pnpm（与你本地一致）
ENV PNPM_VERSION=9.14.4
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

# 设置工作目录
WORKDIR /app

# 复制 workspace 配置
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY tsconfig.base.json ./

# ============================================
# 依赖安装阶段
# ============================================
FROM base AS dependencies

# 复制所有需要的包
COPY packages ./packages
COPY apps/server ./apps/server

# 安装所有依赖（包括 dev）
RUN pnpm install --frozen-lockfile

# ============================================
# 构建阶段
# ============================================
FROM dependencies AS builder

# 生成 Prisma Client
WORKDIR /app/apps/server
RUN pnpm prisma:generate

# 构建 TypeScript
RUN pnpm build

# ============================================
# 生产阶段
# ============================================
FROM node:20-alpine AS production

# 安装指定版本的 pnpm
ENV PNPM_VERSION=9.14.4
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /app

# 复制 workspace 配置
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY tsconfig.base.json ./

# 复制包配置
COPY packages ./packages
COPY apps/server/package.json ./apps/server/

# 安装所有依赖（先安装全部，然后用 prune）
RUN pnpm install --frozen-lockfile

# 使用 pnpm deploy 来获取生产依赖
WORKDIR /app/apps/server
RUN pnpm --filter server --prod deploy /tmp/production

# 清理并复制生产依赖
WORKDIR /app
RUN rm -rf node_modules apps/server/node_modules && \
  cp -R /tmp/production/node_modules ./apps/server/

# 复制构建产物
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/prisma ./apps/server/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/apps/server/node_modules/.prisma ./apps/server/node_modules/.prisma

# 设置工作目录
WORKDIR /app/apps/server

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# 启动命令
CMD ["node", "dist/index.js"]