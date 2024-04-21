import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import EnchancedLinksList from '@/components/linkList';
import { View, YStack } from 'tamagui';
import { SelectCategory } from '@/components/SelectCategory';
import { Stack, useSegments } from 'expo-router';
import { useGlobalStore } from '@/stores/globalStore';
import { AnimatedHeader } from '@/components/common';
import { useSharedValue } from 'react-native-reanimated';
import { Alert, BackHandler } from 'react-native';
import { useTranslation } from 'react-i18next';

const MARGIN_TOP_LIST_VIEW = -40;
const MARGIN_TOP_SELECT = -30;
const ADDITIONAL_PADDING_OVER_SELECT = 5;
const PADDING =
  -1 * (MARGIN_TOP_LIST_VIEW + MARGIN_TOP_SELECT) +
  ADDITIONAL_PADDING_OVER_SELECT;

const Index = () => {
  const database = useDatabase();
  const segments = useSegments();
  const { t } = useTranslation();
  const visibleTheme = useGlobalStore((state) => state.visibleTheme);
  const yPosition = useSharedValue(0);
  const selectedCategory = useGlobalStore((state) => state.selectedCategory);
  const setSelectedCategory = useGlobalStore(
    (state) => state.setSelectedCategory
  );

  useEffect(() => {
    const backAction = () => {
      if (segments[1] === '(links)') {
        Alert.alert(t('closing_app'), t('confirm_exit'), [
          {
            text: t('no'),
            onPress: () => null,
            style: 'cancel',
          },
          { text: t('yes'), onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [segments]);

  return (
    <View backgroundColor='$bg' width='100%' height='100%'>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <AnimatedHeader yPosition={yPosition} safePaddingBottom={PADDING} />
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
