import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from '@tamagui/linear-gradient';
import { AnimatedView } from './AnimatedComponents';
import Logo from './Logo';
import {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

const HEADER_HIGHT = 250;
const HEADER_DECREACE_HIGHT_VALUE = 80;
const FINAL_HEADER_HIGHT = HEADER_HIGHT - HEADER_DECREACE_HIGHT_VALUE;

interface AnimatedHeaderProps {
  yPosition?: SharedValue<number>;
  savePaddingBottom: number;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  yPosition,
  savePaddingBottom,
}) => {
  const insets = useSafeAreaInsets();

  const rIconStyle = useAnimatedStyle(() => {
    if (!yPosition)
      return {
        transform: [
          {
            scale: 1,
          },
        ],
      };
    const value = interpolate(
      yPosition.value,
      [0, 500],
      [2, 1],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        {
          scale: value,
        },
      ],
    };
  });

  const rGradientStyle = useAnimatedStyle(() => {
    if (!yPosition)
      return {
        height: FINAL_HEADER_HIGHT,
      };
    const value = interpolate(
      yPosition.value,
      [0, 500],
      [HEADER_HIGHT, FINAL_HEADER_HIGHT],
      Extrapolation.CLAMP
    );
    return {
      height: value,
    };
  });

  return (
    <AnimatedView style={rGradientStyle}>
      <LinearGradient
        colors={['$gradientAdditional', '$primary']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        width='100%'
        h='100%'
        paddingTop={insets.top}
        alignItems='center'
        justifyContent='center'
        paddingBottom={savePaddingBottom}
      >
        <AnimatedView style={rIconStyle}>
          <Logo />
        </AnimatedView>
      </LinearGradient>
    </AnimatedView>
  );
};

export default AnimatedHeader;
