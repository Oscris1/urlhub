import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { LinksList } from '@/components/LinksList';
import { Link as LinkModel } from '../../src/model/link';
import { View, Text, XStack, Spacer, Separator, YStack, Button } from 'tamagui';
import { SelectCategoryEnchanted } from '@/components/SelectCategory';
import { colors, colorsBlue } from '@/constants/colors';
import { LinearGradient } from '@tamagui/linear-gradient';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

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

  const [selectedCategory, setSelectedCategory] = useState('all');
  // const gradientColors = ['#7287fe', '#7c94fe', '#8daafe', '#fefefe'];
  // const gradientColors = ['#4B73FF', '#8daafe', '#8daafe'];
  const gradientColors = ['#EEEEEE', '#EEEEEE'];
  // background: linear-gradient(220.55deg, #7CF7FF 0%, #4B73FF 100%);
  // background: linear-gradient(220.55deg, #3793FF 0%, #0017E4 100%);
  // background: linear-gradient(220.55deg, #DDE4FF 0%, #8DA2EE 100%);

  return (
    <View backgroundColor='white' width='100%' height='100%'>
      <LinearGradient
        colors={colorsBlue[0]}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        // locations={[1, 1]}
        width='100%'
        h='30%'
        paddingTop={insets.top}
        justifyContent='center'
        alignItems='center'
      >
        <YStack h='95%' w='65%' py={10} alignItems='center'>
          <XStack
            w='100%'
            p={2}
            alignItems='flex-end'
            justifyContent='space-between'
          >
            <Pressable
              style={{
                width: 50,
                height: 50,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}
            >
              <Text>
                <Ionicons name='add-sharp' size={30} color='#0E2C5E' />
              </Text>
            </Pressable>
            <View height={50} justifyContent='center' alignItems='center'>
              <Text color='white' fontSize={25}>
                URL HUB
              </Text>
            </View>

            <Pressable
              style={{
                width: 40,
                height: 40,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}
            >
              <MaterialCommunityIcons
                name='lightning-bolt'
                size={20}
                color='#0E2C5E'
              />
            </Pressable>
          </XStack>

          <YStack width='100%' py={10} justifyContent='center' mt={10}>
            {/* <Text color='black'>Kategorie:</Text>
            <Spacer x={10} /> */}
            <Text fontSize={11} color='white'>
              Wybierz kategorię:
            </Text>
            <SelectCategoryEnchanted
              database={database}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </YStack>
        </YStack>
      </LinearGradient>

      {/* <Separator
        borderWidth={1.5}
        margin={15}
        marginTop={0}
        paddingHorizontal={150}
        borderColor={colors[1][1]}
      /> */}
      <View
        // borderRadius={50}
        borderTopStartRadius={45}
        borderTopEndRadius={45}
        paddingTop={40}
        marginTop={-40}
        backgroundColor='white'
        flex={1}
        shadowColor='#000'
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.3}
        shadowRadius={4.65}
        elevationAndroid={8}
      >
        <LinksList database={database} selectedCategory={selectedCategory} />
      </View>
      <StatusBar style='light' />
    </View>
  );
};

export default Index;
