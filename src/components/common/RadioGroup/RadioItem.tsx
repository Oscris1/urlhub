import React from 'react';
import { Text, XStack, Spacer, useTheme } from 'tamagui';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ActivityIndicator } from 'react-native';
import { useGlobalStore } from '@/stores/globalStore';
import { AnimatedView } from '../AnimatedComponents';
import { RadioOuter } from '../StyledComponents';
import { RadioItemProps } from './types';

export const RadioItem: React.FC<RadioItemProps> = ({
  item,
  sharedSelectedItem,
}) => {
  const fillingSize = useSharedValue(16);
  const theme = useTheme();
  const visibleTheme = useGlobalStore((state) => state.visibleTheme);

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
      <XStack px={20} py={3} alignItems='center'>
        <RadioOuter>
          <AnimatedView style={animatedStyle(item.id)} />
        </RadioOuter>
        <Text fontSize={13} color='$text'>
          {item.displayName}
        </Text>
        <Spacer />
      </XStack>
    </GestureDetector>
  );
};

export const RadioItemDisabled: React.FC<RadioItemProps> = ({
  item,
  sharedSelectedItem,
}) => {
  const theme = useTheme();
  return (
    <XStack px={20} py={3} alignItems='center'>
      <RadioOuter>
        {item.id === sharedSelectedItem.value && (
          <ActivityIndicator color={theme.primary.val} size='small' />
        )}
      </RadioOuter>
      <Text fontSize={13} color='$text'>
        {item.displayName}
      </Text>
      <Spacer />
    </XStack>
  );
};
