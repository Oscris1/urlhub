import React from 'react';
import { Image } from 'tamagui';
import { useGlobalStore } from '@/stores/globalStore';

const Logo = () => {
  const visibleTheme = useGlobalStore((state) => state.visibleTheme);
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
