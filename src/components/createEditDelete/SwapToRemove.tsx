import React from 'react';
import { View, useTheme } from 'tamagui';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AnimatedView } from '@/components/common';
import { Dimensions } from 'react-native';

interface SwapToRemoveProps {
  handleRemove: () => void;
}

const { width } = Dimensions.get('window');
const TRIGGER_DELETE_MOMENT = width * 0.2;
const SWIPABLE_CLAMP_LEFT_VALUE = -(width / 2);

const SwapToRemove: React.FC<SwapToRemoveProps> = ({ handleRemove }) => {
  const { t } = useTranslation();
  const scrollX = useSharedValue(0);
  const release = useSharedValue(false);
  const slide = t('slide_to_delete');
  const drop = t('drop_to_delete');
  const text = useSharedValue(slide);
  const theme = useTheme();

  const pan = Gesture.Pan()
    .onStart(() => {
      release.value = false;
      scrollX.value = 0;
    })
    .onChange((event) => {
      scrollX.value = clamp(
        scrollX.value + event.changeX,
        SWIPABLE_CLAMP_LEFT_VALUE,
        TRIGGER_DELETE_MOMENT + 30
      );
      if (scrollX.value >= TRIGGER_DELETE_MOMENT) {
        text.value = drop;

        release.value = true;
      } else if (scrollX.value < TRIGGER_DELETE_MOMENT && !!release.value) {
        text.value = slide;
        release.value = false;
      }
    })
    .onEnd(() => {
      if (scrollX.value > TRIGGER_DELETE_MOMENT) {
        runOnJS(handleRemove)();
      } else {
        scrollX.value = withSpring(0);
        release.value = false;
        text.value = slide;
      }
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: !release.value
        ? theme.danger.val
        : theme.dangerStrong.val,
      transform: [{ translateX: !!release.value ? 0 : scrollX.value }],
    };
  });
  return (
    <View alignItems='center' marginBottom={20}>
      <View
        bg='$danger'
        width='90%'
        height={45}
        marginTop={10}
        justifyContent='center'
        overflow='hidden'
        borderRadius={10}
      >
        <GestureDetector gesture={pan}>
          <AnimatedView
            w='100%'
            h={45}
            borderRadius={10}
            justifyContent='center'
            alignItems='center'
            style={animatedStyles}
          >
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
  text: { color: 'white', fontSize: 18, fontWeight: '500' },
});
