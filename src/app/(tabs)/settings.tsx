import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'tamagui';
import { Stack } from 'expo-router';
import SelectLanguage from '@/components/settings/SelectLanguage';
import SelectTheme from '@/components/settings/SelectTheme';
import { useGlobalStore } from '@/stores/globalStore';
import SelectQuickAddBehavior from '@/components/settings/SelectQuickAddBehavior';
import { StaticHeader } from '@/components/common';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MARGIN_TOP_SETTINGS_VIEW = -20;

const Settings = () => {
  const visibleTheme = useGlobalStore((state) => state.visibleTheme);
  const insets = useSafeAreaInsets();
  return (
    <View backgroundColor='$bg' width='100%' height='100%'>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <StaticHeader
        safePaddingBottom={-MARGIN_TOP_SETTINGS_VIEW}
        height={76 + insets.top}
      />
      <View
        borderTopStartRadius={25}
        borderTopEndRadius={25}
        marginTop={MARGIN_TOP_SETTINGS_VIEW}
        backgroundColor='$bg'
        flex={1}
        shadowColor='$black'
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.3}
        shadowRadius={4.65}
        elevationAndroid={8}
        pt={20}
      >
        <ScrollView>
          <View px={10} gap={15}>
            <SelectLanguage />
            <SelectTheme />
            <SelectQuickAddBehavior />
          </View>
        </ScrollView>
      </View>

      <StatusBar style={visibleTheme === 'dark' ? 'dark' : 'light'} />
    </View>
  );
};

export default Settings;
