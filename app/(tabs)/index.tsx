import { StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';
import HomeScreenInfo from '../../components/HomeScreenInfo';
import { useShaveData } from '../../contexts/ShaveDataContext';

export default function HomeScreen() {
  const { state: shaveData, updateShaveCount, resetShaveData } = useShaveData();

  const handleIncrementShaveCount = async () => {
    const newShaveCount = shaveData.shaveCount + 1;
    updateShaveCount(newShaveCount);
  };

  const handleResetShaveData = async () => {
    resetShaveData();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blade Buddy</Text>
      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      />
      <HomeScreenInfo
        resetShaveData={handleResetShaveData}
        incrementShaveCount={handleIncrementShaveCount}
        loading={shaveData.loading}
        shaveData={shaveData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
