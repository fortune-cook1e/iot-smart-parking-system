import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { storage } from './storage';
import { ResponseCode } from '@iot-smart-parking-system/shared-schemas';

// determine API base URL based on environment
export const apiUrl = process.env.API_BASE_URL || 'http://localhost:3000';

// create axios instance
export const apiClient = axios.create({
  baseURL: apiUrl + '/api',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// 刷新逻辑 (with token rotation)
const refreshAuthLogic = async (failedRequest: any) => {
  const refreshToken = storage.getItem('refresh_token');

  if (!refreshToken) {
    // No refresh token, redirect to login
    window.location.href = '/login';
    return Promise.reject();
  }

  try {
    const response = await axios.post(`${apiUrl}/api/auth/refresh`, { refreshToken });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    // Save both new tokens (token rotation)
    storage.setItem('access_token', accessToken);
    storage.setItem('refresh_token', newRefreshToken);

    failedRequest.response.config.headers['Authorization'] = `Bearer ${accessToken}`;
    return Promise.resolve();
  } catch (error) {
    // Refresh failed, clear tokens and redirect to login
    storage.removeItem('access_token');
    storage.removeItem('refresh_token');
    window.location.href = '/login';
    return Promise.reject(error);
  }
};

// 自动刷新拦截器
createAuthRefreshInterceptor(apiClient, refreshAuthLogic, {
  statusCodes: [401], // 仅在 401 时刷新
  pauseInstanceWhileRefreshing: true, // 刷新时暂停其他请求
});

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    const token = storage.getItem('access_token');
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

    return Promise.reject(error);
  }
);
