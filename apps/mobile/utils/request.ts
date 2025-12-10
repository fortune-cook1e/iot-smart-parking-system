import axios from 'axios';
import { storage } from './storage';
import { showError } from '@/utils/toast';
import { ResponseCode } from '@iot-smart-parking-system/shared-schemas';
import { getApiBaseUrl } from '@/utils/config';

// determine API base URL based on environment

export const API_BASE_URL = getApiBaseUrl() + '/api';

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
    const {
      data: { data, code, message },
    } = response;
    if (code === ResponseCode.SUCCESS) {
      return data;
    } else {
      return Promise.reject({ message, code });
    }
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
