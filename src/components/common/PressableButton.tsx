import React from 'react';
import { Text, useTheme } from 'tamagui';
import { useTranslation } from 'react-i18next';
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';

import { AnimatedText, AnimatedView } from './AnimatedComponents';

interface PressableButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  buttonTextReplacment?: string;
}

const PressableButton: React.FC<PressableButtonProps> = ({
  isLoading = false,
  onPress,
  buttonTextReplacment,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isActive = useSharedValue(false);
  const animation = useSharedValue(0);

  const rStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animation.value,
      [0, 1],
      [theme.primary.val, theme.secondary.val]
    );
    const borderColor = interpolateColor(
      animation.value,
      [0, 1],
      ['transparent', theme.text.val]
    );
    return {
      borderWidth: 1,
      borderColor,
      backgroundColor,
      opacity: withTiming(isActive.value ? 0.5 : 1, {
        duration: 100,
      }),
      transform: [
        {
          scale: withSpring(isActive.value ? 0.9 : 1),
        },
      ],
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      animation.value,
      [0, 1],
      [theme.white.val, theme.text.val]
    );

    return {
      color,
    };
  });

  return (
    <Pressable
      disabled={isLoading}
      onPress={onPress}
      onPressIn={() => {
        animation.value = withSequence(withTiming(1, { duration: 500 }));
        isActive.value = true;
      }}
      onPressOut={() => {
        animation.value = withTiming(0, { duration: 100 });

        isActive.value = false;
      }}
    >
      <AnimatedView
        borderRadius={10}
        padding={4}
        px={12}
        justifyContent='center'
        alignItems='center'
        style={rStyle}
      >
        <AnimatedText style={rTextStyle}>
          {!buttonTextReplacment && t(isLoading ? 'saving' : 'save')}
          {!!buttonTextReplacment && buttonTextReplacment}
        </AnimatedText>
      </AnimatedView>
    </Pressable>
  );
};

export default PressableButton;
