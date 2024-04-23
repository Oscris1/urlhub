import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useSharedValue } from 'react-native-reanimated';
import { useGlobalStore } from '@/stores/globalStore';
import { RadioGroup } from '../common/RadioGroup/RadioGroup';
import { useFocusEffect } from 'expo-router';

const SelectQuickAddBehavior = () => {
  const { t } = useTranslation();
  const changeFastAddBehavior = useGlobalStore(
    (state) => state.changeFastAddBehavior
  );
  const fastAddBehavior = useGlobalStore((state) => state.fastAddBehavior);

  const [isLoading, setIsLoading] = useState(false);
  const sharedSelectedBehavior = useSharedValue<
    'save' | 'ask' | 'ask_and_open'
  >(fastAddBehavior);

  const behaviors = [
    { id: 'ask', displayName: t('ask_if_save') },
    { id: 'save', displayName: t('only_save') },
    { id: 'ask_and_open', displayName: t('save_and_edit') },
  ];

  const wait = async (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const changeTheme = async () => {
    setIsLoading(true);
    await wait(16);
    changeFastAddBehavior(sharedSelectedBehavior.value);

    Toast.show({
      type: 'success',
      text1: t('quick_action_saved'),
      visibilityTime: 1500,
    });
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      sharedSelectedBehavior.value = fastAddBehavior;
    }, [fastAddBehavior])
  );

  return (
    <RadioGroup
      title={t('choose_app_behavior')}
      options={behaviors}
      isLoading={isLoading}
      sharedSelectedItem={sharedSelectedBehavior}
      onSave={changeTheme}
    />
  );
};

export default SelectQuickAddBehavior;
