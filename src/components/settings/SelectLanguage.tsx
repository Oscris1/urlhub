import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useSharedValue } from 'react-native-reanimated';
import { RadioGroup } from '@/components/common';
import { useFocusEffect } from 'expo-router';
import { useGlobalStore } from '@/stores/globalStore';

const SelectLanguage = () => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const language = useGlobalStore((state) => state.language);
  const setLanguage = useGlobalStore((state) => state.setLanguage);
  const sharedSelectedLanguage = useSharedValue(language);

  const languages = [
    { id: 'pl', displayName: t('polish') },
    { id: 'en', displayName: t('english') },
  ];

  useEffect(() => {
    if (language) {
      sharedSelectedLanguage.value = language;
    }
  }, []);

  const save = async () => {
    setIsLoading(true);
    setLanguage(sharedSelectedLanguage.value);
    await i18n.changeLanguage(sharedSelectedLanguage.value).then(() => {
      setTimeout(() => {
        setIsLoading(false);
        Toast.show({
          type: 'success',
          text1: t('language_changed'),
          visibilityTime: 1500,
        });
      }, 2000);
    });
  };

  useFocusEffect(
    useCallback(() => {
      sharedSelectedLanguage.value = language;
    }, [language])
  );

  return (
    <RadioGroup
      title={t('select_language')}
      options={languages}
      isLoading={isLoading}
      sharedSelectedItem={sharedSelectedLanguage}
      onSave={save}
    />
  );
};

export default SelectLanguage;
