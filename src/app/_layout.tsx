import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { SplashScreen, Stack, router } from 'expo-router';
import { Appearance, ColorSchemeName } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { database } from '@/model';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { config } from '../../tamagui.config';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { toastConfig } from 'toast.config';
import { initializeI18n } from '@/translations';
import '../../tamagui-web.css';
import { useGlobalStore } from '@/stores/globalStore';
import { ShareIntentProvider } from 'expo-share-intent';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const updateThemeViaSubscription = useGlobalStore(
    (state) => state.updateThemeViaSubscription
  );
  const themeKey = useGlobalStore((state) => state.themeKey);
  const finishFirstLaunch = useGlobalStore((state) => state.finishFirstLaunch);
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    initializeI18n().then(() => finishFirstLaunch());
  }, []);

  useEffect(() => {
    const handleChange = ({
      colorScheme,
    }: {
      colorScheme: ColorSchemeName;
    }) => {
      if (themeKey === 'system') {
        updateThemeViaSubscription(colorScheme);
      }
    };
    const subscription = Appearance.addChangeListener(handleChange);
    return () => subscription.remove();
  }, [themeKey]);

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const visibleTheme = useGlobalStore((state) => state.visibleTheme);

  return (
    <ShareIntentProvider
      options={{
        debug: false,
        resetOnBackground: true,
        onResetShareIntent: () =>
          // used when app going in background and when the reset button is pressed
          router.navigate({
            pathname: '/',
          }),
      }}
    >
      <TamaguiProvider config={config} defaultTheme={visibleTheme as any}>
        <ThemeProvider
          value={visibleTheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <DatabaseProvider database={database}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack>
                <Stack.Screen
                  name='(tabs)'
                  options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                  }}
                />
              </Stack>
              <Toast config={toastConfig} position='bottom' bottomOffset={70} />
            </GestureHandlerRootView>
          </DatabaseProvider>
        </ThemeProvider>
      </TamaguiProvider>
    </ShareIntentProvider>
  );
}
