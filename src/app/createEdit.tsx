import React from 'react';
import { View, Spacer, useTheme } from 'tamagui';
import CreateCategory from '@/components/createEditDelete/CreateCategory';
import CreateLink from '@/components/createEditDelete/CreateLink';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import SwapToRemove from '@/components/createEditDelete/SwapToRemove';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '@/stores/globalStore';

const Add = () => {
  const visibleTheme = useGlobalStore((state) => state.visibleTheme);
  const { id }: { id: string } = useLocalSearchParams(); // string | string[] by default
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <>
      <Stack.Screen
        options={{
          title: id ? t('edit') : t('add'),
          headerStyle: { backgroundColor: theme.bg.val },
          headerTintColor: theme.text.val,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <View
        backgroundColor='$bg'
        width='100%'
        height='100%'
        paddingHorizontal={10}
      >
        {/* New Category */}
        {!id && (
          <>
            <Spacer />
            <CreateCategory />
          </>
        )}

        <Spacer />

        {/* new link */}
        <CreateLink />

        {!!id && (
          <View flex={1} justifyContent='flex-end'>
            <SwapToRemove id={id} />
          </View>
        )}
      </View>
      <StatusBar style={visibleTheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
};

export default Add;
