import { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';

import { View } from '../../components/Themed';
import HomeScreenInfo from '../../components/HomeScreenInfo';
import { useShaveData } from '../../contexts/ShaveDataContext';
import Colors from '../../constants/Colors';
import { getRandomImageName } from '../../lib/functions/getRandomImage';

const images: { [key: string]: any } = {
  'IMG_4611.png': require('../../assets/images/IMG_4611.png'),
  'IMG_4612.png': require('../../assets/images/IMG_4612.png'),
  'IMG_4613.png': require('../../assets/images/IMG_4613.png'),
};

export default function HomeScreen() {
  const { state: shaveData, updateShaveCount, resetShaveData } = useShaveData();
  const [image, setImage] = useState<string | undefined>();

  const handleIncrementShaveCount = async () => {
    const newShaveCount = shaveData.shaveCount + 1;
    updateShaveCount(newShaveCount);
  };

  const handleResetShaveData = async () => {
    resetShaveData();
  };

  useEffect(() => {
    if (image) return;
    const randoImage = getRandomImageName();
    setImage(randoImage);
  }, [image]);

  if (!image) return null;

  return (
    <View style={styles.container}>
      {image && (
        <Image
          style={{
            height: 200,
            width: 200,
            borderRadius: 24,
            marginBottom: 60,
          }}
          source={images[image] || images['IMG_4611.png']}
        />
      )}
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
