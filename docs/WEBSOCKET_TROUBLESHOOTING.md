# WebSocket 连接故障排除

## ❌ 错误: "websocket error"

### 快速修复步骤

#### 1️⃣ 检查环境变量

创建 `apps/mobile/.env` 文件：

```bash
# 如果在 iOS 模拟器
EXPO_PUBLIC_API_URL=http://localhost:3000

# 如果在真机上（使用你的电脑 IP）
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000

# Android 模拟器会自动转换为 10.0.2.2
```

#### 2️⃣ 获取你的本地 IP 地址

**macOS:**

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**查找类似这样的输出:**

```
inet 192.168.1.100 netmask 0xffffff00 broadcast 192.168.1.255
```

使用这个 IP: `http://192.168.1.100:3000`

#### 3️⃣ 确保服务器正在运行

```bash
cd apps/server
pnpm dev

# 应该看到:
# 🚀 Server is running on port 3000
# 🔌 WebSocket server initialized
```

#### 4️⃣ 测试服务器连接

```bash
# 从移动设备/模拟器测试
curl http://YOUR_IP:3000/health

# 应该返回 JSON 响应
```

#### 5️⃣ 检查防火墙设置

确保端口 3000 在防火墙中是开放的：

**macOS:**
系统偏好设置 → 安全性与隐私 → 防火墙 → 防火墙选项

- 允许 Node 接收传入连接

#### 6️⃣ 重启 Expo 开发服务器

```bash
# 在 mobile 目录
pnpm dev

# 清除缓存
pnpm start --clear
```

#### 7️⃣ 添加调试组件

在任意页面添加 `SocketDebugger` 组件：

```tsx
import SocketDebugger from '@/components/SocketDebugger';

// 在你的组件中
return (
  <View>
    {/* 你的内容 */}
    {__DEV__ && <SocketDebugger />}
  </View>
);
```

### 常见错误原因

#### ❌ "Connection refused"

- 服务器未运行
- 端口号错误
- 防火墙阻止连接

**解决方案:**

```bash
# 确认服务器运行
lsof -i :3000

# 应该看到 node 进程
```

#### ❌ "Network request failed"

- 设备和电脑不在同一网络
- 使用了 localhost 但在真机上
- IP 地址错误

**解决方案:**

- 确保设备和电脑连接同一 WiFi
- 使用电脑的局域网 IP，不要用 localhost

#### ❌ "Authentication error"

- Token 无效或过期
- Token 格式错误

**解决方案:**

```bash
# 清除应用数据重新登录
# 或在 Chrome DevTools 检查 token
```

#### ❌ "Transport unknown"

- Socket.IO 版本不匹配
- WebSocket 不支持

**解决方案:**
已配置为先使用 polling，再升级到 websocket

### 调试命令

#### 查看 Socket.IO 详细日志

在移动应用中添加：

```typescript
// config/socket.ts
const socket = io(SOCKET_URL, {
  // ... 其他配置
  autoConnect: true,
  debug: __DEV__, // 开发模式启用调试
});

// 添加所有事件监听
socket.onAny((event, ...args) => {
  console.log('Socket event:', event, args);
});
```

#### 服务器端调试

```typescript
// server/src/config/socket.ts
io.engine.on('connection_error', err => {
  console.log('Connection error:', err.req);
  console.log('Error code:', err.code);
  console.log('Error message:', err.message);
  console.log('Error context:', err.context);
});
```

### 测试 WebSocket 连接

使用 HTML Demo 页面测试服务器是否正常：

```bash
# 打开浏览器访问
http://localhost:3000/public/websocket-demo.html

# 如果浏览器能连接，说明服务器正常
# 问题可能在移动端配置
```

### 网络配置检查清单

- [ ] 服务器在运行 (http://localhost:3000/health 返回 200)
- [ ] 设备和电脑在同一 WiFi
- [ ] 使用正确的 IP 地址（真机时不能用 localhost）
- [ ] 防火墙允许 Node 连接
- [ ] .env 文件配置正确
- [ ] 已安装 socket.io-client 依赖
- [ ] Token 有效且未过期

### 最后的手段

如果以上都不行：

```bash
# 1. 完全清理并重装
cd apps/mobile
rm -rf node_modules
pnpm install

# 2. 清除 Metro 缓存
pnpm start --clear

# 3. 重启服务器
cd apps/server
pnpm dev

# 4. 重启手机应用
```

### 获取帮助

提供以下信息：

1. 运行环境 (iOS/Android, 模拟器/真机)
2. 完整错误日志
3. 服务器日志输出
4. 网络配置 (IP地址, 是否同一网络)
5. SocketDebugger 组件显示的日志

---

## ✅ 成功连接后应该看到:

**移动端日志:**

```
🔌 Connecting to socket: http://192.168.1.100:3000
✅ Socket connected: abc123
Transport: polling
```

**服务器日志:**

```
🔐 Socket authentication attempt
✅ Socket authenticated for user: user_id_here
User connected: user_id_here
```
