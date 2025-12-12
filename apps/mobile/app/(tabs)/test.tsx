import { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  registerForPushNotifications,
  scheduleNotification,
  showNotification,
  cancelAllNotifications,
  getScheduledNotifications,
  setupNotificationListeners,
  areNotificationsEnabled,
  getNotificationChannels,
} from '@/utils/notification';

export default function NotificationTest() {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const [isEnabled, setIsEnabled] = useState(false);
  const [scheduledCount, setScheduledCount] = useState(0);

  useEffect(() => {
    // Register for push notifications
    registerForPushNotifications().then(token => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    // Check if notifications are enabled
    areNotificationsEnabled().then(setIsEnabled);

    // Get notification channels (Android)
    getNotificationChannels().then(setChannels);

    // Setup listeners
    const cleanup = setupNotificationListeners(
      notification => {
        setNotification(notification);
      },
      response => {
        console.log('User tapped notification:', response);
      }
    );

    return cleanup;
  }, []);

  const refreshScheduledCount = async () => {
    const scheduled = await getScheduledNotifications();
    setScheduledCount(scheduled.length);
  };

  const requireNotificationPermission = async () => {
    try {
      // Request notification permissions explicitly
      const { status } = await Notifications.requestPermissionsAsync();

      if (status === 'granted') {
        // Permission granted, register for push notifications
        const token = await registerForPushNotifications();
        if (token) {
          setExpoPushToken(token);
        }
        setIsEnabled(true);
        alert('✅ Notification permissions granted!');
      } else {
        setIsEnabled(false);
        alert('❌ Notification permissions denied. Please enable in Settings.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      alert('Failed to request notification permissions');
    }
  };

  useEffect(() => {
    refreshScheduledCount();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Notification Test</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{isEnabled ? '✅ Enabled' : '❌ Disabled'}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Push Token:</Text>
          <Text style={styles.tokenText} numberOfLines={2}>
            {expoPushToken || 'Not available'}
          </Text>
        </View>

        {channels.length > 0 && (
          <View style={styles.infoBox}>
            <Text style={styles.label}>Channels:</Text>
            <Text style={styles.value}>{channels.map(c => c.id).join(', ')}</Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.label}>Scheduled:</Text>
          <Text style={styles.value}>{scheduledCount} notifications</Text>
        </View>
      </View>

      {notification && (
        <View style={[styles.section, styles.notificationBox]}>
          <Text style={styles.subtitle}>Last Notification:</Text>
          <Text style={styles.notifText}>Title: {notification.request.content.title}</Text>
          <Text style={styles.notifText}>Body: {notification.request.content.body}</Text>
          <Text style={styles.notifText}>
            Data: {JSON.stringify(notification.request.content.data)}
          </Text>
        </View>
      )}

      <View style={styles.buttonSection}>
        <Button
          title="📬 Show Immediate Notification"
          onPress={async () => {
            await showNotification('Immediate Notification', 'This shows up right away!', {
              timestamp: Date.now(),
            });
          }}
        />

        <View style={styles.spacer} />

        <Button
          title="⏰ Schedule in 5 seconds"
          onPress={async () => {
            await scheduleNotification(
              'Scheduled Notification',
              'This was scheduled 5 seconds ago',
              { scheduled: true },
              5
            );
            await refreshScheduledCount();
          }}
        />

        <View style={styles.spacer} />

        <Button
          title="🅿️ Parking Space Update"
          onPress={async () => {
            await showNotification(
              '🚗 Parking Space Available',
              'Kungsgatan 10 is now available!',
              { parkingSpaceId: '123', status: 'available' }
            );
          }}
        />

        <View style={styles.spacer} />

        <Button
          title="📊 View Scheduled"
          onPress={async () => {
            const scheduled = await getScheduledNotifications();
            console.log('Scheduled notifications:', scheduled);
            await refreshScheduledCount();
            alert(`${scheduled.length} notifications scheduled`);
          }}
        />

        <View style={styles.spacer} />

        <Button
          title="🗑️ Cancel All"
          color="#f44336"
          onPress={async () => {
            await cancelAllNotifications();
            await refreshScheduledCount();
          }}
        />

        <View style={styles.spacer} />

        <Button
          title="🔔 Request Notification Permission"
          color="#4CAF50"
          onPress={requireNotificationPermission}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  tokenText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
  },
  notificationBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
  },
  notifText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  buttonSection: {
    marginTop: 10,
  },
  spacer: {
    height: 10,
  },
});
