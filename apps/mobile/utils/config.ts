import Constants from 'expo-constants';
import { Platform } from 'react-native';

export function getApiBaseUrl(): string {
  if (__DEV__) {
    if (Platform.OS === 'web') {
      console.log('Running on web platform in development mode');
      return 'http://localhost:3000';
    } else {
      const localIp = Constants.expoConfig?.hostUri?.split(':')[0];
      return `http://${localIp}:3000`;
    }
  } else {
    // production domain
    return 'https://your-production-api.com/api';
  }
}
