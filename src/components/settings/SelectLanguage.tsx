import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useSharedValue } from 'react-native-reanimated';
import { storage } from '@/stores';
import { RadioGroup } from '@/components/common';

const SelectLanguage = () => {
  const { t, i18n } = useTranslation();
  const sharedSelectedLanguage = useSharedValue('pl');
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { id: 'pl', displayName: t('polish') },
    { id: 'en', displayName: t('english') },
  ];

  useEffect(() => {
    const storageLang = storage.getString('userLanguage');
    if (storageLang) {
      sharedSelectedLanguage.value = storageLang;
    }
  }, []);

  const save = async () => {
    setIsLoading(true);
    storage.set('userLanguage', sharedSelectedLanguage.value);
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
