import { apiClient } from '../lib/request';
import type { User } from '@iot-smart-parking-system/shared-schemas';

export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get('/users/me');
  },
};
