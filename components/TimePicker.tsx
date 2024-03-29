import { useState } from 'react';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import formatTime from '../lib/functions/formatTime';
import Colors from '../constants/Colors';

export default function TimePicker({
  storedHour,
  storedMinute,
  updateNotificationTime,
}: {
  storedHour: number;
  storedMinute: number;
  updateNotificationTime: (hour: number, minute: number) => Promise<void>;
}) {
  const initialDate = new Date();
  initialDate.setHours(storedHour, storedMinute, 0, 0);

  const [show, setShow] = useState(Platform.OS === 'ios');
  const [date, setDate] = useState(initialDate);

  const handleChange = async (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();

    await updateNotificationTime(hour, minute);

    if (Platform.OS === 'ios') {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  return (
    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
      {Platform.OS === 'ios' && <Text style={styles.text}>Scheduled for:</Text>}
      {Platform.OS === 'android' && (
        <View style={styles.row}>
          <Text variant='bodyLarge' style={styles.text}>
            Scheduled for:{' '}
          </Text>
          <Button
            buttonColor={Colors.brand.lightBlue}
            textColor={Colors.brand.darkBlue}
            onPress={() => setShow(true)}
          >
            {formatTime(date.getHours(), date.getMinutes())}
          </Button>
        </View>
      )}
      {show && (
        <DateTimePicker
          testID='dateTimePicker'
          value={date}
          mode='time'
          themeVariant='dark'
          is24Hour={false}
          display='default'
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.brand.lightBlue,
  },
  picker: {
    backgroundColor: Colors.brand.lightBlue,
    marginLeft: 8,
  },
});
