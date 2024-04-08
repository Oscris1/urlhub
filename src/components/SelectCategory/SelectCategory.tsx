import { ActivityIndicator, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Adapt, Select, Sheet } from 'tamagui';
import type { SelectProps, SizeTokens } from 'tamagui';
import { useDatabase } from '@nozbe/watermelondb/react';
import { Entypo } from '@expo/vector-icons';
import { EnchancetCategoryList } from './CategoryList';

interface CategoriesListProps {
  selectedCategory?: string;
  setSelectedCategory: (id: string) => void;
  add?: boolean;
  size?: SizeTokens | undefined;
  borderRadius?: number;
}

export const SelectCategory = ({
  selectedCategory,
  setSelectedCategory,
  add,
  size,
  borderRadius,
  ...props
}: SelectProps & CategoriesListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const database = useDatabase();
  const [data, setData] = useState<{ id: string; name: string }[]>([]);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (selectedCategory && data) {
      const preparedValue = data.find(({ id }) => id === selectedCategory);
      if (preparedValue) {
        setCategoryName(preparedValue.name);
      }
    }
  }, [selectedCategory, data]);

  return (
    <Select
      value={selectedCategory}
      onValueChange={setSelectedCategory}
      defaultValue='Wybierz'
      disablePreventBodyScroll
      open={isOpen}
      onOpenChange={(item) => {
        Keyboard.dismiss();
        setIsOpen(item);
      }}
      {...props}
    >
      <Select.Trigger
        flex={1}
        size={!!size ? size : '$4'}
        borderRadius={!!borderRadius ? borderRadius : 15}
        backgroundColor='white'
        borderColor='#8DA2EE'
        borderWidth={0.5}
        iconAfter={
          !categoryName && selectedCategory ? (
            <ActivityIndicator color='#8DA2EE' />
          ) : (
            <Entypo name='chevron-down' size={24} color='#8DA2EE' />
          )
        }
      >
        <Select.Value color='#20262E' placeholder='Wybierz kategorie'>
          {!!categoryName
            ? categoryName
            : !selectedCategory
            ? 'Wybierz kategorie'
            : ''}
        </Select.Value>
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
          <Sheet.Frame backgroundColor='black'>
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
            <Select.Label
              backgroundColor='rgba(141, 162, 238, 0.2)'
              color='white'
            >
              Kategorie
            </Select.Label>
            {/* for longer lists memoizing these is useful */}
            <EnchancetCategoryList
              database={database}
              add={add}
              setData={setData}
            />
          </Select.Group>
          {/* Native gets an extra icon */}
        </Select.Viewport>
      </Select.Content>
    </Select>
  );
};
