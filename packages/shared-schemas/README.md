# @ht2025/shared-schemas

Shared Zod validation schemas for IoT Smart Parking System.

## 📦 Installation

This package is part of the monorepo. To use it in other packages:

```json
{
  "dependencies": {
    "@ht2025/shared-schemas": "workspace:*"
  }
}
```

## 🚀 Usage

### In Server (Express)

```typescript
import { CreateUserSchema, LoginSchema } from '@ht2025/shared-schemas';
import { Request, Response } from 'express';

// Validate request body
export async function register(req: Request, res: Response) {
  try {
    // Parse and validate
    const userData = CreateUserSchema.parse(req.body);

    // userData is now typed and validated
    const user = await createUser(userData);

    res.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.errors,
      });
    }
  }
}
```

### In Mobile (React Native)

```typescript
import { CreateUserSchema, type CreateUserDto } from '@ht2025/shared-schemas';

// Validate form data before sending
function RegisterScreen() {
  const [formData, setFormData] = useState<CreateUserDto>({
    username: '',
    email: '',
    password: '',
  });

  const handleRegister = async () => {
    try {
      // Validate on client side
      const validData = CreateUserSchema.parse(formData);

      // Send to API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(validData),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Show validation errors
        error.errors.forEach(err => {
          Alert.alert('Validation Error', err.message);
        });
      }
    }
  };
}
```

## 📚 Available Schemas

### User Schemas

- `UserSchema` - Complete user object
- `CreateUserSchema` - User registration data
- `UpdateUserSchema` - User update data
- `LoginSchema` - Login credentials
- `UserResponseSchema` - User data for API response

### Response Schemas

- `ApiResponseSchema<T>` - Generic API response
- `SuccessResponseSchema<T>` - Success response
- `ErrorResponseSchema` - Error response
- `ResponseCode` - Response code enum

### TypeScript Types

All schemas export corresponding TypeScript types:

```typescript
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  LoginDto,
  ApiResponse,
  ResponseCode,
} from '@ht2025/shared-schemas';
```

## 🔧 Development

```bash
# Build the package
pnpm --filter @ht2025/shared-schemas build

# Watch mode
pnpm --filter @ht2025/shared-schemas dev

# Type check
pnpm --filter @ht2025/shared-schemas type-check
```

## 📝 Adding New Schemas

1. Create a new file in `src/` (e.g., `parking.schema.ts`)
2. Define your Zod schemas and export types
3. Export from `src/index.ts`
4. Rebuild the package

Example:

```typescript
// src/parking.schema.ts
import { z } from 'zod';

export const ParkingSpotSchema = z.object({
  id: z.string(),
  spotNumber: z.string(),
  isOccupied: z.boolean(),
});

export type ParkingSpot = z.infer<typeof ParkingSpotSchema>;
```

```typescript
// src/index.ts
export * from './parking.schema';
```
