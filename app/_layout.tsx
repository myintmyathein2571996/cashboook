import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { DatabaseProvider } from '@/src/context/DatabaseContext';
import { RefreshProvider } from '@/src/context/RefreshContext';
import { AppColors } from '@/src/constants/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <DatabaseProvider>
      <RefreshProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: AppColors.card },
            headerTintColor: AppColors.primary,
            headerTitleStyle: { fontWeight: '600', color: AppColors.text },
            contentStyle: { backgroundColor: AppColors.background },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="quick-add"
            options={{ presentation: 'modal', title: 'Add Transaction', headerShown: false }}
          />
          <Stack.Screen name="transaction/add" options={{ title: 'Add Transaction' }} />
          <Stack.Screen name="transaction/[id]" options={{ title: 'Edit Transaction' }} />
          <Stack.Screen name="person/add" options={{ title: 'Add Person' }} />
          <Stack.Screen name="person/[id]" options={{ title: 'Person' }} />
          <Stack.Screen name="person/entry-add" options={{ title: 'Record Entry' }} />
        </Stack>
      </RefreshProvider>
    </DatabaseProvider>
  );
}
