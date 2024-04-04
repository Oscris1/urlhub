import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { CategoriesList } from '@/components/CategoriesList';
import { Link as LinkModel } from '../../model/link';
import { View } from 'tamagui';

const colors = [
  ['#A531DC', '#4300B1'],
  ['#FF896D', '#D02020'],
  ['#3793FF', '#0017E4'],

  // additional 3
  // ['#565656', '#181818'],
  // ['#EAEAEA', '#8B8B8B'],
  // ['#FF5E98', '#0F213E'],
];

const Index = () => {
  const database = useDatabase();
  const insets = useSafeAreaInsets();

  const createFastLink = async () => {
    const text = await Clipboard.getStringAsync();
    if (!text) return;

    await database.write(async () => {
      await database.get<LinkModel>('links').create((link) => {
        link.url = text;
      });
    });
  };

  return (
    <View
      backgroundColor='black'
      width='100%'
      height='100%'
      paddingTop={insets.top}
    >
      <CategoriesList database={database} />

      <StatusBar style='light' />
    </View>
  );
};

export default Index;
