import React from 'react';
import { ScrollView, View, useTheme } from 'tamagui';
import CreateCategory from '@/components/createEditDelete/CreateCategory';
import CreateLink from '@/components/createEditDelete/CreateLink';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import SwapToRemove from '@/components/createEditDelete/SwapToRemove';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '@/stores/globalStore';

const Add = () => {
  const visibleTheme = useGlobalStore((state) => state.visibleTheme);
  const { id, editCategoryId }: { id: string; editCategoryId?: string } =
    useLocalSearchParams(); // string | string[] by default
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: id
            ? t('edit_link')
            : editCategoryId
            ? t('edit_category')
            : t('add'),
          headerStyle: { backgroundColor: theme.bg.val },
          headerTintColor: theme.text.val,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <ScrollView>
        <View
          backgroundColor='$bg'
          width='100%'
          height='100%'
          paddingHorizontal={10}
          paddingTop={20}
          gap={20}
        >
          {/* new link */}
          {!editCategoryId && <CreateLink />}

          {/* New Category */}
          <CreateCategory />

          {!!id && <SwapToRemove id={id} />}
        </View>
      </ScrollView>
      <StatusBar style={visibleTheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
};

export default Add;
