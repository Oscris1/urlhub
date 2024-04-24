import React from 'react';
import { ScrollView, View, useTheme } from 'tamagui';
import CreateCategory from '@/components/createEditDelete/CreateCategory';
import CreateLink from '@/components/createEditDelete/CreateLink';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import SwapToRemove from '@/components/createEditDelete/SwapToRemove';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '@/stores/globalStore';
import { useDatabase } from '@nozbe/watermelondb/react';
import { categoriesCollection, linksCollection } from '@/model';
import Toast from 'react-native-toast-message';

const Add = () => {
  const visibleTheme = useGlobalStore((state) => state.visibleTheme);
  const { id, editCategoryId }: { id: string; editCategoryId?: string } =
    useLocalSearchParams(); // string | string[] by default
  const { t } = useTranslation();
  const theme = useTheme();
  const database = useDatabase();

  const showDeleteSuccessToast = () =>
    Toast.show({
      type: 'success',
      text1: t('deleted'),
      visibilityTime: 1500,
    });

  const handleRemoveLink = async () => {
    await database.write(async () => {
      const link = await linksCollection.find(id);
      await link.destroyPermanently();
      showDeleteSuccessToast();
      router.back();
    });
  };

  const handleRemoveCategory = async () => {
    if (!editCategoryId) return;
    const category = await categoriesCollection.find(editCategoryId);
    await category.deleteCategory();
    showDeleteSuccessToast();
    router.back();
  };

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
          {/* New link */}
          {!editCategoryId && <CreateLink />}

          {/* New Category */}
          <CreateCategory />

          {/* Remove link */}
          {!!id && <SwapToRemove handleRemove={handleRemoveLink} />}

          {/* Remove category */}
          {!!editCategoryId && (
            <SwapToRemove handleRemove={handleRemoveCategory} />
          )}
        </View>
      </ScrollView>
      <StatusBar style={visibleTheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
};

export default Add;
