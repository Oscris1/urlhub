import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { useGlobalStore } from '@/stores/globalStore';

import en from './en.json';
import pl from './pl.json';

export const resources = {
  en: { translation: en },
  pl: { translation: pl },
};

export type supportedLanguages = keyof typeof resources;

export const initializeI18n = async (): Promise<void> => {
  if (useGlobalStore.getState().firstLaunch) {
    const localeCode = Localization.getLocales()[0].languageCode;
    if (localeCode) {
      const lang =
        localeCode in resources ? (localeCode as supportedLanguages) : 'en';

      useGlobalStore.getState().setLanguage(lang);
    }
  }

  const userLanguage = useGlobalStore.getState().language;

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources,
    lng: userLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
};
