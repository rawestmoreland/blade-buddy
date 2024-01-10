import { useState } from 'react';

import { Linking, StyleSheet, View } from 'react-native';
import {
  Text,
  SegmentedButtons,
  Switch,
  Portal,
  Dialog,
  Button,
} from 'react-native-paper';

import Slider from '@react-native-community/slider';

import { useShaveData } from '../contexts/ShaveDataContext';
import TimePicker from './TimePicker';
import Colors from '../constants/Colors';

export default function SettingsScreenInfo() {
  const {
    state: shaveData,
    updateShaveLimit,
    updateNotifications,
    updateNotificationTime,
    showPermissionDialog,
    setShowPermissionDialog,
  } = useShaveData();

  const openDeviceSettings = () => {
    Linking.openSettings();
    setShowPermissionDialog(false);
  };

  return (
    <View style={pageStyle.container}>
      <View style={pageStyle.detailsContainer}>
        <Text variant='titleLarge' style={pageStyle.text}>
          Max Shaves
        </Text>
        <Text
          style={[pageStyle.text, { fontWeight: 'bold' }]}
          variant='headlineMedium'
        >
          {shaveData.shaveLimit}
        </Text>
        <Slider
          style={{ width: 200, height: 40 }}
          value={shaveData.shaveLimit}
          step={1}
          minimumValue={1}
          maximumValue={20}
          maximumTrackTintColor='#e8ebe9'
          minimumTrackTintColor={Colors.brand.lightBlue}
          onValueChange={async (value) => {
            updateShaveLimit(value);
          }}
        />
      </View>
      <View style={pageStyle.detailsContainer}>
        <Text style={pageStyle.text} variant='titleLarge'>
          Daily push notifications
        </Text>
        <Switch
          color={Colors.brand.lightBlue}
          value={shaveData.notificationsEnabled}
          onValueChange={updateNotifications}
        />
      </View>
      {shaveData.notificationsEnabled && (
        <View style={pageStyle.detailsContainer}>
          <TimePicker
            storedHour={shaveData?.notificationTime?.hour ?? 9}
            storedMinute={shaveData?.notificationTime?.minute ?? 0}
            updateNotificationTime={updateNotificationTime}
          />
        </View>
      )}
      <Portal>
        <Dialog
          visible={showPermissionDialog}
          onDismiss={() => setShowPermissionDialog(false)}
        >
          <Dialog.Title>Notifications are not enabled.</Dialog.Title>
          <Dialog.Content>
            <Text variant='bodyMedium'>
              You must enable notifications in your phone's settings to receive
              daily reminders.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowPermissionDialog(false)}>
              Cancel
            </Button>
            <Button onPress={openDeviceSettings}>Settings</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const pageStyle = StyleSheet.create({
  container: {
    gap: 40,
    alignItems: 'center',
  },
  detailsContainer: {
    gap: 4,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    color: 'red',
    fontWeight: '700',
  },
  text: {
    color: Colors.brand.lightBlue,
  },
});
