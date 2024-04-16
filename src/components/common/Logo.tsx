import React from 'react';
import { Image } from 'tamagui';
import { useThemeStore } from '@/stores/themeStore';

const Logo = () => {
  const visibleTheme = useThemeStore((state) => state.visibleTheme);
  if (visibleTheme === 'light')
    return (
      <Image
        w={100}
        h={65}
        resizeMode='center'
        source={require(`../../../assets/images/logoWhite.png`)}
      />
    );
  return (
    <Image
      w={100}
      h={65}
      resizeMode='center'
      source={require(`../../../assets/images/logoBlack.png`)}
    />
  );
};

export default Logo;
