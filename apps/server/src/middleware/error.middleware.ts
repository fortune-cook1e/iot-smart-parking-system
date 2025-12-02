import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../types/response.types';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(errorResponse(err.message));
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  return res.status(500).json(errorResponse('Internal server error'));
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json(errorResponse(`Route ${req.originalUrl} not found`));
}
