import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';
import {
  createUser,
  verifyUserCredentials,
  addPushTokenToUser,
  removePushTokenFromUser,
} from '../services/user.service';
import { generateToken, generateRefreshToken, revokeToken } from '../utils/jwt';
import { LoginDto, RegisterDto, ResponseCode } from '@iot-smart-parking-system/shared-schemas';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, pushToken } = req.body as LoginDto;
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

    // Add push token to user if provided
    if (pushToken) {
      await addPushTokenToUser(user.id, pushToken);
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
    const { email, password, username, pushToken } = req.body as RegisterDto;
    const newUser = await createUser({ email, username, password, pushTokens: [] });

    // Add push token if provided
    if (pushToken) {
      await addPushTokenToUser(newUser.id, pushToken);
    }

    const payload = {
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    };

    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.success({
      data: {
        accessToken,
        refreshToken,
        user: newUser,
      },
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
    const { pushToken } = req.body as { pushToken?: string };

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError({
        message: 'No token provided',
        statusCode: 400,
        code: ResponseCode.BAD_REQUEST,
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Remove push token from user if provided
    if (pushToken && req.user?.userId) {
      await removePushTokenFromUser(req.user.userId, pushToken);
    }

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
