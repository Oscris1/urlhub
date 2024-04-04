import { Keyboard } from 'react-native';
import React, { useState, useMemo } from 'react';

import Category from '@/model/category';
import { colors } from '@/constants/colors';

import { Text, Adapt, Select, Sheet, View } from 'tamagui';
import type { SelectProps } from 'tamagui';
import { withObservables } from '@nozbe/watermelondb/react';
import { Database } from '@nozbe/watermelondb';

interface ObservableProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  add?: boolean;
}

interface CategoriesListProps {
  database: Database;
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  add?: boolean;
}

const SelectCategory = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  add,
  ...props
}: SelectProps & ObservableProps) => {
  const [isOpen, setIsOpen] = useState(false);

  let data: { id: string; name: string }[];
  if (add) {
    data = categories;
  } else {
    data = [
      { id: 'all', name: 'Wszystkie' },
      { id: 'none', name: 'Nieprzypisane' },
      ...categories,
    ];
  }

  return (
    <Select
      value={selectedCategory}
      onValueChange={setSelectedCategory}
      disablePreventBodyScroll
      {...props}
      open={isOpen}
      onOpenChange={(item) => {
        Keyboard.dismiss();
        setIsOpen(item);
      }}
    >
      <Select.Trigger
        flex={1}
        size={'$4'}
        borderRadius={6}
        borderWidth={2}
        borderColor={'#5D85A6'}
      >
        <Select.Value placeholder='Wybierz kategorie' />
      </Select.Trigger>

      <Adapt when='sm' platform='native'>
        <Sheet
          native={!!props.native}
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 18,
            mass: 1.2,
            stiffness: 150,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.Viewport minWidth={200}>
          <Select.Group>
            <Select.Label>Kategorie</Select.Label>
            {/* for longer lists memoizing these is useful */}
            {useMemo(
              () =>
                data.map((item, i) => {
                  return (
                    <Select.Item index={i} key={item.id} value={item.id}>
                      <Select.ItemText>{item.name}</Select.ItemText>
                      <Select.ItemIndicator marginLeft='auto'>
                        <Text>+</Text>
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                }),
              [data]
            )}
          </Select.Group>
          {/* Native gets an extra icon */}
        </Select.Viewport>
      </Select.Content>
    </Select>
  );
};

const enhance = withObservables<CategoriesListProps, ObservableProps>(
  ['database'],
  ({ database }) => ({
    // @ts-ignore
    // fix types later
    categories: database.collections
      .get<Category>('categories')
      .query()
      .observe(),
  })
);

export const SelectCategoryEnchanted: React.FC<CategoriesListProps> =
  enhance(SelectCategory);
