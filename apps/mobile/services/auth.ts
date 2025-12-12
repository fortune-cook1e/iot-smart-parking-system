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
  accessToken: string;
  refreshToken: string;
}

// Login
export const login = async (credentials: z.infer<typeof LoginSchema>): Promise<AuthResponse> => {
  const { user, accessToken, refreshToken } = await apiClient.post<any, AuthResponse>(
    '/auth/login',
    credentials
  );

  if (accessToken && refreshToken) {
    // Save both tokens
    await storage.setItem('access_token', accessToken);
    await storage.setItem('refresh_token', refreshToken);
  }

  return { user, accessToken, refreshToken };
};

// Register
export const register = async (
  userData: z.infer<typeof CreateUserSchema>
): Promise<AuthResponse> => {
  const { user, accessToken, refreshToken } = await apiClient.post<any, AuthResponse>(
    '/auth/register',
    userData
  );
  if (accessToken && refreshToken) {
    // Save both tokens
    await storage.setItem('access_token', accessToken);
    await storage.setItem('refresh_token', refreshToken);
  }
  return {
    user,
    accessToken,
    refreshToken,
  };
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    await storage.removeItem('access_token');
    await storage.removeItem('refresh_token');
  }
};

// Get current user
export const getCurrentUser = async (): Promise<UserResponse> => {
  const user = await apiClient.get<any, UserResponse>('/users/me');
  return user;
};
