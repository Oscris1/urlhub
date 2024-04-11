import React, { useEffect, useState } from 'react';
import { View, Text, YStack } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { storage } from '@/translations';
import { PressableButton } from '@/components/common';
import Toast from 'react-native-toast-message';
import { useSharedValue } from 'react-native-reanimated';

import {
  LanguageSelectItem,
  LanguageSelectItemDisabled,
} from './LanguageSelectItem';

export const SelectLanguage = () => {
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
    <View
      backgroundColor='rgba(141, 162, 238, 0.3)'
      padding={20}
      borderRadius={10}
    >
      <Text color='white'>{t('select_language')}</Text>
      <YStack>
        {languages.map((language) => (
          <View key={language.id}>
            {!isLoading ? (
              <LanguageSelectItem
                language={language}
                sharedSelectedLanguage={sharedSelectedLanguage}
              />
            ) : (
              <LanguageSelectItemDisabled
                language={language}
                sharedSelectedLanguage={sharedSelectedLanguage}
              />
            )}
          </View>
        ))}
        <PressableButton isLoading={isLoading} onPress={save} />
      </YStack>
    </View>
  );
};
