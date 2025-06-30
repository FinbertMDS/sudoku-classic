import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';

import {ThemeProvider} from '@/context/ThemeContext';
import {setupEventListeners} from '@/events/setupEventListeners';
import {SCREENS} from '@/utils/constants';
import {useEffect} from 'react';
import {useAppPause} from '../hooks/useAppPause';
import {autoDetectLanguage} from '../i18n/i18n';
import {runMigrationsIfNeeded} from '../storage/runMigrationsIfNeeded';

export default function RootLayout() {
  useEffect(() => {
    setupEventListeners();
    runMigrationsIfNeeded();
  }, []);

  useAppPause(
    () => {},
    () => {
      setTimeout(() => {
        autoDetectLanguage();
      }, 200);
    },
  );
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={SCREENS.HOME_TABS} />
        <Stack.Screen name={SCREENS.NOT_FOUND} />
        <Stack.Screen name={SCREENS.BOARD} />
        <Stack.Screen name={SCREENS.OPTIONS} />
        <Stack.Screen name={SCREENS.SETTINGS} />
        <Stack.Screen name={SCREENS.HOW_TO_PLAY} />
        <Stack.Screen name={SCREENS.ABOUT_GAME} />
        <Stack.Screen name={SCREENS.SK_WEBVIEW} />
        <Stack.Screen name={SCREENS.PLAYERS} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
