import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '.';
import { Appearance, ColorSchemeName } from 'react-native';

interface ThemeState {
  // theme
  visibleTheme: ColorSchemeName;
  themeKey: 'dark' | 'light' | 'system';
  changeTheme: (theme: 'dark' | 'light' | 'system') => void;
  updateThemeViaSubscription: (themeName: ColorSchemeName) => void;

  // selected Links list category
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  resetSelectedCategory: () => void;

  // fastAdd / share to app behavior
  fastAddBehavior: 'save' | 'ask' | 'ask_and_open';
  showAlertBeforeSaving: boolean;
  navigateToEditScreenAfterSaving: boolean;
  changeFastAddBehavior: (behavior: 'save' | 'ask' | 'ask_and_open') => void;

  //scroll to top
  scrollToTopDependency: boolean; // dependency for link list useEffect
  triggerScrollToTop: () => void;
}

export const useGlobalStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // theme
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

      // selected Links list category
      selectedCategory: 'all',
      setSelectedCategory: (id) => set({ selectedCategory: id }),
      resetSelectedCategory: () => set({ selectedCategory: 'all' }),

      // fastAdd / share to app behavior
      fastAddBehavior: 'ask',
      showAlertBeforeSaving: true,
      navigateToEditScreenAfterSaving: false,
      changeFastAddBehavior: (behavior) =>
        set({
          fastAddBehavior: behavior,
          showAlertBeforeSaving: behavior !== 'save',
          navigateToEditScreenAfterSaving: behavior === 'ask_and_open',
        }),

      // Links list scroll to top
      scrollToTopDependency: true,
      triggerScrollToTop: () =>
        set((state) => ({
          scrollToTopDependency: !state.scrollToTopDependency,
        })),
    }),
    {
      name: 'themeKey',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        visibleTheme: state.visibleTheme,
        themeKey: state.themeKey,
        fastAddBehavior: state.fastAddBehavior,
        showAlertBeforeSaving: state.showAlertBeforeSaving,
        navigateToEditScreenAfterSaving: state.navigateToEditScreenAfterSaving,
      }),
    }
  )
);
