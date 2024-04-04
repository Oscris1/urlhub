import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import * as Clipboard from 'expo-clipboard';
import { Link as LinkModel } from '../../src/model/link';

export default function TabLayout() {
  const shortenLink = (link: string, maxLength = 60) => {
    if (link.length > maxLength) {
      return link.substring(0, maxLength - 3) + '...';
    } else {
      return link;
    }
  };

  const handleFastAdd = async () => {
    const text = await Clipboard.getStringAsync();
    if (!text) return;
    Alert.alert(
      'Szybkie dodawanie linka', // Tytuł
      `Czy chcesz zapisać podaną wartość jako link?\n\n${shortenLink(text)}`, // Wiadomość
      [
        {
          text: 'Nie',
          onPress: () => {},
          style: 'cancel',
        },
        { text: 'Tak', onPress: () => saveToDatabase(text) },
      ],
      { cancelable: true }
    );
  };
  const database = useDatabase();
  const saveToDatabase = async (text: string) => {
    await database.write(async () => {
      await database.get<LinkModel>('links').create((link) => {
        link.url = text;
      });
    });
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        headerShown: false,
        tabBarStyle: { backgroundColor: 'white' },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Linki',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={`list-${focused ? 'sharp' : 'outline'}`}
              size={30}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name='add'
        options={{
          title: 'Dodaj',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={`add-${focused ? 'sharp' : 'outline'}`}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='fast-add'
        listeners={() => ({
          tabPress: (e) => {
            // Zapobieganie standardowej akcji nawigacji
            e.preventDefault();
            // Wywołanie funkcji dodającej element do bazy danych
            handleFastAdd();
          },
        })}
        options={{
          tabBarBadge: '+',
          tabBarBadgeStyle: { backgroundColor: '#5D85A6' },
          title: '',
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name='lightning-bolt'
              size={30}
              color='#5D85A6'
            />
          ),
        }}
      />
    </Tabs>
  );
}
