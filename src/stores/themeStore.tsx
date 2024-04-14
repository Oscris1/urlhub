import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage, zustandStorage } from '.';
import { Appearance, useColorScheme, ColorSchemeName } from 'react-native';

interface ThemeState {
  visibleTheme: ColorSchemeName;
  themeKey: 'dark' | 'light' | 'system';
  changeTheme: (theme: 'dark' | 'light' | 'system') => void;
  updateThemeViaSubscription: (themeName: ColorSchemeName) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      visibleTheme: Appearance.getColorScheme() || 'light',
      themeKey: 'system',
      changeTheme: (themeKey) =>
        set({
          themeKey,
          visibleTheme:
            themeKey === 'system' ? Appearance.getColorScheme() : themeKey,
        }),
      updateThemeViaSubscription: (themeName) =>
        set({ visibleTheme: themeName }),
    }),
    {
      name: 'themeKey',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
