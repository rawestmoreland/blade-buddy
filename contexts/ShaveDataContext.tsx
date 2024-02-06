import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  cancelAllScheduledNotificationsAsync,
  requestPermissionsAsync,
  scheduleNotification,
} from '../services/notificationService';

// Define the shape of our state
export interface ShaveDataState {
  shaveCount: number;
  lastShaveDate: string | null;
  shaveLimit: number;
  loading: boolean;
  notificationsEnabled: boolean;
  notificationTime: { hour: number; minute: number };
}

// Creating the context
const ShaveDataContext = createContext<{
  state: ShaveDataState;
  updateShaveCount: (count: number) => Promise<void>;
  updateShaveLimit: (limit: number) => Promise<void>;
  updateNotifications: (value: boolean) => Promise<void>;
  updateNotificationTime: (hour: number, minute: number) => Promise<void>;
  resetShaveData: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  showPermissionDialog: boolean;
  setShowPermissionDialog: (value: boolean) => void;
}>({
  state: {
    shaveCount: 0,
    lastShaveDate: null,
    loading: true,
    shaveLimit: 5,
    notificationsEnabled: true,
    notificationTime: { hour: 9, minute: 0 },
  },
  updateShaveCount: (count: number) => new Promise(() => {}),
  updateShaveLimit: () => new Promise(() => {}),
  updateNotifications: (value: boolean) => new Promise(() => {}),
  updateNotificationTime: (hour: number, minute: number) =>
    new Promise(() => {}),
  resetShaveData: () => new Promise(() => {}),
  setLoading: () => {},
  showPermissionDialog: false,
  setShowPermissionDialog: () => {},
});

// Provider component
export const ShaveDataProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ShaveDataState>({
    shaveCount: 0,
    lastShaveDate: null,
    shaveLimit: 5,
    loading: true,
    notificationsEnabled: true,
    notificationTime: { hour: 9, minute: 0 },
  });

  const [showPermissionDialog, setShowPermissionDialog] =
    useState<boolean>(false);

  useEffect(() => {
    const loadShaveData = async () => {
      const savedData = await AsyncStorage.getItem('shaveData');
      if (savedData) {
        setState({ ...JSON.parse(savedData), loading: false });
      } else {
        setState((s) => ({ ...s, loading: false }));
      }
    };

    loadShaveData();
  }, []);

  const updateShaveCount = async (count: number) => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(now);

    const newState = {
      ...state,
      shaveCount: count,
      lastShaveDate: formattedDate,
    };
    setState(newState);
    await AsyncStorage.setItem('shaveData', JSON.stringify(newState));
  };

  const updateShaveLimit = async (limit: number) => {
    const newState = { ...state, shaveLimit: limit };
    setState(newState);
    await AsyncStorage.setItem('shaveData', JSON.stringify(newState));
  };

  const updateNotifications = async (value: boolean) => {
    const newState = { ...state, notificationsEnabled: value };

    if (value === false) {
      await cancelAllScheduledNotificationsAsync();
    } else {
      const canNotify: boolean = await requestPermissionsAsync();

      if (canNotify) {
        await scheduleNotification(
          state.notificationTime.hour,
          state.notificationTime.minute
        );
      } else {
        setShowPermissionDialog(true);
      }
    }

    setState(newState);
    await AsyncStorage.setItem('shaveData', JSON.stringify(newState));
  };

  const updateNotificationTime = async (hour: number, minute: number) => {
    const newState = {
      ...state,
      notificationTime: { hour, minute },
    };
    setState(newState);

    await cancelAllScheduledNotificationsAsync();

    await scheduleNotification(hour, minute);

    await AsyncStorage.setItem('shaveData', JSON.stringify(newState));
  };

  const resetShaveData = async () => {
    const newState = { ...state, shaveCount: 0, lastShaveDate: null };
    setState(newState);
    await AsyncStorage.setItem('shaveData', JSON.stringify(newState));
  };

  const setLoading = (loading: boolean) => {
    setState((s) => ({ ...s, loading }));
  };

  return (
    <ShaveDataContext.Provider
      value={{
        state,
        updateShaveCount,
        updateShaveLimit,
        updateNotifications,
        updateNotificationTime,
        resetShaveData,
        setLoading,
        showPermissionDialog,
        setShowPermissionDialog,
      }}
    >
      {children}
    </ShaveDataContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useShaveData = () => useContext(ShaveDataContext);
