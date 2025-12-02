import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { AppError } from './error.middleware';
import { ResponseCode } from '../types/response-code';

// Extend Express Request to include user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Authentication middleware - validates JWT token
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401, ResponseCode.UNAUTHORIZED);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    try {
      const decoded = verifyToken(token);
      // Attach user info to request
      req.user = decoded;
      next();
    } catch (jwtError) {
      // Check if token is expired or invalid
      const errorMessage = (jwtError as Error).message;
      if (errorMessage.includes('expired')) {
        throw new AppError('Token has expired', 401, ResponseCode.TOKEN_EXPIRED);
      } else {
        throw new AppError('Invalid token', 401, ResponseCode.TOKEN_INVALID);
      }
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication - validates token if present, but doesn't require it
 */
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch {
    // If token is invalid, just continue without user
    next();
  }
}
