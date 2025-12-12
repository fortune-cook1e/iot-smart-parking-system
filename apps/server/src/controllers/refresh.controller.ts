import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';
import { generateToken, generateRefreshToken, verifyRefreshToken, revokeToken } from '../utils/jwt';
import { ResponseCode } from '@iot-smart-parking-system/shared-schemas';

/**
 * Refresh access token using refresh token (with token rotation)
 */
export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken: oldRefreshToken } = req.body;

    if (!oldRefreshToken) {
      throw new AppError({
        message: 'Refresh token is required',
        statusCode: 400,
        code: ResponseCode.BAD_REQUEST,
      });
    }

    // Verify old refresh token
    const decoded = verifyRefreshToken(oldRefreshToken);

    // Generate new tokens (rotation)
    const payload = {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
    };

    const newAccessToken = generateToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // Revoke old refresh token (add to blacklist)
    revokeToken(oldRefreshToken);

    res.success({
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    next(
      new AppError({
        message: 'Invalid or expired refresh token',
        statusCode: 401,
        code: ResponseCode.UNAUTHORIZED,
      })
    );
  }
}
