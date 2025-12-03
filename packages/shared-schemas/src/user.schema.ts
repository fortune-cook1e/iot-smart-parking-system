import { z } from 'zod';

/**
 * User validation schemas
 */

// Base user schema
export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// User creation schema (for registration)
export const CreateUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
});

// User update schema
export const UpdateUserSchema = z
  .object({
    username: z.string().min(3).max(50).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).max(100).optional(),
  })
  .refine((data: Record<string, unknown>) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

// Login schema
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// User response schema (without sensitive data)
export const UserResponseSchema = UserSchema.omit({
  // Exclude sensitive fields if needed
});

/**
 * TypeScript types inferred from schemas
 */
export type User = z.infer<typeof UserSchema>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
