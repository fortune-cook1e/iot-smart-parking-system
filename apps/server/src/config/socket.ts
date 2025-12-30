import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt';
import { ParkingSpace } from '@iot-smart-parking-system/shared-schemas';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

let io: Server;

export const initializeWebSocket = (httpServer: HttpServer) => {
  console.log('🚀 Initializing WebSocket server...');

  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    allowEIO3: true,
    transports: ['polling', 'websocket'],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization;

    if (!token) {
      console.error('❌ Socket auth failed: No token provided');
      return next(new Error('Authentication error: Token not provided'));
    }

    try {
      const bearerToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      const decoded = verifyToken(bearerToken);
      socket.userId = decoded.userId;
      console.log('✅ Socket authenticated:', socket.userId);
      next();
    } catch (error) {
      console.error('❌ Socket auth failed: Invalid token');
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection successful
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Subscribe to parking space updates
    socket.on('subscribe:parking-space', (parkingSpaceId: string) => {
      socket.join(`parking-space:${parkingSpaceId}`);
      console.log(`📢 ${socket.userId} subscribed to ${parkingSpaceId}`);
      socket.emit('subscription:confirmed', { parkingSpaceId });
    });

    // Unsubscribe from parking space updates
    socket.on('unsubscribe:parking-space', (parkingSpaceId: string) => {
      socket.leave(`parking-space:${parkingSpaceId}`);
      console.log(`📢 ${socket.userId} unsubscribed from ${parkingSpaceId}`);
      socket.emit('unsubscription:confirmed', { parkingSpaceId });
    });

    // Handle errors
    socket.on('error', error => {
      console.error(`❌ Socket error [${socket.userId}]:`, error);
    });

    // Handle disconnection
    socket.on('disconnect', reason => {
      console.log(`👋 User disconnected: ${socket.userId} (${reason})`);
    });
  });

  // Handle connection errors
  io.engine.on('connection_error', error => {
    console.error('❌ Connection error:', error.message);
  });

  console.log('✅ WebSocket ready');
  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Notify subscribers about parking space status change
export const notifyParkingSpaceUpdate = (parkingSpaceId: string, data: Partial<ParkingSpace>) => {
  if (io) {
    io.to(`parking-space:${parkingSpaceId}`).emit('parking-space:updated', data);
    console.log(`Notified subscribers of parking space ${parkingSpaceId}`);
  }
};
