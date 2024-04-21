import React from 'react';
import { AnimatedView } from '../AnimatedComponents';
import Logo from '../Logo';
import {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import HeaderGradient from './HeaderGradient';

const HEADER_HIGHT = 250;
const HEADER_DECREACE_HIGHT_VALUE = 80;
const FINAL_HEADER_HIGHT = HEADER_HIGHT - HEADER_DECREACE_HIGHT_VALUE;

interface AnimatedHeaderProps {
  yPosition?: SharedValue<number>;
  safePaddingBottom: number;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  yPosition,
  safePaddingBottom,
}) => {
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
      <HeaderGradient safePaddingBottom={safePaddingBottom}>
        <AnimatedView style={rIconStyle}>
          <Logo />
        </AnimatedView>
      </HeaderGradient>
    </AnimatedView>
  );
};

export default AnimatedHeader;
