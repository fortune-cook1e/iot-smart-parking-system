import { apiClient } from '../lib/request';
import type { QueryParkingSpaces, ParkingSpace } from '@iot-smart-parking-system/shared-schemas';

interface ParkingSpacesResponse {
  parkingSpaces: ParkingSpace[];
  total: number;
  page: number;
  pageSize: number;
}

export const parkingSpaceApi = {
  getAllParkingSpaces: async (params?: QueryParkingSpaces): Promise<ParkingSpacesResponse> => {
    const response = await apiClient.get<any, ParkingSpacesResponse>('/parking-spaces', { params });
    return response;
  },

  getParkingSpaceById: async (id: string): Promise<ParkingSpace> => {
    const response = await apiClient.get<any, ParkingSpace>(`/parking-spaces/${id}`);
    return response;
  },

  createParkingSpace: async (data: Partial<ParkingSpace>): Promise<ParkingSpace> => {
    const response = await apiClient.post<any, ParkingSpace>('/parking-spaces', data);
    return response;
  },

  updateParkingSpace: async (id: string, data: Partial<ParkingSpace>): Promise<ParkingSpace> => {
    const response = await apiClient.put<any, ParkingSpace>(`/parking-spaces/${id}`, data);
    return response;
  },

  deleteParkingSpace: async (id: string): Promise<void> => {
    await apiClient.delete(`/parking-spaces/${id}`);
  },
};
