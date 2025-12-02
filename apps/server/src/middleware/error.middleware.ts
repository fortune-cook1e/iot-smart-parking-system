import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../types/response.types';
import { ResponseCode } from '../types/response-code';

export class AppError extends Error {
  statusCode: number;
  code: ResponseCode;
  isOperational: boolean;

  constructor(message: string, statusCode: number, code?: ResponseCode) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || AppError.getCodeFromStatus(statusCode);
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  private static getCodeFromStatus(statusCode: number): ResponseCode {
    switch (statusCode) {
      case 400:
        return ResponseCode.BAD_REQUEST;
      case 401:
        return ResponseCode.UNAUTHORIZED;
      case 403:
        return ResponseCode.FORBIDDEN;
      case 404:
        return ResponseCode.NOT_FOUND;
      case 409:
        return ResponseCode.CONFLICT;
      case 422:
        return ResponseCode.VALIDATION_ERROR;
      default:
        return ResponseCode.INTERNAL_ERROR;
    }
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(errorResponse(err.message, err.code));
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  return res.status(500).json(errorResponse('Internal server error', ResponseCode.INTERNAL_ERROR));
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json(errorResponse(`Route ${req.originalUrl} not found`, ResponseCode.NOT_FOUND));
}
