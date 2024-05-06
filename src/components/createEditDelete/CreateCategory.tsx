import React, { useEffect, useState } from 'react';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { View, Text, Input } from 'tamagui';
import { InputWrapper, SaveButton } from '@/components/common';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { router } from 'expo-router';
import { categoriesCollection } from '@/model';
import Toast from 'react-native-toast-message';
import EditCategorySelector from './EditCategorySelector';

const CreateCategory = () => {
  const database = useDatabase();
  const [categoryName, setCategoryName] = useState<string>('');
  const { editCategoryId }: { id?: string; editCategoryId?: string } =
    useLocalSearchParams(); // string | string[] by default
  const { t } = useTranslation();

  const prepareEdit = async () => {
    if (editCategoryId) {
      const category = await categoriesCollection.find(editCategoryId);
      setCategoryName(category.name);
    }
  };

  useEffect(() => {
    prepareEdit();
  }, [editCategoryId]);

  const createOrEditCategory = async (
    animation: () => void,
    endAnimation: () => void
  ) => {
    if (!categoryName) return;

    animation();

    await database.write(async () => {
      // create new category
      if (!editCategoryId) {
        await categoriesCollection.create((category) => {
          category.name = categoryName;
        });
        return;
      }

      // edit category
      if (editCategoryId) {
        const category = await categoriesCollection.find(editCategoryId);
        await category.update(() => {
          category.name = categoryName;
        });
        router.back();
        return;
      }
    });

    setCategoryName('');
    Toast.show({
      type: 'success',
      text1: !!editCategoryId ? t('category_updated') : t('category_created'),
      visibilityTime: 1500,
    });
    endAnimation();
  };
  return (
    <View backgroundColor='$secondary' padding={20} borderRadius={10} gap={8}>
      <View justifyContent='center' alignItems='center'>
        <Text fontSize={18} fontWeight='bold' color='$text'>
          {editCategoryId ? t('edit_category') : t('add_or_edit_category')}
        </Text>
      </View>
      <InputWrapper
        label={editCategoryId ? t('category_name') : t('new_category_name')}
      >
        <View flexDirection='row' justifyContent='space-between'>
          <Input
            size='$3'
            placeholder={t('category_name')}
            onChangeText={setCategoryName}
            value={categoryName}
            backgroundColor='$white'
            width='80%'
            borderRadius={6}
            paddingLeft={6}
            autoCorrect={false}
          />
          <View width='18%'>
            <SaveButton
              update={!!editCategoryId}
              onPress={createOrEditCategory}
              disabled={!categoryName}
            />
          </View>
        </View>
      </InputWrapper>

      {!editCategoryId && <EditCategorySelector />}
    </View>
  );
};

export default CreateCategory;
