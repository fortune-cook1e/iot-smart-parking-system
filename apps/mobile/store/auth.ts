import { create } from 'zustand';
import type { UserResponse } from '@iot-smart-parking-system/shared-schemas';
import * as authService from '@/services/auth';
import { storage } from '@/utils/storage';

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: UserResponse, token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  // Set user information and token
  setUser: async (user: UserResponse, token: string) => {
    await storage.setItem('access_token', token);
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  // Logout
  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await storage.removeItem('access_token');
      await storage.removeItem('refresh_token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // Check authentication status
  checkAuth: async () => {
    try {
      set({ isLoading: true });

      const token = await storage.getItem('access_token');
      if (!token) {
        set({ isAuthenticated: false, isLoading: false });
        return false;
      }

      // Verify token validity and fetch current user information
      const user = await authService.getCurrentUser();
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token invalid, clear stored data
      await storage.removeItem('access_token');
      await storage.removeItem('refresh_token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }
  },

  // Clear authentication state (without calling API)
  clearAuth: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));
