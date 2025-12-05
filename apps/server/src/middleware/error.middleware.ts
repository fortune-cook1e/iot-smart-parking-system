import { Request, Response, NextFunction } from 'express';
import { ResponseCode } from '@iot-smart-parking-system/shared-schemas';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

interface AppErrorConstructor {
  message: string;
  statusCode: number;
  code?: ResponseCode;
}

export class AppError extends Error {
  statusCode: number;
  code: ResponseCode;
  isOperational: boolean;

  constructor({ message, statusCode = 400, code }: AppErrorConstructor) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || AppError.getCodeFromStatus(statusCode || ResponseCode.INTERNAL_ERROR);
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
  // Handle Zod validation errors
  if (err instanceof z.ZodError) {
    // const errors = err.errors.map(error => ({
    //   field: error.path.join('.'),
    //   message: error.message,
    // }));
    const errorMessage = err.errors[0].message;

    return res.status(400).json({
      code: ResponseCode.VALIDATION_ERROR,
      status: 'error',
      message: errorMessage || 'Validation failed',
      // errors,
    });
  }

  // Handle AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      status: 'error',
      message: err.message,
    });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    // database cannot be connected
    return res.status(500).json({
      code: ResponseCode.FAILURE,
      message: 'Database Initialization Error',
    });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    // parameters passed to Prisma Client are invalid
    return res.status(400).json({
      code: ResponseCode.FAILURE,
      message: 'Prisma Validation Error',
    });
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  return res.status(500).json({
    code: ResponseCode.INTERNAL_ERROR,
    status: 'error',
    message: 'Internal Server Error',
  });
}

export function notFoundHandler(req: Request, res: Response) {
  console.log(`404 Not Found: ${req.originalUrl}`);
  res.status(404).json({
    code: ResponseCode.NOT_FOUND,
    status: 'error',
    message: `Cannot find ${req.originalUrl} on this server`,
  });
}
