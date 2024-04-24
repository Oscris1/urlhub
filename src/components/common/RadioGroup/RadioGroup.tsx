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
    <View backgroundColor='$secondary' py={12} borderRadius={10} gap={10}>
      <Text px={20} fontWeight='bold' fontSize={14} color='$text'>
        {title}
      </Text>
      <YStack>
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
      </YStack>
      <View px={20}>
        <PressableButton isLoading={isLoading} onPress={onSave} />
      </View>
    </View>
  );
};
