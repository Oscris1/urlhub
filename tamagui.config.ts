import { config as configBase, tokens as tokensBase } from '@tamagui/config/v3';
import { createTamagui, createTokens } from 'tamagui';

const tokens = createTokens({
  ...tokensBase,
  color: {
    white: 'rgb(255,255,255)',
    black: 'rgb(0,0,0)',
  },
});

export const config = createTamagui({
  ...configBase,
  tokens: tokens,

  themes: {
    dark: {
      background: 'rgba(48, 32, 48, 0.5)',
      bg: tokens.color.black,
      primary: 'rgba(141, 162, 238, 1)',
      secondary: 'rgb(28, 32, 47)', // 'rgba(141, 162, 238, 0.2)', on black background
      text: tokens.color.white,
      textContrast: tokens.color.black,
      black: tokens.color.black,
      white: tokens.color.white,
      danger: '#FF6868', //'#F28585',
      dangerStrong: '#FF204E', //'#FF6868',
      gradientAdditional: '#8A88FB', // #4B73FF '#DDE4FF'
      successToast: 'rgba(141, 162, 238, 0.8)',
      errorToast: 'rgba(255, 104, 104, 0.8)',
      disabled: '#B5C0D0',
      disabledText: '#CCD3CA',
    },
    light: {
      background: 'rgba(7, 15, 43, 0.5)',
      bg: '#F0F3FF',
      primary: 'rgba(40, 2, 116, 1)', //'#3793FF', '#78A083' #280274, 'rgba(40, 2, 116, 0.1)', '#F0F3FF'
      secondary: 'rgba(40, 2, 116, 0.1)',
      text: tokens.color.black,
      textContrast: tokens.color.white,
      black: tokens.color.black,
      white: tokens.color.white,
      danger: '#F67280',
      dangerStrong: '#DB3951',
      gradientAdditional: '#3652AD',
      successToast: 'rgba(40, 2, 116, 0.7)',
      errorToast: 'rgba(255, 104, 104, 0.7)',
      disabled: '#B5C0D0',
      disabledText: '#CCD3CA',
    },
  },
});

// '#6C5B7B'fajny kolor

export default config;

export type Conf = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
