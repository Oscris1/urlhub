import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en.json';
import pl from './pl.json';
import { storage } from '@/stores';

export const resources = {
  en: { translation: en },
  pl: { translation: pl },
};

export const initializeI18n = async (): Promise<void> => {
  let userLanguage = storage.getString('userLanguage');
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
