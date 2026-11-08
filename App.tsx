/**
 * AppCounters
 *
 * @format
 */

import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {CountersProvider} from './src/context/CountersContext';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WatchHomeScreen from './src/screens/WatchHomeScreen';
import WatchSettingsScreen from './src/screens/WatchSettingsScreen';
import {useIsWatch} from './src/hooks/useIsWatch';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const isWatch = useIsWatch();

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode || isWatch ? 'light-content' : 'dark-content'}
        hidden={isWatch}
      />
      <CountersProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={isWatch ? WatchHomeScreen : HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Settings"
              component={isWatch ? WatchSettingsScreen : SettingsScreen}
              options={
                isWatch ? {headerShown: false} : {title: 'Configure Counters'}
              }
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CountersProvider>
    </SafeAreaProvider>
  );
}

export default App;
