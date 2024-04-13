import React, { useState } from 'react';
import { View, Text, YStack } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { PressableButton } from '@/components/common';
import Toast from 'react-native-toast-message';
import { useSharedValue } from 'react-native-reanimated';
import { Appearance } from 'react-native';
import { SelectItem } from '../SelectLanguage/SelectItem';

export const SelectTheme = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = Appearance.getColorScheme();
  const sharedSelectedTheme = useSharedValue<string>(colorScheme || 'system');

  const themes = [
    { id: 'system', displayName: t('system') },
    { id: 'dark', displayName: t('dark') },
    { id: 'light', displayName: t('light') },
  ];

  const wait = async (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const changeLanguage = async () => {
    await wait(16);
    setIsLoading(true);
    if (sharedSelectedTheme.value === 'system') {
      Appearance.setColorScheme(null);
    } else {
      Appearance.setColorScheme(sharedSelectedTheme.value as 'dark' | 'light');
    }
    await wait(16);
    Toast.show({
      type: 'success',
      text1: t('theme_changed'),
      visibilityTime: 1500,
    });
    setIsLoading(false);
  };

  return (
    <View backgroundColor='$secondary' padding={20} borderRadius={10}>
      <Text color='$text'>{t('choose_theme')}</Text>
      <YStack>
        {themes.map((theme) => (
          <View key={theme.id}>
            <SelectItem item={theme} sharedSelectedItem={sharedSelectedTheme} />
          </View>
        ))}
        <PressableButton isLoading={isLoading} onPress={changeLanguage} />
      </YStack>
    </View>
  );
};
