import React from 'react';
import { View } from 'tamagui';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import { useDatabase } from '@nozbe/watermelondb/react';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

interface SwapToRemoveProps {
  id: string;
}

const SwapToRemove: React.FC<SwapToRemoveProps> = ({ id }) => {
  const database = useDatabase();
  const scrollX = useSharedValue(0);
  const release = useSharedValue(false);
  const text = useSharedValue('> Przesuń, aby usunąć');

  const handleRemove = async () => {
    await database.write(async () => {
      const link = await database.get('links').find(id);
      await link.destroyPermanently();
      Toast.show({
        type: 'success',
        text1: 'Usunięto',
        text2: `Link został ${!!id ? 'zaktualizowany' : 'dodany'}`,
        visibilityTime: 1500,
      });
      router.back();
    });
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      release.value = false;
      scrollX.value = 0;
    })
    .onChange((event) => {
      scrollX.value = clamp(scrollX.value + event.changeX, -150, 150);
      if (scrollX.value >= 130) {
        text.value = 'Puść, aby usunąć';

        release.value = true;
      } else if (scrollX.value < 130 && !!release.value) {
        text.value = '> Przesuń, aby usunąć';
        release.value = false;
      } else {
      }
    })
    .onEnd(() => {
      if (scrollX.value > 130) {
        console.log('usuwanie');
        runOnJS(handleRemove)();
      } else {
        scrollX.value = withSpring(0);
        release.value = false;
        text.value = '> Przesuń, aby usunąć';
      }
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: !release.value ? '#F28585' : '#FF6868',
      transform: [{ translateX: !!release.value ? 0 : scrollX.value }],
    };
  });
  return (
    <View alignItems='center' marginBottom={20}>
      <View
        // bg='#F2613F'
        bg='#F28585'
        width='90%'
        height={40}
        marginTop={10}
        justifyContent='center'
        overflow='hidden'
        borderRadius={10}
      >
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.swiper, animatedStyles]}>
            <Animated.View pointerEvents='none'>
              <ReText text={text} style={styles.text} />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

export default SwapToRemove;

const styles = StyleSheet.create({
  swiper: {
    width: '100%',
    height: 40,
    backgroundColor: '#F2613F',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: { color: 'white', fontSize: 16, fontWeight: '500' },
});
