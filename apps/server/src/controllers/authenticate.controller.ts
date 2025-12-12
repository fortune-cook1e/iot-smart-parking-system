import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';
import { createUser, verifyUserCredentials } from '../services/user.service';
import { generateToken, generateRefreshToken, revokeToken } from '../utils/jwt';
import {
  ResponseCode,
  LoginSchema,
  RegisterSchema,
} from '@iot-smart-parking-system/shared-schemas';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    if (!email || !password) {
      throw new AppError({
        message: 'Email and password are required',
        statusCode: 400,
        code: ResponseCode.BAD_REQUEST,
      });
    }

    const user = await verifyUserCredentials(email, password);

    if (!user) {
      throw new AppError({
        message: 'Invalid credentials',
        statusCode: 401,
        code: ResponseCode.UNAUTHORIZED,
      });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.success({
      data: {
        accessToken,
        refreshToken,
        user,
      },
      message: 'Login successful',
    });
  } catch (e) {
    next(e);
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, username } = RegisterSchema.parse(req.body);
    const newUser = await createUser({ email, username, password });

    res.success({
      data: newUser,
      message: 'Register successful',
    });
  } catch (e) {
    next(e);
  }
}

/**
 * Sign-out handler - revoke the JWT token
 */
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError({
        message: 'No token provided',
        statusCode: 400,
        code: ResponseCode.BAD_REQUEST,
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Add token to blacklist
    revokeToken(token);

    res.success({
      data: null,
      message: 'Logout successful',
    });
  } catch (e) {
    next(e);
  }
}
