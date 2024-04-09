import React from 'react';
import { Tabs, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import * as Clipboard from 'expo-clipboard';
import { Link as LinkModel } from '../../src/model/link';
import { useSegments } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();
  const shortenLink = (link: string, maxLength = 60) => {
    if (link.length > maxLength) {
      return link.substring(0, maxLength - 3) + '...';
    } else {
      return link;
    }
  };

  const handleFastAdd = async () => {
    const text = await Clipboard.getStringAsync();
    if (!text) {
      Toast.show({
        type: 'error',
        text1: t('no_url_in_clipboard'),
        visibilityTime: 2000,
      });
      return;
    }
    Alert.alert(
      t('quick_add_link'), // Tytuł
      `${t('confirm_save_link')}\n\n${shortenLink(text)}`, // Wiadomość
      [
        {
          text: t('no'),
          onPress: () => {},
          style: 'cancel',
        },
        { text: t('yes'), onPress: () => saveToDatabase(text) },
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

  const segments = useSegments();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        headerShown: false,
        tabBarStyle: { backgroundColor: 'black' },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name='(links)'
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
        listeners={() => ({
          tabPress: (e) => {
            // Zapobieganie standardowej akcji nawigacji
            e.preventDefault();
            // Wywołanie funkcji dodającej element do bazy danych
            if (segments[2] !== 'createEdit') {
              router.push('/createEdit');
            }
          },
        })}
        options={{
          title: t('add'),
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
          tabBarBadgeStyle: { backgroundColor: '#8DA2EE' },
          title: '',
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name='lightning-bolt'
              size={30}
              color='#8DA2EE'
            />
          ),
        }}
      />
    </Tabs>
  );
}
