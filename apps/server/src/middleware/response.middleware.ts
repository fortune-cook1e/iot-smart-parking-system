import { Request, Response, NextFunction } from 'express';

/**
 * Response middleware to add success method to res object
 */
export function responseMiddleware(req: Request, res: Response, next: NextFunction) {
  res.success = function <T>(data: T, message = 'Success') {
    return this.json({
      status: 'success',
      data,
      message,
    });
  };

  next();
}
