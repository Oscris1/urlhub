import React from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  interpolateColor,
  interpolate,
  Easing,
  withSequence,
} from 'react-native-reanimated';
import { View } from 'tamagui';
import { AnimatedText } from './AnimatedComponents';

interface ShimmerTextEffectProps {
  text: string;
  startColor: string;
  endColor: string;
  delay: number;
  isInfinity?: boolean;
}

const ShimmerTextEffect: React.FC<ShimmerTextEffectProps> = ({
  text,
  startColor,
  endColor,
  delay,
  isInfinity = true,
}) => {
  const progress = useSharedValue(0);
  const letters = text.split('');
  // Dostosowanie czasu trwania do długości tekstu
  const animationDuration = letters.length * 250; // Bazowy czas na literę

  React.useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: animationDuration, easing: Easing.linear }),
        withTiming(0, { duration: 0 }),
        withDelay(delay, withTiming(0, { duration: 0 })) // Opóźnienie 3 sekundy między powtórzeniami
      ),
      isInfinity ? -1 : 1, // Nieskończone powtórzenia
      false // Nie odwracaj animacji
    );
  }, []);

  return (
    <View flexDirection='row' alignItems='center' justifyContent='center'>
      {letters.map((letter: string, index: number) => {
        const inputRange = [0, (index + 1) / letters.length, 1];
        const animatedStyles = useAnimatedStyle(() => {
          const opacity = interpolate(progress.value, inputRange, [1, 0.5, 1]);
          const color = interpolateColor(progress.value, inputRange, [
            startColor,
            endColor,
            startColor,
          ]);

          return { opacity, color: color };
        });

        return (
          <AnimatedText
            key={index}
            fontWeight='500'
            fontSize={22}
            color='$text'
            fontFamily='$silkscreen'
            style={animatedStyles}
          >
            {letter}
          </AnimatedText>
        );
      })}
    </View>
  );
};

export default ShimmerTextEffect;
