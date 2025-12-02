import { Request, Response, NextFunction } from 'express';
import { ResponseCode } from '../types/response-code';

/**
 * Response middleware to add success method to res object
 */
export function responseMiddleware(_req: Request, res: Response, next: NextFunction) {
  res.success = function <T>(
    data: T,
    message = 'Success',
    code: ResponseCode = ResponseCode.SUCCESS
  ) {
    return this.json({
      code,
      status: 'success',
      data,
      message,
    });
  };

  next();
}
