import React, { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from '@tamagui/linear-gradient';

type HeaderGradientProps = {
  children: ReactNode;
  safePaddingBottom: number;
};

const HeaderGradient: React.FC<HeaderGradientProps> = ({
  children,
  safePaddingBottom,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={['$gradientAdditional', '$primary']}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      width='100%'
      h='100%'
      paddingTop={insets.top}
      alignItems='center'
      justifyContent='center'
      paddingBottom={safePaddingBottom}
    >
      {children}
    </LinearGradient>
  );
};

export default HeaderGradient;
