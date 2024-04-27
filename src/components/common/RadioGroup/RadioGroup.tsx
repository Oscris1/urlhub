import React from 'react';
import { View, Text, YStack } from 'tamagui';
import { RadioItem } from './RadioItem';
import { RadioGroupProps } from './types';

export const RadioGroup: React.FC<RadioGroupProps> = ({
  title,
  options,
  sharedLoading,
  sharedSelectedItem,
  onSave,
}) => {
  return (
    <View backgroundColor='$secondary' py={12} borderRadius={10} gap={10}>
      <Text px={20} fontWeight='bold' fontSize={14} color='$text'>
        {title}
      </Text>
      <YStack>
        {options.map((option) => (
          <View key={option.id}>
            <RadioItem
              item={option}
              sharedSelectedItem={sharedSelectedItem}
              onSave={onSave}
              sharedLoading={sharedLoading}
            />
          </View>
        ))}
      </YStack>
    </View>
  );
};
