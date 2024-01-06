import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { TShaveData } from '../types/shaveData';
import { ShaveDataState } from '../contexts/ShaveDataContext';

export default function HomeScreenInfo({
  loading,
  shaveData,
  incrementShaveCount,
  resetShaveData,
}: {
  loading: boolean;
  shaveData: ShaveDataState | null;
  incrementShaveCount: () => void;
  resetShaveData: () => void;
}) {
  return (
    <View style={pageStyle.container}>
      <View style={pageStyle.container}>
        <View style={pageStyle.detailsContainer}>
          <Text variant='bodyMedium'>
            Last Shaved:{' '}
            {shaveData?.lastShaveDate ? shaveData?.lastShaveDate : 'Never'}
          </Text>
          <Text variant='bodyMedium'>
            Shave Count: {shaveData?.shaveCount ?? 'N/A'}
          </Text>
          {(shaveData?.shaveLimit ?? 0) <= (shaveData?.shaveCount ?? 0) ? (
            <Text style={pageStyle.warningText} variant='bodyLarge'>
              Time to change your blade!
            </Text>
          ) : (
            <Text variant='bodyMedium'>
              Change your blade at: {shaveData?.shaveLimit ?? 'N/A'} shaves
            </Text>
          )}
        </View>
        <Button
          disabled={loading}
          mode='contained'
          onPress={incrementShaveCount}
        >
          Increment Shave
        </Button>
        <Button disabled={loading} onPress={resetShaveData}>
          Reset
        </Button>
      </View>
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    color: 'red',
    fontWeight: '700',
  },
});
