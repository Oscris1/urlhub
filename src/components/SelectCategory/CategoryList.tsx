import React, { useEffect, useMemo } from 'react';
import Category from '@/model/category';
import { Select, View, useTheme } from 'tamagui';
import { withObservables } from '@nozbe/watermelondb/react';
import { Entypo } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { categoriesCollection } from '@/model';
import { Q } from '@nozbe/watermelondb';

interface CategoryListProps {
  categories: Category[];
  add?: boolean;
}

interface EnchanceCategoryListProps {
  add?: boolean;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, add }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const data = !add
    ? [
        { id: 'all', name: t('all') },
        { id: 'none', name: t('unassigned') },
        ...categories,
      ]
    : categories;

  return (
    <View>
      {useMemo(
        () =>
          data.map((item, i) => {
            return (
              <Select.Item
                backgroundColor='$bg'
                index={i}
                key={item.id}
                value={item.id}
                borderBlockColor='$primary'
                borderBottomWidth={0.2}
              >
                <Select.ItemText maxWidth='90%' color='$primary'>
                  {item.name}
                </Select.ItemText>
                <Select.ItemIndicator marginLeft='auto'>
                  <Entypo name='check' size={24} color={theme.primary.val} />
                </Select.ItemIndicator>
              </Select.Item>
            );
          }),
        [data]
      )}
    </View>
  );
};

const enhance = withObservables<EnchanceCategoryListProps, CategoryListProps>(
  [],
  () => ({
    // @ts-ignore
    categories: categoriesCollection
      .query(Q.sortBy('created_at', Q.desc))
      .observeWithColumns(['name']),
  })
);

export const EnhancedCategoryList: React.FC<EnchanceCategoryListProps> =
  enhance(CategoryList);
