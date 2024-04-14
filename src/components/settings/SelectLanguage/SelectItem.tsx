import React from 'react';
import { Text, XStack, Spacer, useTheme } from 'tamagui';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ActivityIndicator } from 'react-native';
import { AnimatedView, RadioOuter } from '@/components/common';
import { useThemeStore } from '@/stores/themeStore';

interface ItemSelectItemProps {
  item: {
    id: string;
    displayName: string;
  };
  sharedSelectedItem: SharedValue<string>;
}

export const SelectItem: React.FC<ItemSelectItemProps> = ({
  item,
  sharedSelectedItem,
}) => {
  const fillingSize = useSharedValue(16);
  const theme = useTheme();
  const visibleTheme = useThemeStore((state) => state.visibleTheme);

  const animatedStyle = (id: string) =>
    useAnimatedStyle(() => {
      return {
        width: id === sharedSelectedItem.value ? fillingSize.value : 0,
        height: id === sharedSelectedItem.value ? fillingSize.value : 0,
        borderRadius: fillingSize.value / 2,
        backgroundColor: theme.primary.val,
      };
    }, [fillingSize, visibleTheme]);

  const tap = (id: string) =>
    Gesture.Tap()
      .onBegin(() => {})
      .onStart((event) => {
        sharedSelectedItem.value = id;
        fillingSize.value = withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(16, { duration: 1500, easing: Easing.bounce })
        );
      });

  return (
    <GestureDetector gesture={tap(item.id)}>
      <XStack paddingVertical={4}>
        <RadioOuter>
          <AnimatedView style={animatedStyle(item.id)} />
        </RadioOuter>
        <Text color='$text'>{item.displayName}</Text>
        <Spacer />
      </XStack>
    </GestureDetector>
  );
};

export const SelectItemDisabled: React.FC<ItemSelectItemProps> = ({
  item,
  sharedSelectedItem,
}) => {
  const theme = useTheme();
  return (
    <XStack paddingVertical={4}>
      <RadioOuter>
        {item.id === sharedSelectedItem.value && (
          <ActivityIndicator color={theme.primary.val} size='small' />
        )}
      </RadioOuter>
      <Text color='$text'>{item.displayName}</Text>
      <Spacer />
    </XStack>
  );
};