import React, { useEffect, useMemo } from 'react';
import Category from '@/model/category';
import { Select, View, useTheme } from 'tamagui';
import { withObservables } from '@nozbe/watermelondb/react';
import { Database } from '@nozbe/watermelondb';
import { Entypo } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface CategoryListProps {
  categories: Category[];
  add?: boolean;
  setData: (data: { id: string; name: string }[]) => void;
}

interface EnchanceCategoryListProps {
  database: Database;
  add?: boolean;
  setData: (data: { id: string; name: string }[]) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  add,
  setData,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  let data: { id: string; name: string }[];
  if (add) {
    data = categories;
  } else {
    data = [
      { id: 'all', name: t('all') },
      { id: 'none', name: t('unassigned') },
      ...categories,
    ];
  }

  useEffect(() => {
    setData(data);
  }, [t('all'), t('unassigned')]);

  return (
    <View onLayout={() => setData(data)}>
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
                <Select.ItemText color='$primary'>{item.name}</Select.ItemText>
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
  ['database'],
  ({ database }) => ({
    // @ts-ignore
    categories: database.collections
      .get<Category>('categories')
      .query()
      .observe(),
  })
);

export const EnchancetCategoryList: React.FC<EnchanceCategoryListProps> =
  enhance(CategoryList);
