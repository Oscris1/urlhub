import React from 'react';
import { Image } from 'tamagui';
import { useGlobalStore } from '@/stores/globalStore';

interface LogoProps {
  height?: number;
  width?: number;
}

const Logo: React.FC<LogoProps> = ({ height = 65, width = 100 }) => {
  const visibleTheme = useGlobalStore((state) => state.visibleTheme);
  if (visibleTheme === 'light')
    return (
      <Image
        w={width}
        h={height}
        resizeMode='center'
        source={require(`../../../assets/images/logoWhite.png`)}
      />
    );
  return (
    <Image
      w={width}
      h={height}
      resizeMode='center'
      source={require(`../../../assets/images/logoBlack.png`)}
    />
  );
};

export default Logo;
