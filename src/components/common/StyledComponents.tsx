import { View, styled, GetProps } from '@tamagui/core';

export const RadioOuter = styled(View, {
  name: 'RadioOuter',
  width: 20,
  height: 20,
  borderRadius: 10,
  borderWidth: 0.5,
  borderColor: '$primary',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 6,
});

export type RadioOuterProps = GetProps<typeof RadioOuter>;
