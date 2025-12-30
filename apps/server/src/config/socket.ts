import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt';
import { ParkingSpace } from '@iot-smart-parking-system/shared-schemas/dist/parking-space.schema';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

let io: Server;

export const initializeWebSocket = (httpServer: HttpServer) => {
  console.log('🚀 Initializing WebSocket server...');

  io = new Server(httpServer, {
    path: '/socket', // Explicitly set the Socket.IO path
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

  console.log('✅ Socket.IO server created with config:');
  console.log('   - Path: /socket.io/');
  console.log('   - CORS: enabled (origin: *)');
  console.log('   - Transports: polling, websocket');
  console.log('   - Ping timeout: 60s');
  console.log('   - Ping interval: 25s');

  // Log all connection attempts (before authentication)
  io.engine.on('connection', rawSocket => {
    console.log('🔌 Raw connection attempt:', {
      id: rawSocket.id,
      transport: rawSocket.transport.name,
      readyState: rawSocket.readyState,
    });
  });

  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    console.log('🔐 Socket authentication attempt');
    console.log('   - Socket ID:', socket.id);
    console.log('   - Transport:', socket.conn.transport.name);
    console.log('   - Address:', socket.handshake.address);
    console.log(
      '   - Headers:',
      JSON.stringify({
        origin: socket.handshake.headers.origin,
        'user-agent': socket.handshake.headers['user-agent'],
        host: socket.handshake.headers.host,
      })
    );
    console.log('   - Query params:', socket.handshake.query);
    console.log('   - Auth object:', socket.handshake.auth);

    const token = socket.handshake.auth.token || socket.handshake.headers.authorization;

    if (!token) {
      console.error('❌ No token provided');
      console.error('   - Auth object:', socket.handshake.auth);
      console.error('   - Authorization header:', socket.handshake.headers.authorization);
      return next(new Error('Authentication error: Token not provided'));
    }

    try {
      const bearerToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      const decoded = verifyToken(bearerToken);
      socket.userId = decoded.userId;
      console.log('✅ Socket authenticated for user:', socket.userId);
      next();
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      console.error('   - Token preview:', token.substring(0, 20) + '...');
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection successful
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log('✅ User connected successfully');
    console.log('   - User ID:', socket.userId);
    console.log('   - Socket ID:', socket.id);
    console.log('   - Transport:', socket.conn.transport.name);
    console.log('   - Rooms:', Array.from(socket.rooms));

    // Monitor transport upgrades
    socket.conn.on('upgrade', transport => {
      console.log(`⬆️ Transport upgraded to ${transport.name} for user ${socket.userId}`);
    });

    // Subscribe to parking space updates
    socket.on('subscribe:parking-space', (parkingSpaceId: string) => {
      socket.join(`parking-space:${parkingSpaceId}`);
      console.log(`📢 User ${socket.userId} subscribed to parking space ${parkingSpaceId}`);
      console.log(`   - Current rooms:`, Array.from(socket.rooms));

      // Send confirmation back to client
      socket.emit('subscription:confirmed', { parkingSpaceId });
    });

    // Unsubscribe from parking space updates
    socket.on('unsubscribe:parking-space', (parkingSpaceId: string) => {
      socket.leave(`parking-space:${parkingSpaceId}`);
      console.log(`📢 User ${socket.userId} unsubscribed from parking space ${parkingSpaceId}`);
      console.log(`   - Current rooms:`, Array.from(socket.rooms));

      // Send confirmation back to client
      socket.emit('unsubscription:confirmed', { parkingSpaceId });
    });

    // Handle errors
    socket.on('error', error => {
      console.error('❌ Socket error for user:', socket.userId);
      console.error('   - Error:', error);
    });

    // Handle disconnection
    socket.on('disconnect', reason => {
      console.log('👋 User disconnected');
      console.log('   - User ID:', socket.userId);
      console.log('   - Socket ID:', socket.id);
      console.log('   - Reason:', reason);
      console.log('   - Transport:', socket.conn?.transport?.name || 'N/A');
    });

    // Handle disconnecting (before actual disconnect)
    socket.on('disconnecting', reason => {
      console.log('⚠️ User disconnecting...');
      console.log('   - User ID:', socket.userId);
      console.log('   - Reason:', reason);
      console.log('   - Rooms before disconnect:', Array.from(socket.rooms));
    });
  });

  // Handle connection errors
  io.engine.on('connection_error', error => {
    console.error('❌ Connection error:');
    console.error('   - Message:', error.message);
    console.error('   - Code:', error.code);
    console.error('   - Context:', error.context);
  });

  console.log('✅ WebSocket initialization complete');
  console.log('📡 Ready to accept connections on namespace: /');

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
