import { SetStateAction, useRef, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';
import { ShaveDataProvider } from '../contexts/ShaveDataContext';
import {
  defineNotificationCategories,
  getScheduledNotificationsAsync,
  requestPermissionsAsync,
  scheduleNotificationAndGetID,
} from '../services/notificationService';

import * as Notifications from 'expo-notifications';
import NotificationHandler from '../components/NotificationHandler';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const notificationListener = useRef<Notifications.Subscription>();
  const [notification, setNotification] = useState<any>();

  const [pushAllowed, setPushAllowed] = useState(false);
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const requestNotificationsPerms = async () => {
      await requestPermissionsAsync().then((result) => {
        setPushAllowed(result);
      });
    };

    requestNotificationsPerms().then(() => {
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) =>
          setNotification(notification)
        );
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
    };
  }, []);

  useEffect(() => {
    if (!pushAllowed) return;

    const setupNotifications = async () => {
      await defineNotificationCategories();

      const scheduledNotifications = await getScheduledNotificationsAsync();

      if (scheduledNotifications.length > 0) {
        return;
      }

      await scheduleNotificationAndGetID();
    };

    setupNotifications();
  }, [pushAllowed]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    accent: 'yellow',
  },
};

function RootLayoutNav() {
  return (
    <PaperProvider theme={theme}>
      <ShaveDataProvider>
        <NotificationHandler />
        <Stack>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack>
      </ShaveDataProvider>
    </PaperProvider>
  );
}
