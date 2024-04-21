import React from 'react';
import { View } from 'tamagui';
import Logo from '../Logo';
import HeaderGradient from './HeaderGradient';

interface AnimatedHeaderProps {
  safePaddingBottom: number;
  height?: number;
}

export const StaticHeader: React.FC<AnimatedHeaderProps> = ({
  safePaddingBottom,
  height = 100,
}) => {
  const logoHeight = height * 0.45;
  const logoWidth = height * 0.65;
  return (
    <View height={height}>
      <HeaderGradient safePaddingBottom={safePaddingBottom}>
        <Logo width={logoWidth} height={logoHeight} />
      </HeaderGradient>
    </View>
  );
};

export default StaticHeader;
