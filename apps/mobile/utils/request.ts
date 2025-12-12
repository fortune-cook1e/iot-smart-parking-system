import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { storage } from './storage';
import { showError } from '@/utils/toast';
import { ResponseCode } from '@iot-smart-parking-system/shared-schemas';
import { getApiBaseUrl } from '@/utils/config';

// determine API base URL based on environment
export const API_BASE_URL = getApiBaseUrl() + '/api';
const API_URL = getApiBaseUrl();

// create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Refresh token logic (with token rotation)
const refreshAuthLogic = async (failedRequest: any) => {
  const refreshToken = await storage.getItem('refresh_token');

  if (!refreshToken) {
    // No refresh token, clear tokens
    await storage.removeItem('access_token');
    await storage.removeItem('refresh_token');
    showError('Session Expired', 'Please login again to continue.');
    return Promise.reject(new Error('No refresh token'));
  }

  try {
    const response = await axios.post(`${API_URL}/api/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    // Save new tokens (token rotation)
    await storage.setItem('access_token', accessToken);
    await storage.setItem('refresh_token', newRefreshToken);

    // Update authorization header
    failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`;

    return Promise.resolve();
  } catch (error) {
    // Refresh failed, clear tokens
    await storage.removeItem('access_token');
    await storage.removeItem('refresh_token');
    showError('Session Expired', 'Please login again to continue.');
    return Promise.reject(error);
  }
};

// Setup automatic token refresh
createAuthRefreshInterceptor(apiClient, refreshAuthLogic, {
  statusCodes: [401], // Refresh only on 401 status
  pauseInstanceWhileRefreshing: true, // Pause other requests while refreshing
});

// Request interceptor - add token
apiClient.interceptors.request.use(
  async config => {
    const token = await storage.getItem('access_token');
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

// Response interceptor - handle API response format and errors
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

    // Don't show error for 401 (handled by auth refresh)
    if (error.response?.status !== 401) {
      showError(
        'Request Failed',
        error.response?.data?.message || 'An error occurred while processing your request.'
      );
    }

    return Promise.reject(error);
  }
);
