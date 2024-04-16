import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Spacer, View, useTheme } from 'tamagui';
import { LinearGradient } from '@tamagui/linear-gradient';
import { Stack } from 'expo-router';
import { Logo } from '@/components/common';
import SelectLanguage from '@/components/settings/SelectLanguage';
import SelectTheme from '@/components/settings/SelectTheme';
import { useThemeStore } from '@/stores/themeStore';

const Settings = () => {
  const insets = useSafeAreaInsets();
  const visibleTheme = useThemeStore((state) => state.visibleTheme);

  return (
    <View backgroundColor='$bg' width='100%' height='100%'>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View h='18%'>
        <LinearGradient
          colors={['$gradientAdditional', '$primary']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          width='100%'
          h='100%'
          paddingTop={insets.top}
          alignItems='center'
          justifyContent='center'
          paddingBottom={45}
        >
          <Logo />
        </LinearGradient>
      </View>
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
      <StatusBar style={visibleTheme === 'dark' ? 'dark' : 'light'} />
    </View>
  );
};

export default Settings;
