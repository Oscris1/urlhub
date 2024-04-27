import React from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useSharedValue } from 'react-native-reanimated';
import { useGlobalStore } from '@/stores/globalStore';
import { RadioGroup } from '../common/RadioGroup/RadioGroup';
import { wait } from '@/utils';

const SelectTheme = () => {
  const { t } = useTranslation();
  const setTheme = useGlobalStore((state) => state.changeTheme);
  const theme = useGlobalStore((state) => state.themeKey);

  const sharedSelectedTheme = useSharedValue<'dark' | 'light' | 'system'>(
    theme
  );
  const sharedLoading = useSharedValue<boolean>(false);

  const themes = [
    { id: 'system', displayName: t('system') },
    { id: 'dark', displayName: t('dark') },
    { id: 'light', displayName: t('light') },
  ];

  const changeTheme = async () => {
    sharedLoading.value = true;
    await wait(650);
    setTheme(sharedSelectedTheme.value);

    Toast.show({
      type: 'success',
      text1: t('theme_changed'),
      visibilityTime: 1500,
    });
    sharedLoading.value = false;
  };

  return (
    <RadioGroup
      title={t('choose_theme')}
      options={themes}
      sharedSelectedItem={sharedSelectedTheme}
      onSave={changeTheme}
      sharedLoading={sharedLoading}
    />
  );
};

export default SelectTheme;
