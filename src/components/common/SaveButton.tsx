import React, { ReactNode, useState } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { colors } from '@/constants/colors';
import { Spinner } from 'tamagui';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { AnimatedView } from './AnimatedComponents';

interface SaveButtonButtonProps {
  onPress: (animation: () => void, endAnimation: () => void) => Promise<void>;
  icon: ReactNode;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonButtonProps> = ({
  onPress,
  icon,
  disabled,
}) => {
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

  const rIconStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isActive.value ? 0.5 : 1, {
        duration: 100,
      }),
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
        backgroundColor={colors[1][0]}
        justifyContent='center'
        alignItems='center'
        borderRadius={6}
        style={rStyle}
        height={36}
      >
        {!!isLoading ? (
          <Spinner size='small' color='white' />
        ) : (
          <AnimatedView style={rIconStyle}>{icon}</AnimatedView>
        )}
      </AnimatedView>
    </GestureDetector>
  );
};

export default SaveButton;
