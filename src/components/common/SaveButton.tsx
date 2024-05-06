import React, { useState } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { Spinner, useTheme } from 'tamagui';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { AnimatedView } from './AnimatedComponents';
import { MaterialIcons } from '@expo/vector-icons';

interface SaveButtonButtonProps {
  onPress: (animation: () => void, endAnimation: () => void) => Promise<void>;
  update?: boolean;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonButtonProps> = ({
  onPress,
  disabled,
  update = false,
}) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const isActive = useSharedValue(false);
  const animation = useSharedValue(0);
  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const handleOnPress = () => onPress(startLoading, stopLoading);

  const gesture = Gesture.Tap()
    .enabled(!(disabled || isLoading))
    .maxDuration(10000)
    .onTouchesDown(() => {
      isActive.value = true;
      animation.value = withTiming(1, { duration: 500 });
    })
    .onTouchesUp(() => {
      // fire onPress
      if (!!onPress) runOnJS(handleOnPress)();
    })
    .onFinalize(() => {
      // onFinalize
      isActive.value = false;
      animation.value = withTiming(0, { duration: 1000 });
    });

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
      borderWidth: animation.value,
      borderColor,
      backgroundColor: !disabled ? backgroundColor : theme.disabled.val,
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

  const rIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withSpring(isActive.value ? `${Math.PI / 4}rad` : '0rad'),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <AnimatedView
        width='100%'
        justifyContent='center'
        alignItems='center'
        borderRadius={6}
        style={rStyle}
        height={36}
      >
        {!!isLoading ? (
          <Spinner size='small' color={theme.textContrast.val} />
        ) : (
          <AnimatedView style={rIconStyle}>
            <MaterialIcons
              name={update ? 'update' : 'add'}
              size={30}
              color={disabled ? theme.disabledText.val : theme.white.val}
            />
          </AnimatedView>
        )}
      </AnimatedView>
    </GestureDetector>
  );
};

export default SaveButton;
