import { apiClient } from '@/utils/request';
import { FeOccupancyInput } from '@iot-smart-parking-system/shared-schemas';

/**
 * Predict parking space occupancy
 */
export async function predictOccupancy(data: FeOccupancyInput): Promise<number> {
  const response = await apiClient<any, number>({
    url: '/predictions/occupancy',
    method: 'POST',
    data,
  });
  return response;
}
