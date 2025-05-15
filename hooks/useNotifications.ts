import { useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type NotificationPayload = {
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

export default function useNotifications() {
  /**
   * Request notification permissions
   */
  const requestNotificationPermissions = useCallback(async () => {
    if (!Device.isDevice) {
      Alert.alert('Must use a physical device for Notifications!');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permission if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permission denied! Cannot show notifications.');
      return false;
    }

    return true;
  }, []);

  /**
   * Schedule a local notification immediately
   */
  const sendTestNotification = useCallback(
    async (payload: NotificationPayload) => {
      try {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) return;

        await Notifications.scheduleNotificationAsync({
          content: {
            title: payload.title,
            body: payload.body,
            data: payload.data,
            sound: 'default',
          },
          trigger: null, // Trigger immediately
        });

      } catch (error) {
        console.error('Error showing notification:', error);
        Alert.alert('Failed to show notification.');
      }
    },
    [requestNotificationPermissions]
  );

  const sendHotWeatherNotification = useCallback(async () => {
    await sendTestNotification({
      title: '🌡️ Weather Alert!',
      body: 'The weather is very hot, don’t leave your house!',
    });
  }, [sendTestNotification]);

  return {
    sendTestNotification,
    sendHotWeatherNotification,
  };
}