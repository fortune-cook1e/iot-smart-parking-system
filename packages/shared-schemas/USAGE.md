# 使用 @ht2025/shared-schemas

共享 Zod 校验类型包已创建完成。以下是使用指南。

## 📦 包结构

```
packages/shared-schemas/
├── src/
│   ├── index.ts              # 主入口
│   ├── user.schema.ts        # 用户相关 schema
│   └── response.schema.ts    # API 响应 schema
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 安装依赖

在根目录运行：

```bash
pnpm install
```

这会安装 `zod` 依赖并链接 workspace 包。

## 📝 在 Server 中使用

### 1. 在 Controller 中手动验证

```typescript
// src/controllers/authenticate.controller.ts
import { Request, Response, NextFunction } from 'express';
import { CreateUserSchema, LoginSchema } from '@ht2025/shared-schemas';
import { z } from 'zod';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    // 手动验证
    const userData = CreateUserSchema.parse(req.body);

    // userData 现在是类型安全的
    const user = await createUser(userData);

    res.success(user, 'Registration successful');
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 处理验证错误
      return res.status(400).json({
        code: 40010,
        status: 'error',
        message: 'Validation failed',
        errors: error.errors,
      });
    }
    next(error);
  }
}
```

### 3. 使用类型定义

```typescript
import type { CreateUserDto, UpdateUserDto, User } from '@ht2025/shared-schemas';

// 在 Service 中使用类型
export async function createUser(data: CreateUserDto): Promise<User> {
  // ...
}
```

## 📱 在 Mobile 中使用

### 1. 客户端表单验证

```typescript
// app/screens/RegisterScreen.tsx
import { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { CreateUserSchema, type CreateUserDto } from '@ht2025/shared-schemas';
import { z } from 'zod';

export default function RegisterScreen() {
  const [formData, setFormData] = useState<CreateUserDto>({
    username: '',
    email: '',
    password: '',
  });

  const handleRegister = async () => {
    try {
      // 客户端验证
      const validData = CreateUserSchema.parse(formData);

      // 发送到 API
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validData),
      });

      const data = await response.json();

      if (data.code === 10001) {
        Alert.alert('Success', 'Registration successful!');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // 显示验证错误
        const firstError = error.errors[0];
        Alert.alert('Validation Error', firstError.message);
      }
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => setFormData({ ...formData, username: text })}
      />
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
```

### 2. 实时表单验证

```typescript
import { CreateUserSchema } from '@ht2025/shared-schemas';

function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: keyof CreateUserDto, value: string) => {
    try {
      // 验证单个字段
      CreateUserSchema.shape[field].parse(value);
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [field]: error.errors[0].message,
        }));
      }
    }
  };

  return { errors, validateField };
}
```

### 3. API 响应类型

```typescript
import type { ApiResponse, User, ResponseCode } from '@ht2025/shared-schemas';

async function login(email: string, password: string): Promise<User> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const data: ApiResponse<{ user: User; token: string }> = await response.json();

  if (data.code === ResponseCode.SUCCESS && data.data) {
    return data.data.user;
  }

  throw new Error(data.message);
}
```

## 🔧 添加新的 Schema

### 1. 创建新的 schema 文件

```typescript
// packages/shared-schemas/src/parking.schema.ts
import { z } from 'zod';

export const ParkingSpotSchema = z.object({
  id: z.string(),
  spotNumber: z.string(),
  floor: z.number().int().positive(),
  isOccupied: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateParkingSpotSchema = z.object({
  spotNumber: z.string().min(1, 'Spot number is required'),
  floor: z.number().int().positive('Floor must be a positive number'),
});

export type ParkingSpot = z.infer<typeof ParkingSpotSchema>;
export type CreateParkingSpotDto = z.infer<typeof CreateParkingSpotSchema>;
```

### 2. 导出新的 schema

```typescript
// packages/shared-schemas/src/index.ts
export * from './user.schema';
export * from './response.schema';
export * from './parking.schema'; // 新增
```

### 3. 重新构建

```bash
pnpm --filter @ht2025/shared-schemas build
```

## 📊 验证错误处理

### Server 端统一错误格式

```typescript
// src/middleware/validation.middleware.ts 已经处理了格式化
// 错误响应示例：
{
  "code": 40010,
  "status": "error",
  "message": "Validation failed: username: Username must be at least 3 characters, email: Invalid email address"
}
```

### 自定义错误消息

```typescript
export const CreateUserSchema = z.object({
  username: z.string().min(3, '用户名至少3个字符').max(50, '用户名不超过50个字符'),
  email: z.string().email('邮箱格式不正确'),
  password: z
    .string()
    .min(6, '密码至少6个字符')
    .regex(/[A-Z]/, '密码必须包含大写字母')
    .regex(/[0-9]/, '密码必须包含数字'),
});
```

## 🎯 最佳实践

1. **客户端和服务端都要验证**
   - 客户端验证提供即时反馈
   - 服务端验证确保数据安全

2. **复用 Schema**
   - 同一份 schema 保证前后端一致
   - 减少重复代码和维护成本

3. **使用中间件**
   - 在路由层面验证，保持 Controller 简洁
   - 统一错误处理

4. **类型安全**
   - 使用 `z.infer` 自动生成 TypeScript 类型
   - 避免手动维护类型定义

5. **渐进式验证**
   - 可以先在重要接口使用
   - 逐步覆盖所有接口

## 🧪 测试

```typescript
import { CreateUserSchema } from '@ht2025/shared-schemas';

describe('User Schema Validation', () => {
  it('should validate correct user data', () => {
    const validData = {
      username: 'john',
      email: 'john@example.com',
      password: 'password123',
    };

    expect(() => CreateUserSchema.parse(validData)).not.toThrow();
  });

  it('should reject invalid email', () => {
    const invalidData = {
      username: 'john',
      email: 'invalid-email',
      password: 'password123',
    };

    expect(() => CreateUserSchema.parse(invalidData)).toThrow();
  });
});
```
