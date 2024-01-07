import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';
import { BottomNavigation, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Colors from '../../constants/Colors';
import { CommonActions } from '@react-navigation/native';
import HomeScreen from '.';
import SettingsScreen from './settings';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          activeColor={Colors.brand.darkBlue}
          inactiveColor={Colors.brand.lightBlue}
          theme={{
            colors: {
              secondaryContainer: Colors.brand.lightBlue,
            },
          }}
          navigationState={state}
          safeAreaInsets={insets}
          style={{
            backgroundColor: Colors.brand.darkBlue,
            borderTopColor: Colors.brand.lightBlue,
            borderTopWidth: 1,
          }}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({
                focused,
                color,
                size: 24,
              });
            }

            return null;
          }}
          renderLabel={({ route, focused, color }) => {
            return (
              <Text
                variant='bodySmall'
                style={{ color: Colors.brand.lightBlue, textAlign: 'center' }}
              >
                {route.name}
              </Text>
            );
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : // @ts-ignore
                  route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name='razor-double-edge' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Icon name='cog' color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
