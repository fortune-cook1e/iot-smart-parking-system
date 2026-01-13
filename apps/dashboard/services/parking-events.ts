import { apiClient } from '../lib/request';

export interface ParkingEvent {
  id: string;
  sensorId: string;
  eventType: 'occupied' | 'available';
  eventTime: string;
  weather: string | null;
  createdAt: string;
}

interface ParkingEventsResponse {
  events: ParkingEvent[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface QueryParkingEvents {
  startTime?: string;
  endTime?: string;
  page?: number;
  pageSize?: number;
}

export const parkingEventsApi = {
  getParkingEvents: async (
    sensorId: string,
    params?: QueryParkingEvents
  ): Promise<ParkingEventsResponse> => {
    const response = await apiClient.get<any, ParkingEventsResponse>(
      `/parking-events/${sensorId}`,
      { params }
    );
    return response;
  },
};
