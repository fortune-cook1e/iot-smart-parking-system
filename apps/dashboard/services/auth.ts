import { apiClient } from '../lib/request';
import type { LoginDto, User } from '@iot-smart-parking-system/shared-schemas';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authApi = {
  login: async (credentials: LoginDto): Promise<LoginResponse> => {
    return apiClient.post('/auth/login', credentials);
  },
};
