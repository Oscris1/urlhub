import React, { useState } from 'react';
import { View, Text, YStack } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { PressableButton } from '@/components/common';
import Toast from 'react-native-toast-message';
import { useSharedValue } from 'react-native-reanimated';
import { Appearance } from 'react-native';
import { SelectItem, SelectItemDisabled } from '../SelectLanguage/SelectItem';
import { useGlobalStore } from '@/stores/globalStore';

export const SelectTheme = () => {
  const { t } = useTranslation();
  const setTheme = useGlobalStore((state) => state.changeTheme);
  const theme = useGlobalStore((state) => state.themeKey);

  const [isLoading, setIsLoading] = useState(false);
  const sharedSelectedTheme = useSharedValue<'dark' | 'light' | 'system'>(
    theme
  );

  const themes = [
    { id: 'system', displayName: t('system') },
    { id: 'dark', displayName: t('dark') },
    { id: 'light', displayName: t('light') },
  ];

  const wait = async (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const changeTheme = async () => {
    setIsLoading(true);
    await wait(16);
    setTheme(sharedSelectedTheme.value);

    if (sharedSelectedTheme.value === 'system') {
      Appearance.setColorScheme(null);
    }

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
            {!isLoading ? (
              <SelectItem
                item={theme}
                sharedSelectedItem={sharedSelectedTheme}
              />
            ) : (
              <SelectItemDisabled
                item={theme}
                sharedSelectedItem={sharedSelectedTheme}
              />
            )}
          </View>
        ))}
        <PressableButton isLoading={isLoading} onPress={changeTheme} />
      </YStack>
    </View>
  );
};
