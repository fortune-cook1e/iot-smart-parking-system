import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { User } from '@iot-smart-parking-system/shared-schemas';
import { userApi } from '@/services/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    // Note: token parameter is now accessToken, refreshToken stored separately by login component
    storage.setItem('access_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    storage.removeItem('access_token');
    storage.removeItem('refresh_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  initialize: async () => {
    const token = await storage.getItem('access_token');
    if (token) {
      try {
        // Fetch user data from API
        const user = await userApi.getCurrentUser();
        set({ user, token, isAuthenticated: true });
      } catch (error) {
        // Token invalid, clear storage
        storage.removeItem('access_token');
        storage.removeItem('refresh_token');
        set({ user: null, token: null, isAuthenticated: false });
      }
    }
  },
}));
