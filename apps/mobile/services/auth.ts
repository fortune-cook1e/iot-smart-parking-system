import { apiClient } from '@/utils/request';
import { storage } from '@/utils/storage';
import type {
  LoginSchema,
  CreateUserSchema,
  UserResponse,
} from '@iot-smart-parking-system/shared-schemas';
import { z } from 'zod';

// API response type
interface ApiResponse<T> {
  code: number;
  status: 'success' | 'error';
  data?: T;
  message: string;
}

interface LoginResponse {
  user: UserResponse;
  token: string;
}

// Login
export const login = async (credentials: z.infer<typeof LoginSchema>): Promise<LoginResponse> => {
  const response = await apiClient.post<any, ApiResponse<LoginResponse>>(
    '/auth/login',
    credentials
  );

  if (response.data?.token) {
    // Save token
    await storage.setItem('auth_token', response.data.token);
  }

  return response.data!;
};

// Register
export const register = async (
  userData: z.infer<typeof CreateUserSchema>
): Promise<UserResponse> => {
  const response = await apiClient.post<any, ApiResponse<UserResponse>>('/auth/register', userData);
  return response.data!;
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
  const response = await apiClient.get<any, ApiResponse<UserResponse>>('/users/me');
  return response.data!;
};
