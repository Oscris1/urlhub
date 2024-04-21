import React from 'react';
import { View, Text, YStack } from 'tamagui';
import PressableButton from '../PressableButton';
import { RadioItem, RadioItemDisabled } from './RadioItem';
import { RadioGroupProps } from './types';

export const RadioGroup: React.FC<RadioGroupProps> = ({
  title,
  options,
  isLoading,
  sharedSelectedItem,
  onSave,
}) => {
  return (
    <View backgroundColor='$secondary' px={20} py={12} borderRadius={10}>
      <Text color='$text'>{title}</Text>
      <YStack pt={6}>
        {options.map((option) => (
          <View key={option.id}>
            {!isLoading ? (
              <RadioItem
                item={option}
                sharedSelectedItem={sharedSelectedItem}
              />
            ) : (
              <RadioItemDisabled
                item={option}
                sharedSelectedItem={sharedSelectedItem}
              />
            )}
          </View>
        ))}
        <PressableButton isLoading={isLoading} onPress={onSave} />
      </YStack>
    </View>
  );
};
