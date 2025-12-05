import Constants from 'expo-constants';
import axios from 'axios';
import { Platform } from 'react-native';
import { storage } from './storage';
import { showError } from '@/utils/toast';

// determine API base URL based on environment
const getApiBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'web') {
      console.log('Running on web platform in development mode');
      return 'http://localhost:3000/api';
    } else {
      const localIp = Constants.expoConfig?.hostUri?.split(':')[0];
      return `http://${localIp}:3000/api`;
    }
  } else {
    // production domain
    return 'https://your-production-api.com/api';
  }
};

export const API_BASE_URL = getApiBaseUrl();

// create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// request interceptor - add token
apiClient.interceptors.request.use(
  async config => {
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);

    const token = await storage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// response interceptor - handle errors
apiClient.interceptors.response.use(
  response => {
    return response.data;
  },
  async error => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    showError(
      'Request Failed',
      error.response?.data?.message || 'An error occurred while processing your request.'
    );

    if (error.response?.status === 401) {
      // Token expired, clear local storage
      await storage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);
