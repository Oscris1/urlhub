import { TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import Category from '@/model/category';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from '@/model/link';
import * as Clipboard from 'expo-clipboard';
import { View, Text, Separator } from 'tamagui';

import GradientButton from '@/components/GradientButton';
import { SelectCategoryEnchanted } from '@/components/SelectCategory';

const CreateLink = () => {
  const database = useDatabase();
  const [linkName, setLinkName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const createNewLink = async (
    animation: () => void,
    endAnimation: () => void
  ) => {
    if (!url) return;

    animation();

    try {
      await database.write(async () => {
        let setCategory: (link: Link) => void;

        if (selectedCategory) {
          const category = await database.collections
            .get<Category>('categories')
            .find(selectedCategory);

          setCategory = (link: Link) => link.category.set(category);
        }

        await database.get<Link>('links').create((link) => {
          link.name = linkName;
          link.url = url;
          setCategory?.(link);
        });
      });

      resetFormAndState();
    } catch (error) {
      console.error('Failed to create new link:', error);
    } finally {
      endAnimation();
    }
  };

  const resetFormAndState = () => {
    setLinkName('');
    setUrl('');
    setSelectedCategory('');
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    setUrl(text);
  };
  return (
    <View>
      <Text color='white' paddingBottom={20}>
        Dodaj link
      </Text>
      <View
        flexDirection='row'
        justifyContent='space-between'
        marginBottom={10}
      >
        <TextInput
          placeholder='Url'
          onChangeText={setUrl}
          value={url}
          style={{
            paddingLeft: 3,
            backgroundColor: 'white',
            width: '80%',
            borderRadius: 6,
            borderWidth: 2,
            borderColor: colors[1][0],
          }}
        />
        <TouchableOpacity
          style={{
            width: '18%',
            backgroundColor: colors[1][0],
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 6,
          }}
          onPress={fetchCopiedText}
        >
          <FontAwesome name='paste' size={20} color='white' />
        </TouchableOpacity>
      </View>
      <View
        flexDirection='row'
        justifyContent='space-between'
        marginBottom={10}
      >
        <TextInput
          placeholder='Nazwa linka'
          onChangeText={setLinkName}
          value={linkName}
          style={{
            backgroundColor: 'white',
            width: '100%',
            borderRadius: 6,
            borderWidth: 2,
            borderColor: colors[1][0],
            paddingLeft: 3,
          }}
        />
      </View>

      <SelectCategoryEnchanted
        add
        database={database}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <View marginTop={10}>
        <GradientButton
          icon={<MaterialIcons name='add' size={30} color='white' />}
          onPress={createNewLink}
          disabled={!url}
        />
      </View>
      <Separator marginVertical={30} borderColor={colors[1][1]} />
    </View>
  );
};

export default CreateLink;
