import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Storage utility that works on both web and native platforms
 * - Web: Uses localStorage
 * - Native (iOS/Android): Uses expo-secure-store
 */

const isWeb = Platform.OS === 'web';

export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (isWeb) {
        return localStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (isWeb) {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (isWeb) {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  },
};
