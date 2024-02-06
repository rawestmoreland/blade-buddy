import { StyleSheet, View } from 'react-native';
import { Button, IconButton, ProgressBar, Text } from 'react-native-paper';
import { ShaveDataState } from '../contexts/ShaveDataContext';
import Colors from '../constants/Colors';

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
        <Text variant='titleLarge' style={pageStyle.text}>
          {shaveData?.shaveCount ?? 0} / {shaveData?.shaveLimit ?? 0} Shaves
        </Text>
        <ProgressBar
          aria-labelledby='shave-progress-text'
          progress={(shaveData?.shaveCount ?? 0) / (shaveData?.shaveLimit ?? 0)}
          color={Colors.brand.lightBlue}
          style={{
            backgroundColor: 'white',
            height: 30,
            width: 200,
            borderRadius: 16,
            marginBottom: 16,
          }}
        />
        {(shaveData?.shaveCount ?? 0) >= (shaveData?.shaveLimit ?? 0) ? (
          <Text
            id='shave-progress-text'
            style={pageStyle.warningText}
            variant='labelLarge'
          >
            You've reached your limit!
          </Text>
        ) : shaveData?.lastShaveDate ? (
          <Text
            id='last-shaved-text'
            style={pageStyle.dateText}
          >{`Last shave: ${shaveData.lastShaveDate}`}</Text>
        ) : null}
        <View>
          <IconButton
            aria-labelledby='shaved-button-text'
            icon='plus'
            size={48}
            containerColor={Colors.brand.lightBlue}
            iconColor={Colors.brand.darkBlue}
            disabled={loading}
            mode='contained'
            onPress={incrementShaveCount}
          />
        </View>
        <Button
          mode='outlined'
          textColor={Colors.brand.lightBlue}
          disabled={loading}
          onPress={resetShaveData}
        >
          Reset
        </Button>
      </View>
    </View>
  );
}

const pageStyle = StyleSheet.create({
  container: {
    gap: 16,
    alignItems: 'center',
    marginTop: -16,
  },
  text: {
    color: Colors.brand.lightBlue,
  },
  detailsContainer: {
    gap: 16,
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    color: Colors.brand.lightBlue,
    fontWeight: '700',
  },
  dateText: {
    color: Colors.brand.lightBlue,
  },
  buttonStyle: {
    backgroundColor: Colors.brand.lightBlue,
  },
});
