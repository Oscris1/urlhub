import React, { ReactNode, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { colors } from '@/constants/colors';
import { LinearGradient } from '@tamagui/linear-gradient';
import { ViewProps, View, Spinner } from 'tamagui';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface ReusableGradientButtonProps {
  onPress: (animation: () => void, endAnimation: () => void) => Promise<void>;
  icon: ReactNode;
  disabled?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(
  React.forwardRef<typeof View, ViewProps>((props, ref) => {
    return <View ref={ref} {...props} />;
  })
);

const GradientButton: React.FC<ReusableGradientButtonProps> = ({
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
    progress.value = withSequence(
      withTiming(1, { duration: 300, easing: Easing.linear }),
      withTiming(0, {
        duration: 300,
        easing: Easing.linear,
      })
    );
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

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const rStyle = useAnimatedStyle(() => {
    return {
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
        <AnimatedView
          width='100%'
          height='100%'
          bg='#ddd'
          overflow='hidden'
          borderRadius={10}
          position='absolute'
          left={0}
          top={0}
          zIndex={0}
          style={animatedStyle}
        >
          <LinearGradient
            colors={[colors[1][1], colors[1][0]]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            width='100%'
            height='100%'
            alignItems='center'
            justifyContent='center'
            borderRadius={10}
          />
        </AnimatedView>

        {!!isLoading ? <Spinner size='small' color='white' /> : icon}
      </AnimatedView>
    </GestureDetector>
  );
};

export default GradientButton;
