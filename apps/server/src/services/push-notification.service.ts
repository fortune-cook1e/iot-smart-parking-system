import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { logger } from '../utils/logger';

const expo = new Expo();

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'default' | null;
}

/**
 * Send push notifications to multiple users
 */
export async function sendPushNotifications(
  pushTokens: string[],
  payload: NotificationPayload
): Promise<void> {
  // filter out invalid tokens
  const validTokens = pushTokens.filter(token => Expo.isExpoPushToken(token));

  if (validTokens.length === 0) {
    logger.warn('No valid push tokens to send notifications');
    return;
  }

  // construct messages
  const messages: ExpoPushMessage[] = validTokens.map(token => ({
    to: token,
    sound: payload.sound ?? 'default',
    title: payload.title,
    body: payload.body,
    data: payload.data ?? {},
  }));

  // batch send (Expo limits to 100 per batch)
  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      logger.info('Push notifications sent', {
        chunkSize: chunk.length,
        receipts,
      });
    } catch (error) {
      logger.error('Failed to send push notification chunk', error as Error, {
        chunkSize: chunk.length,
      });
    }
  }
}
