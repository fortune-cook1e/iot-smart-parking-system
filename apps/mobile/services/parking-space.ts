import { apiClient } from '@/utils/request';
import { ParkingSpace } from '@iot-smart-parking-system/shared-schemas';

interface ParkingSpacesResponse {
  parkingSpaces: ParkingSpace[];
  page: number;
  pageSize: number;
}

export const getParkingSpaceList = async () => {
  const response = await apiClient.get<any, ParkingSpacesResponse>('/parking-spaces');
  return response;
};
