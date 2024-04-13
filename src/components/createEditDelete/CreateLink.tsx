import { TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import Category from '@/model/category';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from '@/model/link';
import * as Clipboard from 'expo-clipboard';
import { View, Text, Input, useTheme } from 'tamagui';
import { SaveButton } from '@/components/common';
import { SelectCategory } from '@/components/SelectCategory';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

const CreateLink = () => {
  const database = useDatabase();
  const [linkName, setLinkName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const { id }: { id: string } = useLocalSearchParams(); // string | string[] by default
  const { t } = useTranslation();
  const theme = useTheme();

  const prepareEdit = async () => {
    if (id) {
      const link = await database.get<Link>('links').find(id);
      setUrl(link.url);
      setLinkName(link.name);
      setSelectedCategory(link.category.id);
    }
  };

  useEffect(() => {
    console.log('id z local', id);
    prepareEdit();
  }, [id]);

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

        if (id) {
          const link = await database.get<Link>('links').find(id);
          await link.update(() => {
            link.name = linkName;
            link.url = url;
            setCategory?.(link);
          });
          router.back();
        } else {
          await database.get<Link>('links').create((link) => {
            link.name = linkName;
            link.url = url;
            setCategory?.(link);
          });
        }
      });
      Toast.show({
        type: 'success',
        text1: t('saved'),
        text2: `${t('link')} ${!!id ? t('updated') : t('added')}`,
        visibilityTime: 1500,
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
    setSelectedCategory(undefined);
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    setUrl(text);
  };

  return (
    <View
      backgroundColor='$secondary'
      padding={20}
      borderRadius={10}
      height={250}
    >
      <Text color='$text' paddingBottom={10}>
        {id ? t('edit') : t('add')} link
      </Text>
      <View
        flexDirection='row'
        justifyContent='space-between'
        marginBottom={10}
      >
        <Input
          placeholder={t('url')}
          onChangeText={setUrl}
          value={url}
          size='$3'
          paddingLeft={6}
          bg='$white'
          w='80%'
          borderRadius={6}
        />
        <TouchableOpacity
          style={{
            width: '18%',
            backgroundColor: theme.primary.val,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 6,
          }}
          onPress={fetchCopiedText}
        >
          <FontAwesome name='paste' size={20} color={theme.textContrast.val} />
        </TouchableOpacity>
      </View>
      <View
        flexDirection='row'
        justifyContent='space-between'
        marginBottom={10}
      >
        <Input
          placeholder={t('link_name')}
          onChangeText={setLinkName}
          value={linkName}
          size='$3'
          paddingLeft={6}
          backgroundColor='$white'
          w='100%'
          borderRadius={6}
        />
      </View>

      <SelectCategory
        add
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        size='$3'
        borderRadius={6}
      />
      <View marginTop={10} paddingBottom={30}>
        <SaveButton onPress={createNewLink} disabled={!url} />
      </View>
    </View>
  );
};

export default CreateLink;
