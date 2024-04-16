import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import EnchancedLinksList from '@/components/linkList';
import { View, YStack } from 'tamagui';
import { SelectCategory } from '@/components/SelectCategory';
import { LinearGradient } from '@tamagui/linear-gradient';
import { Stack } from 'expo-router';
import { useThemeStore } from '@/stores/themeStore';
import { AnimatedView, Logo } from '@/components/common';
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const HEADER_HIGHT = 250;
const MARGIN_TOP_LIST_VIEW = -40;
const MARGIN_TOP_SELECT = -30;
const PADDING = (MARGIN_TOP_LIST_VIEW + MARGIN_TOP_SELECT) * -1;

const Index = () => {
  const database = useDatabase();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const visibleTheme = useThemeStore((state) => state.visibleTheme);
  const yPosition = useSharedValue(0);

  const rIconStyle = useAnimatedStyle(() => {
    const value = interpolate(
      yPosition.value,
      [0, 150],
      [2, 1],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        {
          scale: value,
        },
      ],
    };
  });

  const rGradientStyle = useAnimatedStyle(() => {
    const value = interpolate(
      yPosition.value,
      [0, 150],
      [0, 80],
      Extrapolation.CLAMP
    );
    return {
      height: HEADER_HIGHT - value,
    };
  });

  return (
    <View backgroundColor='$bg' width='100%' height='100%'>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <AnimatedView style={rGradientStyle}>
        <LinearGradient
          colors={['$gradientAdditional', '$primary']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          width='100%'
          h='100%'
          paddingTop={insets.top}
          alignItems='center'
          justifyContent='center'
          paddingBottom={PADDING}
        >
          <AnimatedView style={rIconStyle}>
            <Logo />
          </AnimatedView>
        </LinearGradient>
      </AnimatedView>
      <View
        borderTopStartRadius={25}
        borderTopEndRadius={25}
        marginTop={MARGIN_TOP_LIST_VIEW}
        backgroundColor='$bg'
        flex={1}
        shadowColor='$black'
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.3}
        shadowRadius={4.65}
        elevationAndroid={8}
      >
        <YStack
          width='100%'
          justifyContent='center'
          alignItems='center'
          zIndex={2}
          marginTop={MARGIN_TOP_SELECT}
          paddingBottom={40}
        >
          <View width='70%'>
            <SelectCategory
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </View>
        </YStack>

        <EnchancedLinksList
          database={database}
          selectedCategory={selectedCategory}
          yPosition={yPosition}
        />
      </View>
      <StatusBar style={visibleTheme === 'dark' ? 'dark' : 'light'} />
    </View>
  );
};

export default Index;
