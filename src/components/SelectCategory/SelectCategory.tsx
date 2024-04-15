import { ActivityIndicator, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Adapt, Select, Sheet, useTheme } from 'tamagui';
import type { SelectProps, SizeTokens } from 'tamagui';
import { useDatabase } from '@nozbe/watermelondb/react';
import { Entypo } from '@expo/vector-icons';
import { EnchancetCategoryList } from './CategoryList';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const database = useDatabase();
  const [data, setData] = useState<{ id: string; name: string }[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const theme = useTheme();
  const primaryColor = theme.primary.val;

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
      defaultValue={t('select')}
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
        backgroundColor='$white'
        borderColor='$black'
        borderWidth={1}
        iconAfter={
          !categoryName && selectedCategory ? (
            <ActivityIndicator color={primaryColor} />
          ) : (
            <Entypo name='chevron-down' size={24} color={primaryColor} />
          )
        }
      >
        <Select.Value
          maxWidth='90%'
          color='$black'
          placeholder={t('select_category')}
        >
          {!!categoryName
            ? categoryName
            : !selectedCategory
            ? t('select_category')
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
          <Sheet.Frame backgroundColor='$bg'>
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
            <Select.Label backgroundColor='$secondary' color='$text'>
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
