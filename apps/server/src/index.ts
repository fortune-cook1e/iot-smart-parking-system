import express, { Application, Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import userRoutes from './routes/user.route';
import authenticateRoutes from './routes/auth.route';
import parkingSpaceRoutes from './routes/parking-space.route';
import subscriptionRoutes from './routes/subscription.route';
import webhookRoutes from './routes/webhook.route';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { responseMiddleware } from './middleware/response.middleware';
import { initializeWebSocket } from './config/socket';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseMiddleware);

// Serve static files
app.use('/public', express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.success({ message: 'Welcome to the IoT Smart Parking System API', data: null });
});

app.get('/health', (_req: Request, res: Response) => {
  res.success({
    message: ' API is healthy and running',
    data: null,
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authenticateRoutes);
app.use('/api/parking-spaces', parkingSpaceRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/webhooks', webhookRoutes);

// Swagger Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'IoT Smart Parking System API',
  })
);

// Error handling - must be last
app.use(notFoundHandler);
app.use(errorHandler);

// Create HTTP server and initialize WebSocket
const httpServer = createServer(app);
initializeWebSocket(httpServer);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`🔌 WebSocket server initialized`);
  console.log(`🎮 WebSocket Demo available at http://localhost:${PORT}/public/websocket-demo.html`);
});

export default app;
