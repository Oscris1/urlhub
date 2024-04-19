import React, { useState } from 'react';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import Category from '@/model/category';
import { View, Text, Input } from 'tamagui';
import { SaveButton } from '@/components/common';
import { useTranslation } from 'react-i18next';

const CreateCategory = () => {
  const database = useDatabase();
  const [categoryName, setCategoryName] = useState<string>('');
  const { t } = useTranslation();

  const createNewCategory = async (
    animation: () => void,
    endAnimation: () => void
  ) => {
    if (!categoryName) return;

    animation();

    await database.write(async () => {
      await database.get<Category>('categories').create((category) => {
        category.name = categoryName;
      });
    });
    setCategoryName('');
    endAnimation();
  };
  return (
    <View backgroundColor='$secondary' padding={20} borderRadius={10}>
      <Text color='$text' paddingBottom={10}>
        {t('add_category')}
      </Text>
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
        />
        <View width='18%'>
          <SaveButton onPress={createNewCategory} disabled={!categoryName} />
        </View>
      </View>
    </View>
  );
};

export default CreateCategory;
