import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useShaveData } from '../contexts/ShaveDataContext';

const NotificationHandler = () => {
  const { updateShaveCount, state: shaveData } = useShaveData();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        if (response.actionIdentifier === 'yes') {
          const newShaveCount = shaveData.shaveCount + 1;
          updateShaveCount(newShaveCount);
        }
      }
    );

    return () => subscription.remove();
  }, [shaveData.shaveCount, updateShaveCount]);

  return null; // This component does not render anything
};

export default NotificationHandler;
