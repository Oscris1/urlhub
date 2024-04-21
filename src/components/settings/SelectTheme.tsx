import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useSharedValue } from 'react-native-reanimated';
import { Appearance } from 'react-native';
import { useGlobalStore } from '@/stores/globalStore';
import { RadioGroup } from '../common/RadioGroup/RadioGroup';

const SelectTheme = () => {
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
    <RadioGroup
      title={t('choose_theme')}
      options={themes}
      isLoading={isLoading}
      sharedSelectedItem={sharedSelectedTheme}
      onSave={changeTheme}
    />
  );
};

export default SelectTheme;
