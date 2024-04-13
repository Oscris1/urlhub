import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Spacer, View, useTheme } from 'tamagui';
import { LinearGradient } from '@tamagui/linear-gradient';
import { Stack } from 'expo-router';
import { ShimmerTextEffect } from '@/components/common';
import SelectLanguage from '@/components/settings/SelectLanguage';
import SelectTheme from '@/components/settings/SelectTheme';
import { useColorScheme } from 'react-native';

const Settings = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const colorScheme = useColorScheme();

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
        <View pt={40} px={10}>
          <SelectLanguage />
          <Spacer />
          <SelectTheme />
        </View>
      </View>
      <StatusBar style={colorScheme === 'dark' ? 'dark' : 'light'} />
    </View>
  );
};

export default Settings;
