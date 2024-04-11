import React from 'react';
import { Text } from 'tamagui';
import { useTranslation } from 'react-i18next';
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';

import { AnimatedView } from './AnimatedComponents';

interface PressableButtonProps {
  onPress: () => void;
  isLoading: boolean;
}

const PressableButton: React.FC<PressableButtonProps> = ({
  isLoading,
  onPress,
}) => {
  const { t } = useTranslation();

  const isActive = useSharedValue(false);
  const animation = useSharedValue(0);

  const rStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animation.value,
      [0, 1],
      ['rgba(141, 162, 238, 1)', 'rgba(141, 162, 238, 0.3)']
    );
    const borderColor = interpolateColor(
      animation.value,
      [0, 1],
      ['transparent', 'white']
    );
    return {
      borderWidth: animation.value,
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

  return (
    <Pressable
      disabled={isLoading}
      onPress={onPress}
      onPressIn={() => {
        animation.value = withTiming(1, { duration: 500 });
        isActive.value = true;
      }}
      onPressOut={() => {
        animation.value = withTiming(0, { duration: 1000 });

        isActive.value = false;
      }}
    >
      <AnimatedView
        marginTop={10}
        borderRadius={10}
        padding={4}
        justifyContent='center'
        alignItems='center'
        style={rStyle}
      >
        <Text color={'white'}>{t(isLoading ? 'saving' : 'save')}</Text>
      </AnimatedView>
    </Pressable>
  );
};

export default PressableButton;
