import { apiClient } from '@/utils/request';
import { Subscription } from '@iot-smart-parking-system/shared-schemas';

export const getUserSubscriptionsHandler = async () => {
  return await apiClient.get<any, Subscription[]>('/subscriptions');
};

export const createSubscriptionHandler = async (parkingSpaceId: string) => {
  const response = await apiClient.post<any, Subscription>('/subscriptions', {
    parkingSpaceId,
  });
  return response;
};

export const deleteSubscriptionHandler = async (parkingSpaceId: string) => {
  await apiClient.delete<any, null>(`/subscriptions/${parkingSpaceId}`);
};

export const checkSubscriptionHandler = async (parkingSpaceId: string) => {
  const response = await apiClient.get<any, { isSubscribed: boolean }>(
    `/subscriptions/check/${parkingSpaceId}`
  );
  return response;
};
