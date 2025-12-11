import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Register for push notifications and get Expo push token
 * @returns Expo push token or null if registration fails
 */
export async function registerForPushNotifications(): Promise<string | null> {
  let token: string | null = null;

  // Android requires a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Allow notifications in simulator/emulator for development
  if (!Device.isDevice) {
    console.warn('⚠️ Using simulator - push tokens unavailable, but local notifications will work');

    // Still request permissions for local notifications
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === 'granted') {
        console.log('✅ Local notification permissions granted');
      }
    } catch (error) {
      console.error('Failed to get notification permissions:', error);
    }

    return null; // No push token in simulator
  }

  try {
    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    // Get Expo push token
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

    if (!projectId) {
      console.error('Project ID not found');
      return null;
    }

    const pushToken = await Notifications.getExpoPushTokenAsync({ projectId });
    token = pushToken.data;
    console.log('✅ Expo push token:', token);
  } catch (error) {
    console.error('Failed to get push token:', error);
    return null;
  }

  return token;
}

/**
 * Schedule a local notification
 * @param title - Notification title
 * @param body - Notification body
 * @param data - Optional data payload
 * @param seconds - Delay in seconds before showing notification
 */
export async function scheduleNotification(
  title: string,
  body: string,
  data?: Record<string, any>,
  seconds: number = 1 // Default 1 second to ensure background notifications work
): Promise<string | null> {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        vibrate: [0, 250, 250, 250],
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(seconds, 1), // Minimum 1 second for background support
      },
    });

    console.log('✅ Notification scheduled:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
}

/**
 * Show an immediate local notification
 * Note: Has a 1-second delay to ensure it works when app is in background
 * @param title - Notification title
 * @param body - Notification body
 * @param data - Optional data payload
 */
export async function showNotification(
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<string | null> {
  return scheduleNotification(title, body, data, 1);
}

/**
 * Cancel a scheduled notification
 * @param notificationId - The ID returned from scheduleNotification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('✅ Notification cancelled:', notificationId);
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ All notifications cancelled');
  } catch (error) {
    console.error('Failed to cancel all notifications:', error);
  }
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications;
  } catch (error) {
    console.error('Failed to get scheduled notifications:', error);
    return [];
  }
}

/**
 * Setup notification listeners
 * @param onNotificationReceived - Callback when notification is received while app is foregrounded
 * @param onNotificationResponse - Callback when user taps on notification
 * @returns Cleanup function to remove listeners
 */
export function setupNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void
): () => void {
  const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
    console.log('📬 Notification received:', notification);
    onNotificationReceived?.(notification);
  });

  const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('👆 Notification tapped:', response);
    onNotificationResponse?.(response);
  });

  // Return cleanup function
  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}

/**
 * Check if notifications are enabled
 */
export async function areNotificationsEnabled(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

/**
 * Get notification channels (Android only)
 */
export async function getNotificationChannels(): Promise<Notifications.NotificationChannel[]> {
  if (Platform.OS === 'android') {
    const channels = await Notifications.getNotificationChannelsAsync();
    return channels ?? [];
  }
  return [];
}

/**
 * Create a notification channel (Android only)
 */
export async function createNotificationChannel(
  id: string,
  name: string,
  importance: Notifications.AndroidImportance = Notifications.AndroidImportance.DEFAULT
): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(id, {
      name,
      importance,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}
