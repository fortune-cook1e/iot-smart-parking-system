import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route';
import authenticateRoutes from './routes/authenticate.route';

import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { responseMiddleware } from './middleware/response.middleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseMiddleware);

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
app.use('/api/authenticate', authenticateRoutes);

// Error handling - must be last
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

export default app;
