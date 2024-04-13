import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import EnchancedLinksList from '@/components/linkList';
import { View, YStack, useTheme } from 'tamagui';
import { SelectCategory } from '@/components/SelectCategory';

import { LinearGradient } from '@tamagui/linear-gradient';

import { Stack } from 'expo-router';
import { ShimmerTextEffect } from '@/components/common';
import { useColorScheme } from 'react-native';

const Index = () => {
  const database = useDatabase();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <View backgroundColor='$bg' width='100%' height='100%'>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <LinearGradient
        colors={['$gradientAdditional', '$primary']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        width='100%'
        h='18%'
        paddingTop={insets.top}
        alignItems='center'
      >
        <ShimmerTextEffect
          text='Url hub'
          startColor={theme.textContrast.val}
          endColor={theme.primary.val}
          delay={8000}
          isInfinity
        />
      </LinearGradient>

      <View
        borderTopStartRadius={25}
        borderTopEndRadius={25}
        marginTop={-40}
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
          marginTop={-30}
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
        />
      </View>
      <StatusBar style={colorScheme === 'dark' ? 'dark' : 'light'} />
    </View>
  );
};

export default Index;
