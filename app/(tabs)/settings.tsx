import { StyleSheet } from 'react-native';

import SettingsScreenInfo from '../../components/SettingsScreenInfo';
import { Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.text]}>Settings</Text>
      <View
        style={styles.separator}
        lightColor={Colors.brand.lightBlue}
        darkColor={Colors.brand.darkBlue}
      />
      <SettingsScreenInfo />
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  text: {
    color: Colors.brand.lightBlue,
  },
});
