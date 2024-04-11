import React from 'react';
import { View } from 'tamagui';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
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
import { useTranslation } from 'react-i18next';
import { AnimatedView } from '@/components/common';

interface SwapToRemoveProps {
  id: string;
}

const SwapToRemove: React.FC<SwapToRemoveProps> = ({ id }) => {
  const { t } = useTranslation();
  const database = useDatabase();
  const scrollX = useSharedValue(0);
  const release = useSharedValue(false);
  const slide = t('slide_to_delete');
  const drop = t('drop_to_delete');
  const text = useSharedValue(slide);

  const handleRemove = async () => {
    await database.write(async () => {
      const link = await database.get('links').find(id);
      await link.destroyPermanently();
      Toast.show({
        type: 'success',
        text1: t('deleted'),
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
        text.value = drop;

        release.value = true;
      } else if (scrollX.value < 130 && !!release.value) {
        text.value = slide;
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
        text.value = slide;
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
        bg='#F28585'
        width='90%'
        height={40}
        marginTop={10}
        justifyContent='center'
        overflow='hidden'
        borderRadius={10}
      >
        <GestureDetector gesture={pan}>
          <AnimatedView style={[styles.swiper, animatedStyles]}>
            <AnimatedView pointerEvents='none'>
              <ReText text={text} style={styles.text} />
            </AnimatedView>
          </AnimatedView>
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
