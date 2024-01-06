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
  scheduleNotificationWithCategory,
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
  updateLastShaveDate: (date: string | null) => void;
  updateShaveLimit: (limit: number) => void;
  updateNotifications: (value: boolean) => Promise<void>;
  updateNotificationTime: (hour: number, minute: number) => Promise<void>;
  resetShaveData: () => void;
  setLoading: (loading: boolean) => void;
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
  updateLastShaveDate: () => {},
  updateShaveLimit: () => {},
  updateNotifications: (value: boolean) => new Promise(() => {}),
  updateNotificationTime: (hour: number, minute: number) =>
    new Promise(() => {}),
  resetShaveData: () => {},
  setLoading: () => {},
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
    const newState = {
      ...state,
      shaveCount: count,
      lastShaveDate: new Date().toLocaleString('en-US'),
    };
    setState(newState);
    await AsyncStorage.setItem('shaveData', JSON.stringify(newState));
  };

  const updateLastShaveDate = (date: string | null) => {
    const newState = { ...state, lastShaveDate: date };
    setState(newState);
    AsyncStorage.setItem('shaveData', JSON.stringify(newState));
  };

  const updateShaveLimit = (limit: number) => {
    const newState = { ...state, shaveLimit: limit };
    setState(newState);
    AsyncStorage.setItem('shaveData', JSON.stringify(newState));
  };

  const updateNotifications = async (value: boolean) => {
    const newState = { ...state, notificationsEnabled: value };

    if (value === false) {
      await cancelAllScheduledNotificationsAsync();
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

    await scheduleNotificationWithCategory(hour, minute);

    await AsyncStorage.setItem('shaveData', JSON.stringify(newState));
  };

  const resetShaveData = () => {
    const newState = { ...state, shaveCount: 0, lastShaveDate: null };
    setState(newState);
    AsyncStorage.setItem('shaveData', JSON.stringify(newState));
  };

  const setLoading = (loading: boolean) => {
    setState((s) => ({ ...s, loading }));
  };

  return (
    <ShaveDataContext.Provider
      value={{
        state,
        updateShaveCount,
        updateLastShaveDate,
        updateShaveLimit,
        updateNotifications,
        updateNotificationTime,
        resetShaveData,
        setLoading,
      }}
    >
      {children}
    </ShaveDataContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useShaveData = () => useContext(ShaveDataContext);
