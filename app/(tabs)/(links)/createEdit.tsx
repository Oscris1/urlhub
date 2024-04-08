import React from 'react';
import { View, Spacer } from 'tamagui';
import CreateCategory from '@/components/createEditDelete/CreateCategory';
import CreateLink from '@/components/createEditDelete/CreateLink';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import SwapToRemove from '@/components/createEditDelete/SwapToRemove';

const Add = () => {
  const { id }: { id: string } = useLocalSearchParams(); // string | string[] by default

  return (
    <>
      <Stack.Screen
        options={{
          // https://reactnavigation.org/docs/headers#setting-the-header-title
          title: id ? 'Edytuj' : 'Dodaj',
          // https://reactnavigation.org/docs/headers#adjusting-header-styles
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <View
        backgroundColor='black'
        width='100%'
        height='100%'
        paddingHorizontal={10}
      >
        {/* New Category */}
        {!id && <CreateCategory />}

        <Spacer />

        {/* new link */}
        <CreateLink />

        {!!id && (
          <View flex={1} justifyContent='flex-end'>
            <SwapToRemove id={id} />
          </View>
        )}
      </View>
      <StatusBar style='light' />
    </>
  );
};

export default Add;
