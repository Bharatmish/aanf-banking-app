import React from 'react';
import { useColorScheme } from 'react-native';
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import Toast from 'react-native-toast-message';

export default function App() {
  const scheme = useColorScheme(); // 'light' or 'dark'

  const paperTheme = scheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const navigationTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navigationTheme}>
        <StackNavigator />
      </NavigationContainer>
      <Toast />
    </PaperProvider>
  );
}
