import { Pressable } from 'react-native';
import React, { useState } from 'react';
import { View, useTheme, XStack } from 'tamagui';
import { SelectCategory } from '@/components/SelectCategory';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Entypo } from '@expo/vector-icons';
import { InputWrapper } from '../common';

const EditCategorySelector = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View borderRadius={10} gap={5}>
      <InputWrapper label={t('category_to_edit')}>
        <XStack justifyContent='space-between'>
          <SelectCategory
            add
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            size='$3'
            borderRadius={6}
            width='80%'
          />
          <Pressable
            disabled={!selectedCategory}
            style={{
              width: '18%',
              backgroundColor: selectedCategory
                ? theme.primary.val
                : theme.disabled.val,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 6,
            }}
            onPress={() =>
              router.push(
                // @ts-ignore broken types
                `/createEdit?editCategoryId=${selectedCategory}`
              )
            }
          >
            <Entypo
              name='edit'
              size={20}
              color={
                !!selectedCategory ? theme.white.val : theme.disabledText.val
              }
            />
          </Pressable>
        </XStack>
      </InputWrapper>
    </View>
  );
};

export default EditCategorySelector;
