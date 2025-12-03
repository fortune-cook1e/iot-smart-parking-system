import { Request, Response, NextFunction } from 'express';
import { ResponseCode } from '@iot-smart-parking-system/shared-schemas';

// Extend Express Response type
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Express {
    interface Response {
      success<T>({ data, message, code }: ResponseMiddlewareParams<T>): Response;
    }
  }
}

interface ResponseMiddlewareParams<T> {
  data: T;
  message?: string;
  code?: ResponseCode;
}

/**
 * Response middleware to add success method to res object
 */
export function responseMiddleware(_req: Request, res: Response, next: NextFunction) {
  res.success = function <T = unknown>({
    data,
    message = 'Success',
    code = ResponseCode.SUCCESS,
  }: ResponseMiddlewareParams<T>) {
    return this.json({
      code,
      data,
      message,
    });
  };

  next();
}
