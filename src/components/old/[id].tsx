import { View, Text } from 'tamagui';
import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';

const category = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Stack.Screen options={{}} />
      <Text>Category {id} sa</Text>
    </View>
  );
};

export default category;
