import type { Request, Response, NextFunction } from 'express';
import * as parkingSpaceService from '../services/parking-space.service';
import { AppError } from '../middleware/error.middleware';
import { ResponseCode } from '@iot-smart-parking-system/shared-schemas';
import { getSubscribersByParkingSpaceId } from '../services/subscription.service';
import { notifyParkingSpaceUpdate } from '../config/socket';
import { Expo } from 'expo-server-sdk';
import { sendPushNotifications } from '../services/push-notification.service';
const expo = new Expo();

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

      // Prepare push notification tokens
      // Todo: Data is for testing, replace with real user push tokens from DB
      const TEST_USER_TOKEN = 'ExponentPushToken[phcIGEK9Y100LSCAWl3q0a]';
      const pushTokens: string[] = [TEST_USER_TOKEN];
      if (pushTokens.length > 0) {
        const statusText = isOccupied ? 'occupied' : 'available';
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

export async function notificationWebhookHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const testPushToken = 'ExponentPushToken[phcIGEK9Y100LSCAWl3q0a]';

    const messages = [];
    const isToken = Expo.isExpoPushToken(testPushToken);
    messages.push({
      to: testPushToken,
      sound: 'default',
      body: 'This is a test notification from IoT Smart Parking System!',
      data: { testPushToken },
    });

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        const receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log('Push receipts:', receipts);
      } catch (error) {
        console.error('Error sending push notifications:', error);
      }
    }

    res.success({
      data: isToken,
      message: 'Notification received successfully',
    });
  } catch (error) {
    next(error);
  }
}
