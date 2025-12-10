# WebSocket Real-time Updates - 使用说明

## 📡 功能概述

移动应用现在支持通过 WebSocket 实时接收停车位状态更新。当你订阅的停车位状态改变时（占用/可用），你会立即收到通知。

## 🚀 实现的功能

### 1. **自动连接管理**

- 用户登录后自动连接 WebSocket
- 用户登出后自动断开连接
- 自动重连机制（最多 5 次尝试）

### 2. **停车位订阅**

- 订阅停车位时自动监听该停车位的 Socket 更新
- 取消订阅时自动停止监听
- Profile 页面自动订阅所有已订阅的停车位

### 3. **实时通知**

- 停车位状态改变时显示 Toast 通知
- 显示停车位名称和新状态（占用/可用）
- 地图和列表自动更新数据

### 4. **数据同步**

- Parking 地图页面实时更新停车位状态
- Profile 订阅列表实时更新停车位信息
- 跨页面数据保持一致

## 📦 新增文件

```
apps/mobile/
├── config/
│   └── socket.ts           # Socket.IO 配置和工具函数
└── hooks/
    └── use-socket.ts       # Socket 相关的 React Hooks
```

## 🔧 主要 API

### Socket 配置 (`config/socket.ts`)

```typescript
// 初始化 Socket 连接
initializeSocket(): Promise<Socket | null>

// 获取当前 Socket 实例
getSocket(): Socket | null

// 断开连接
disconnectSocket(): void

// 订阅停车位更新
subscribeToParking(parkingSpaceId: string): void

// 取消订阅停车位
unsubscribeFromParking(parkingSpaceId: string): void

// 监听停车位更新事件
onParkingSpaceUpdate(callback: (data: any) => void): () => void
```

### React Hooks (`hooks/use-socket.ts`)

```typescript
// 主 Hook - 管理 Socket 连接
useSocket(): {
  socket: Socket | null
  isConnected: boolean
  subscribe: (parkingSpaceId: string) => void
  unsubscribe: (parkingSpaceId: string) => void
}

// 监听停车位更新
useParkingSpaceUpdates(callback: (data: any) => void): void
```

## 💡 使用示例

### 在组件中监听更新

```typescript
import { useSocket, useParkingSpaceUpdates } from '@/hooks/use-socket';

function MyComponent() {
  const { isConnected, subscribe, unsubscribe } = useSocket();

  // 监听所有停车位更新
  useParkingSpaceUpdates(useCallback((data) => {
    console.log('Parking space updated:', data);
    // 更新你的状态
  }, []));

  // 订阅特定停车位
  const handleSubscribe = (spaceId: string) => {
    subscribe(spaceId);
  };

  return <View>...</View>;
}
```

## 🔍 WebSocket 事件

### 客户端发送

| 事件                        | 参数                     | 说明           |
| --------------------------- | ------------------------ | -------------- |
| `subscribe:parking-space`   | `parkingSpaceId: string` | 订阅停车位更新 |
| `unsubscribe:parking-space` | `parkingSpaceId: string` | 取消订阅       |

### 服务器推送

| 事件                    | 数据           | 说明           |
| ----------------------- | -------------- | -------------- |
| `parking-space:updated` | `ParkingSpace` | 停车位状态更新 |

## 🎯 工作流程

1. **用户登录**
   - ✅ 自动初始化 Socket 连接
   - ✅ 使用 JWT Token 认证

2. **订阅停车位**
   - ✅ 调用 API 创建订阅记录
   - ✅ Socket 发送 `subscribe:parking-space` 事件
   - ✅ 开始接收该停车位的实时更新

3. **接收更新**
   - ✅ 服务器推送 `parking-space:updated` 事件
   - ✅ 更新本地数据（地图、列表）
   - ✅ 显示 Toast 通知

4. **取消订阅**
   - ✅ Socket 发送 `unsubscribe:parking-space` 事件
   - ✅ 调用 API 删除订阅记录
   - ✅ 停止接收该停车位的更新

5. **用户登出**
   - ✅ 自动断开 Socket 连接
   - ✅ 清除所有订阅状态

## 🧪 测试方法

### 方法 1: 使用 HTML Demo 页面

1. 启动服务器
2. 打开 `http://localhost:3000/public/websocket-demo.html`
3. 登录获取 Token
4. 在 Demo 页面连接 WebSocket
5. 使用模拟器改变停车位状态
6. 观察移动应用是否收到实时更新

### 方法 2: 使用两个设备

1. 设备 A: 订阅某个停车位
2. 设备 B: 使用模拟器改变该停车位状态
3. 设备 A 应该立即收到通知

### 方法 3: 使用 API 直接测试

```bash
# 模拟传感器数据更新
curl -X POST http://localhost:3000/api/sensors/simulate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "parkingSpaceId": "PARKING_SPACE_ID",
    "isOccupied": true
  }'
```

## 🐛 调试

### 查看 Socket 连接状态

在浏览器控制台或应用日志中查找：

- `✅ Socket connected: xxxxx` - 连接成功
- `❌ Socket disconnected: reason` - 断开连接
- `Subscribed to parking space: xxx` - 订阅成功
- `Parking space updated: {...}` - 收到更新

### 常见问题

1. **Socket 无法连接**
   - 检查服务器是否运行
   - 检查 Token 是否有效
   - 检查网络连接

2. **收不到更新**
   - 确认已订阅停车位
   - 检查 Socket 连接状态
   - 查看服务器日志

3. **频繁断线重连**
   - 检查网络稳定性
   - 查看服务器负载
   - 检查 Token 过期时间

## 🔐 安全性

- ✅ JWT Token 认证
- ✅ 只能接收已订阅停车位的更新
- ✅ 自动重连机制
- ✅ 连接失败自动降级

## 📊 性能优化

- ✅ 单例 Socket 连接（跨组件共享）
- ✅ 自动清理事件监听器
- ✅ 防止重复订阅
- ✅ 智能重连策略

## 🎨 用户体验

- ✅ Toast 通知（不干扰用户操作）
- ✅ 静默更新（后台自动同步）
- ✅ 视觉反馈（连接状态指示）
- ✅ 优雅降级（Socket 断开时仍可使用基本功能）

---

**注意**: 确保 `socket.io-client` 已安装：

```bash
pnpm add socket.io-client
```

环境变量配置 (`.env`):

```
EXPO_PUBLIC_API_URL=http://localhost:3000
```
