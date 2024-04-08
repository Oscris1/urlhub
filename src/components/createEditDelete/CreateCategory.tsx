import React, { useState } from 'react';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import Category from '@/model/category';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, Input, Separator } from 'tamagui';
import SaveButton from '@/components/SaveButton';

const CreateCategory = () => {
  const database = useDatabase();
  const [categoryName, setCategoryName] = useState<string>('');

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
    <View
      backgroundColor='rgba(141, 162, 238, 0.3)'
      padding={20}
      borderRadius={10}
    >
      <Text color='white' paddingBottom={10}>
        Dodaj kategorię
      </Text>
      <View flexDirection='row' justifyContent='space-between'>
        <Input
          size='$3'
          placeholder='Nazwa kategorii'
          onChangeText={setCategoryName}
          value={categoryName}
          backgroundColor='white'
          width='80%'
          borderRadius={6}
          borderWidth={2}
          borderColor={colors[1][0]}
          paddingLeft={3}
        />
        <View width='18%'>
          <SaveButton
            onPress={createNewCategory}
            icon={<MaterialIcons name='add' size={30} color='white' />}
            disabled={!categoryName}
          />
        </View>
      </View>
    </View>
  );
};

export default CreateCategory;
