import { Image, StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';
import HomeScreenInfo from '../../components/HomeScreenInfo';
import { useShaveData } from '../../contexts/ShaveDataContext';
import Colors from '../../constants/Colors';

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
      <Image source={require('../../assets/images/LogoDark.png')} />
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
    backgroundColor: Colors.brand.darkBlue,
  },
  title: {
    color: Colors.brand.lightBlue,
    letterSpacing: 1,
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
