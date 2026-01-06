import type { Request, Response, NextFunction } from 'express';
import * as parkingSpaceService from '../services/parking-space.service';
import { AppError } from '../middleware/error.middleware';
import { ResponseCode } from '@iot-smart-parking-system/shared-schemas';
import { getSubscribersByParkingSpaceId } from '../services/subscription.service';
import { notifyParkingSpaceUpdate } from '../config/socket';
import { sendPushNotifications } from '../services/push-notification.service';

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

    // Get all subscribers for this parking space
    const subscribers = await getSubscribersByParkingSpaceId(parkingSpace.id);
    if (subscribers && subscribers.length > 0) {
      // Notify all subscribed users about the parking space update via WebSocket
      notifyParkingSpaceUpdate(parkingSpace.id, parkingSpace);

      const pushTokens = subscribers.map(sub => sub.user.pushTokens).flat();
      // Prepare push notification tokens
      if (pushTokens.length > 0) {
        const statusText = isOccupied ? 'occupied' : 'available';
        console.log(`Sending push notifications to tokens: ${pushTokens.join(', ')}`);
        await sendPushNotifications(pushTokens, {
          title: 'Parking Space Update',
          body: `Parking space ${parkingSpace.name} is now ${statusText}.`,
          data: { parkingSpaceId: parkingSpace.id },
        });
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
          code: ResponseCode.FAILURE,
        })
      );
    } else {
      next(error);
    }
  }
};
