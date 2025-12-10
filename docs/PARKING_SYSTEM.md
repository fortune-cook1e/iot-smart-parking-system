# IoT Smart Parking System - 停车位管理和订阅功能

## 功能概述

### 1. 停车位信息管理

- 停车位表结构：
  - `id`: UUID 主键
  - `sensorId`: 传感器ID（唯一）
  - `description`: 停车位描述
  - `location`: 停车位位置
  - `isOccupied`: 是否被占用
  - `currentPrice`: 当前价格
  - `createdAt`: 创建时间
  - `updatedAt`: 更新时间

### 2. 订阅功能

- 用户可以订阅感兴趣的停车位
- 当订阅的停车位状态变化时，会实时推送通知
- 订阅表结构：
  - `id`: UUID 主键
  - `userId`: 用户ID
  - `parkingSpaceId`: 停车位ID
  - `createdAt`: 创建时间
  - 唯一约束：(userId, parkingSpaceId)

## API 端点

### 停车位管理 (Parking Spaces)

#### GET /api/parking-spaces

获取停车位列表（支持筛选和分页）

- 查询参数：
  - `isOccupied`: 是否被占用 (true/false)
  - `location`: 位置关键词
  - `minPrice`: 最低价格
  - `maxPrice`: 最高价格
  - `page`: 页码 (默认: 1)
  - `limit`: 每页数量 (默认: 10)
- 需要认证: ✅

#### POST /api/parking-spaces

创建新的停车位

- 请求体：
  ```json
  {
    "sensorId": "SENSOR-001",
    "description": "Ground floor, near entrance",
    "location": "Building A, Floor 1, Row 3, Spot 15",
    "isOccupied": false,
    "currentPrice": 5.5
  }
  ```
- 需要认证: ✅

#### GET /api/parking-spaces/:id

根据ID获取停车位详情

- 需要认证: ✅

#### PUT /api/parking-spaces/:id

更新停车位信息

- 需要认证: ✅

#### DELETE /api/parking-spaces/:id

删除停车位

- 需要认证: ✅

### 订阅管理 (Subscriptions)

#### POST /api/subscriptions

订阅停车位

- 请求体：
  ```json
  {
    "parkingSpaceId": "uuid-of-parking-space"
  }
  ```
- 需要认证: ✅

#### GET /api/subscriptions

获取当前用户的所有订阅

- 返回订阅列表及停车位详情
- 需要认证: ✅

#### GET /api/subscriptions/check/:parkingSpaceId

检查是否已订阅某个停车位

- 需要认证: ✅

#### DELETE /api/subscriptions/:parkingSpaceId

取消订阅停车位

- 需要认证: ✅

### IoT 传感器 Webhook (IoT Sensors)

#### POST /api/sensors/webhook

传感器状态更新webhook

- 请求体：
  ```json
  {
    "sensorId": "SENSOR-001",
    "isOccupied": true,
    "currentPrice": 6.0
  }
  ```
- 无需认证（供传感器调用）
- 会自动通知订阅该停车位的用户

## WebSocket 实时通知

### 连接

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'Bearer your-jwt-token',
  },
});
```

### 事件

#### 订阅停车位更新

```javascript
socket.emit('subscribe:parking-space', parkingSpaceId);
```

#### 取消订阅

```javascript
socket.emit('unsubscribe:parking-space', parkingSpaceId);
```

#### 接收停车位状态更新

```javascript
socket.on('parking-space:updated', data => {
  console.log('Parking space updated:', data);
  // data 包含: id, sensorId, location, isOccupied, currentPrice, updatedAt
});
```

## 工作流程

### 用户订阅流程

1. 用户浏览停车位列表 `GET /api/parking-spaces`
2. 选择感兴趣的停车位，调用订阅接口 `POST /api/subscriptions`
3. 建立 WebSocket 连接并订阅该停车位
4. 当停车位状态变化时，实时收到通知

### 传感器更新流程

1. IoT 传感器检测到停车位状态变化
2. 调用 webhook 接口 `POST /api/sensors/webhook`
3. 服务器更新数据库中的停车位状态
4. 通过 WebSocket 推送通知给所有订阅该停车位的用户

## 数据库迁移

运行以下命令创建数据库表：

```bash
cd apps/server
npx prisma migrate dev --name add_parking_spaces_and_subscriptions
npx prisma generate
```

## 安装依赖

```bash
# 根目录
pnpm install

# 构建 shared-schemas 包
pnpm build:schemas

# 或者开启 watch 模式
pnpm schemas
```

## 启动服务器

```bash
# 开发模式
pnpm server

# 或者同时启动 schemas watch 和 server
pnpm dev:all
```

## 访问 API 文档

服务器启动后，访问 Swagger 文档：

- http://localhost:3000/api-docs

## 示例场景

### 场景 1: 用户订阅停车位

```javascript
// 1. 登录获取 token
const loginRes = await fetch('http://localhost:3000/api/authenticate/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' }),
});
const { token } = await loginRes.json();

// 2. 获取停车位列表
const spacesRes = await fetch('http://localhost:3000/api/parking-spaces?isOccupied=false', {
  headers: { Authorization: `Bearer ${token}` },
});
const spaces = await spacesRes.json();

// 3. 订阅第一个可用停车位
const subscribeRes = await fetch('http://localhost:3000/api/subscriptions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ parkingSpaceId: spaces.data.parkingSpaces[0].id }),
});

// 4. 建立 WebSocket 连接
const socket = io('http://localhost:3000', {
  auth: { token },
});

socket.emit('subscribe:parking-space', spaces.data.parkingSpaces[0].id);

socket.on('parking-space:updated', data => {
  if (!data.isOccupied) {
    alert(`停车位 ${data.location} 现在可用！价格: ${data.currentPrice}`);
  }
});
```

### 场景 2: 传感器更新停车位状态

```bash
# 模拟传感器发送状态更新
curl -X POST http://localhost:3000/api/sensors/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "sensorId": "SENSOR-001",
    "isOccupied": false,
    "currentPrice": 5.5
  }'
```

## 响应码

系统使用自定义响应码：

- `10000`: SUCCESS - 成功
- `10001`: CREATED - 创建成功
- `10002`: UPDATED - 更新成功
- `10003`: DELETED - 删除成功
- `40001`: UNAUTHORIZED - 未授权
- `40005`: NOT_FOUND - 未找到
- `40010`: VALIDATION_ERROR - 验证错误

## 技术栈

- **后端**: Node.js, Express, TypeScript
- **数据库**: PostgreSQL, Prisma ORM
- **实时通信**: Socket.IO
- **验证**: Zod (共享 schemas)
- **认证**: JWT
- **文档**: Swagger/OpenAPI
