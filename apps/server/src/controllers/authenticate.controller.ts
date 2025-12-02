import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';
import { ResponseCode } from '../types/response-code';
import { createUser, verifyUserCredentials } from '../services/user.service';
import { generateToken, revokeToken } from '../utils/jwt';

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError('Email and password are required', 400, ResponseCode.BAD_REQUEST);
    }

    const user = await verifyUserCredentials(email, password);

    if (!user) {
      throw new AppError('Invalid credentials', 401, ResponseCode.UNAUTHORIZED);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    res.success({ user, token }, 'Login successful');
  } catch (e) {
    next(e);
  }
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, username } = req.body;
    const newUser = await createUser({ email, username, password });

    res.success(newUser, 'Sign-up successful');
  } catch (e) {
    next(e);
  }
}

/**
 * Sign-out handler - revoke the JWT token
 */
export async function signOut(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 400, ResponseCode.BAD_REQUEST);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Add token to blacklist
    revokeToken(token);

    res.success(null, 'Sign-out successful');
  } catch (e) {
    next(e);
  }
}
