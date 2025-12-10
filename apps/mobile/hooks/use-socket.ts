import { WebhookSensorData } from './../../../packages/shared-schemas/src/webhook.schema';
import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/auth';
import {
  initializeSocket,
  disconnectSocket,
  getSocket,
  subscribeToParking,
  unsubscribeFromParking,
  onParkingSpaceUpdate,
} from '@/config/socket';
import { ParkingSpace } from '@iot-smart-parking-system/shared-schemas';

export const useSocket = () => {
  const { isAuthenticated } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      initializeSocket().then(socket => {
        if (socket) {
          setIsConnected(socket.connected);

          socket.on('connect', () => setIsConnected(true));
          socket.on('disconnect', () => setIsConnected(false));
        }
      });
    } else {
      disconnectSocket();
      setIsConnected(false);
    }

    return () => {
      // Don't disconnect on unmount, keep connection alive
    };
  }, [isAuthenticated]);

  const subscribe = useCallback((parkingSpaceId: string) => {
    subscribeToParking(parkingSpaceId);
  }, []);

  const unsubscribe = useCallback((parkingSpaceId: string) => {
    unsubscribeFromParking(parkingSpaceId);
  }, []);

  return {
    socket: getSocket(),
    isConnected,
    subscribe,
    unsubscribe,
  };
};

export const useParkingSpaceUpdates = (callback: (data: WebhookSensorData) => void) => {
  useEffect(() => {
    const cleanup = onParkingSpaceUpdate(callback);
    return cleanup;
  }, [callback]);
};
