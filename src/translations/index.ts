import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { MMKV } from 'react-native-mmkv';
import * as Localization from 'expo-localization';

import en from './en.json';
import pl from './pl.json';

export const resources = {
  en: { translation: en },
  pl: { translation: pl },
};

export const storage = new MMKV();

// Funkcja do inicjalizacji i18next z uwzględnieniem MMKV
export const initializeI18n = async (): Promise<void> => {
  let userLanguage = storage.getString('userLanguage');
  console.log('userLanguage', userLanguage);
  if (!userLanguage) {
    userLanguage = Localization.getLocales()[0].languageCode || undefined;
    if (userLanguage) {
      storage.set('userLanguage', userLanguage);
    }
  }

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

export const changeLanguage = (language: string): void => {
  storage.set('userLanguage', language);
  i18n.changeLanguage(language);
};
