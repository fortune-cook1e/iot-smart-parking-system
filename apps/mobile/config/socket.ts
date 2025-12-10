import { io, Socket } from 'socket.io-client';
import { storage } from '@/utils/storage';
import { ParkingSpace } from '@iot-smart-parking-system/shared-schemas';
import { getApiBaseUrl } from '@/utils/config';
import { WebhookSensorData } from '@iot-smart-parking-system/shared-schemas/src/webhook.schema';

const SOCKET_URL = getApiBaseUrl();

let socket: Socket | null = null;

export const initializeSocket = async () => {
  if (socket?.connected) {
    console.log('Socket already connected');
    return socket;
  }

  try {
    const token = await storage.getItem('auth_token');

    if (!token) {
      console.warn('No auth token found, cannot connect to socket');
      return null;
    }

    console.log('🔌 Connecting to socket:', SOCKET_URL);

    socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['polling', 'websocket'], // Try polling first, then upgrade to websocket
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 10000,
      forceNew: true,
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket?.id);
      console.log('Transport:', socket?.io.engine.transport.name);
    });

    socket.on('disconnect', reason => {
      console.log('❌ Socket disconnected:', reason);
    });

    socket.on('connect_error', error => {
      console.error('❌ Socket connection error:', error.message);
      console.error('Error details:', error);
    });

    socket.on('error', error => {
      console.error('❌ Socket error:', error);
    });

    return socket;
  } catch (error) {
    console.error('Failed to initialize socket:', error);
    return null;
  }
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected manually');
  }
};

export const subscribeToParking = (parkingSpaceId: string) => {
  if (!socket?.connected) {
    console.warn('Socket not connected, cannot subscribe');
    return;
  }

  socket.emit('subscribe:parking-space', parkingSpaceId);
  console.log(`Subscribed to parking space: ${parkingSpaceId}`);
};

export const unsubscribeFromParking = (parkingSpaceId: string) => {
  if (!socket?.connected) {
    console.warn('Socket not connected, cannot unsubscribe');
    return;
  }

  socket.emit('unsubscribe:parking-space', parkingSpaceId);
  console.log(`Unsubscribed from parking space: ${parkingSpaceId}`);
};

export const onParkingSpaceUpdate = (callback: (data: WebhookSensorData) => void) => {
  if (!socket) {
    console.warn('Socket not initialized');
    return () => {};
  }

  socket.on('parking-space:updated', callback);

  // Return cleanup function
  return () => {
    socket?.off('parking-space:updated', callback);
  };
};
