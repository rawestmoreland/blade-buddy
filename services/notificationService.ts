import * as Notifications from 'expo-notifications';

export async function requestPermissionsAsync(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (finalStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return false;
  }
  return true;
}

export async function defineNotificationCategories() {
  await Notifications.setNotificationCategoryAsync('shaveQuery', [
    {
      identifier: 'yes',
      buttonTitle: 'Yes',
      options: { opensAppToForeground: true },
    },
    {
      identifier: 'no',
      buttonTitle: 'No',
      options: { opensAppToForeground: true },
    },
  ]);
}

export async function scheduleNotificationWithCategory(
  hour: number = 9,
  minute: number = 0
) {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Hey! It's Blade Buddy!",
      body: 'Did you shave today?',
    },
    trigger: { hour, minute, repeats: true },
  });

  return notificationId;
}

export const scheduleNotification = async (
  hour: number = 9,
  minute: number = 0
) => {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Hey! It's Blade Buddy!",
      body: 'Did you shave today? Tap Yes or No below.',
    },
    trigger: { hour, minute, repeats: true },
  });

  return notificationId;
};

export async function scheduleNotificationAndGetID() {
  const notificationId = await scheduleNotification();

  return notificationId;
}

export async function getScheduledNotificationsAsync() {
  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();
  return scheduledNotifications;
}

export async function cancelScheduledNotificationAsync(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function cancelAllScheduledNotificationsAsync() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
