import { apiClient } from '@/utils/request';
import { storage } from '@/utils/storage';
import type {
  LoginSchema,
  CreateUserSchema,
  UserResponse,
} from '@iot-smart-parking-system/shared-schemas';
import { z } from 'zod';

interface AuthResponse {
  user: UserResponse;
  token: string;
}

// Login
export const login = async (credentials: z.infer<typeof LoginSchema>): Promise<AuthResponse> => {
  const { user, token } = await apiClient.post<any, AuthResponse>('/auth/login', credentials);

  if (token) {
    // Save token
    await storage.setItem('auth_token', token);
  }

  return { user, token };
};

// Register
export const register = async (
  userData: z.infer<typeof CreateUserSchema>
): Promise<AuthResponse> => {
  const { user, token } = await apiClient.post<any, AuthResponse>('/auth/register', userData);
  if (token) {
    // Save token
    await storage.setItem('auth_token', token);
  }
  return {
    user,
    token,
  };
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    await storage.removeItem('auth_token');
  }
};

// Get current user
export const getCurrentUser = async (): Promise<UserResponse> => {
  const user = await apiClient.get<any, UserResponse>('/users/me');
  return user;
};
