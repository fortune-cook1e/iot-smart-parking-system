import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

let io: Server;

export const initializeWebSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
    },
  });

  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization;

    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }

    try {
      const bearerToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      const decoded = verifyToken(bearerToken);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId}`);

    // Subscribe to parking space updates
    socket.on('subscribe:parking-space', (parkingSpaceId: string) => {
      socket.join(`parking-space:${parkingSpaceId}`);
      console.log(`User ${socket.userId} subscribed to parking space ${parkingSpaceId}`);
    });

    // Unsubscribe from parking space updates
    socket.on('unsubscribe:parking-space', (parkingSpaceId: string) => {
      socket.leave(`parking-space:${parkingSpaceId}`);
      console.log(`User ${socket.userId} unsubscribed from parking space ${parkingSpaceId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Notify subscribers about parking space status change
export const notifyParkingSpaceUpdate = (parkingSpaceId: string, data: unknown) => {
  if (io) {
    io.to(`parking-space:${parkingSpaceId}`).emit('parking-space:updated', data);
    console.log(`Notified subscribers of parking space ${parkingSpaceId}`);
  }
};
