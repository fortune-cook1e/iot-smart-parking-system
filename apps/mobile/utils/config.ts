import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export function getApiBaseUrl(): string {
  if (__DEV__) {
    if (Platform.OS === 'web') {
      console.log('Running on web platform in development mode');
      return API_BASE_URL;
    } else {
      const localIp = Constants.expoConfig?.hostUri?.split(':')[0];
      return `http://${localIp}:3000`;
    }
  } else {
    // production domain
    return API_BASE_URL;
  }
}

/**
 * Get the socket base URL (without /api path)
 * Socket.IO should connect to the root of the server, not /api
 */
export function getSocketUrl(): string {
  return API_BASE_URL;
}
