import type { Request, Response, NextFunction } from 'express';
import * as parkingSpaceService from '../services/parking-space.service';
import { AppError } from '../middleware/error.middleware';
import { ResponseCode } from '@iot-smart-parking-system/shared-schemas';
import { checkSubscription } from '../services/subscription.service';
import { notifyParkingSpaceUpdate } from '../config/socket';

/**
 * Webhook endpoint for IoT sensor updates
 * Sensors can POST their status to this endpoint
 */
export const sensorWebhookHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sensorId, isOccupied, currentPrice } = req.body;

    if (!sensorId || isOccupied === undefined) {
      throw new AppError({
        message: 'sensorId and isOccupied are required',
        statusCode: 400,
        code: ResponseCode.FAILURE,
      });
    }

    // Update parking space status
    const parkingSpace = await parkingSpaceService.updateParkingSpaceStatus(
      sensorId,
      isOccupied,
      currentPrice
    );
    // notify clients who subscribed this parking lot via WebSocket
    // 1. Check user's subscriptions
    // 2. If subscribed, send the updated parking space info
    const userId = req.user?.userId || (req.headers['x-user-id'] as string | undefined);
    // for testing:
    // "userId": "7598e539-0afc-408a-b56f-0adb274ab730",
    // "email": "user@parking.com",
    // "username": "testuser",

    if (userId) {
      const isSubscribed = await checkSubscription(userId, parkingSpace.id);

      if (isSubscribed) {
        // notify user about the parking space update
        console.log('Notifying subscribed user about parking space update');
        notifyParkingSpaceUpdate(parkingSpace.id, parkingSpace);
      }
    }

    res.success({
      data: parkingSpace,
      message: 'Parking space status updated successfully',
    });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      next(
        new AppError({
          message: 'Parking space with the given sensorId not found',
          statusCode: 404,
          code: ResponseCode.NOT_FOUND,
        })
      );
    } else {
      next(error);
    }
  }
};
