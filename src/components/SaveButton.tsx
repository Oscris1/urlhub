import React, { ReactNode, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '@/constants/colors';
import { ViewProps, View, Spinner } from 'tamagui';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface SaveButtonButtonProps {
  onPress: (animation: () => void, endAnimation: () => void) => Promise<void>;
  icon: ReactNode;
  disabled?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(
  React.forwardRef<typeof View, ViewProps>((props, ref) => {
    // @ts-ignore -- ref error
    return <View ref={ref} {...props} />;
  })
);

const SaveButton: React.FC<SaveButtonButtonProps> = ({
  onPress,
  icon,
  disabled,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const progress = useSharedValue(0);
  const isActive = useSharedValue(false);
  const startLoading = () => {
    setIsLoading(true);
    progress.value = withTiming(1, {
      duration: 500,
      easing: Easing.linear,
    });
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const handleOnPress = () => onPress(startLoading, stopLoading);

  const gesture = Gesture.Tap()
    .enabled(!disabled)
    .maxDuration(10000)
    .onTouchesDown(() => {
      isActive.value = true;
    })
    .onTouchesUp(() => {
      // fire onPress
      if (!!onPress) runOnJS(handleOnPress)();
    })
    .onFinalize(() => {
      // onFinalize
      isActive.value = false;
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isActive.value ? 0.5 : 1, {
        duration: 100,
      }),
      transform: [
        {
          rotate: withSpring(isActive.value ? `${-(Math.PI / 60)}rad` : '0rad'),
        },
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
          <Animated.View style={rIconStyle}>{icon}</Animated.View>
        )}
      </AnimatedView>
    </GestureDetector>
  );
};

export default SaveButton;
