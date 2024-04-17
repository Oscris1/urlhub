import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage, zustandStorage } from '.';
import { Appearance, useColorScheme, ColorSchemeName } from 'react-native';

interface ThemeState {
  visibleTheme: ColorSchemeName;
  themeKey: 'dark' | 'light' | 'system';
  changeTheme: (theme: 'dark' | 'light' | 'system') => void;
  updateThemeViaSubscription: (themeName: ColorSchemeName) => void;
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  resetSelectedCategory: () => void;
}

export const useGlobalStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      visibleTheme: Appearance.getColorScheme() || 'light',
      themeKey: 'system',
      selectedCategory: 'all',
      changeTheme: (themeKey) =>
        set({
          themeKey,
          visibleTheme:
            themeKey === 'system' ? Appearance.getColorScheme() : themeKey,
        }),
      updateThemeViaSubscription: (themeName) =>
        set({ visibleTheme: themeName }),
      setSelectedCategory: (id) => set({ selectedCategory: id }),
      resetSelectedCategory: () => set({ selectedCategory: 'all' }),
    }),
    {
      name: 'themeKey',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        visibleTheme: state.visibleTheme,
        themeKey: state.themeKey,
      }),
    }
  )
);
