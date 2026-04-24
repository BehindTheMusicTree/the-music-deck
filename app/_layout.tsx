import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts, Cinzel_400Regular, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono';
import {
  CormorantGaramond_300Light,
  CormorantGaramond_300Light_Italic,
  CormorantGaramond_400Regular,
  CormorantGaramond_400Regular_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '@/lib/game-state';
import { colors } from '@/lib/tokens';
import { View, StyleSheet, Platform } from 'react-native';
import TopBar from '@/components/ui/TopBar';
import BottomNav from '@/components/ui/BottomNav';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_700Bold,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
    CormorantGaramond_300Light,
    CormorantGaramond_300Light_Italic,
    CormorantGaramond_400Regular,
    CormorantGaramond_400Regular_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <GameProvider>
        <StatusBar style="light" backgroundColor={colors.bg} />
        <View style={styles.root}>
          <TopBar />
          <View style={[styles.screens, Platform.OS === 'web' && styles.screensWeb]}>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
          </View>
          <BottomNav />
          <Modal />
          <Toast />
        </View>
      </GameProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screens: {
    flex: 1,
    overflow: 'hidden',
  },
  screensWeb: {
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
});
