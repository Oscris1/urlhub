import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import EnchancedLinksList from '@/components/linkList';
import { View, YStack } from 'tamagui';
import { SelectCategory } from '@/components/SelectCategory';
import { Stack } from 'expo-router';
import { useThemeStore } from '@/stores/themeStore';
import { AnimatedHeader } from '@/components/common';
import { useSharedValue } from 'react-native-reanimated';

const MARGIN_TOP_LIST_VIEW = -40;
const MARGIN_TOP_SELECT = -30;
const ADDITIONAL_PADDING_OVER_SELECT = 5;
const PADDING =
  -1 * (MARGIN_TOP_LIST_VIEW + MARGIN_TOP_SELECT) +
  ADDITIONAL_PADDING_OVER_SELECT;

const Index = () => {
  const database = useDatabase();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const visibleTheme = useThemeStore((state) => state.visibleTheme);
  const yPosition = useSharedValue(0);

  return (
    <View backgroundColor='$bg' width='100%' height='100%'>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <AnimatedHeader yPosition={yPosition} savePaddingBottom={PADDING} />
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
