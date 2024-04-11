import React from 'react';
import { Text, XStack, Spacer } from 'tamagui';
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

interface LanguageSelectItemProps {
  language: {
    id: string;
    displayName: string;
  };
  sharedSelectedLanguage: SharedValue<string>;
}

export const LanguageSelectItem: React.FC<LanguageSelectItemProps> = ({
  language,
  sharedSelectedLanguage,
}) => {
  const fillingSize = useSharedValue(16);

  const animatedStyle = (id: string) =>
    useAnimatedStyle(() => {
      return {
        width: id === sharedSelectedLanguage.value ? fillingSize.value : 0,
        height: id === sharedSelectedLanguage.value ? fillingSize.value : 0,
        borderRadius: fillingSize.value / 2,
        backgroundColor: '#8DA2EE',
      };
    }, [fillingSize]);

  const tap = (id: string) =>
    Gesture.Tap()
      .onBegin(() => {})
      .onStart((event) => {
        sharedSelectedLanguage.value = id;
        fillingSize.value = withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(16, { duration: 1500, easing: Easing.bounce })
        );
      });

  return (
    <GestureDetector gesture={tap(language.id)}>
      <XStack paddingVertical={4}>
        <RadioOuter>
          <AnimatedView style={animatedStyle(language.id)} />
        </RadioOuter>
        <Text color='white'>{language.displayName}</Text>
        <Spacer />
      </XStack>
    </GestureDetector>
  );
};

export const LanguageSelectItemDisabled: React.FC<LanguageSelectItemProps> = ({
  language,
  sharedSelectedLanguage,
}) => {
  return (
    <XStack paddingVertical={4}>
      <RadioOuter>
        {language.id === sharedSelectedLanguage.value && (
          <ActivityIndicator color='#8DA2EE' size='small' />
        )}
      </RadioOuter>
      <Text color='white'>{language.displayName}</Text>
      <Spacer />
    </XStack>
  );
};
