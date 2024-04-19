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
import { useGlobalStore } from '@/stores/globalStore';

const CreateLink = () => {
  const database = useDatabase();
  const { id, passedCategory }: { id: string; passedCategory?: string } =
    useLocalSearchParams(); // string | string[] by default
  const [linkName, setLinkName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    passedCategory || ''
  );

  const { t } = useTranslation();
  const theme = useTheme();
  const resetLinkListSelectedCategory = useGlobalStore(
    (state) => state.resetSelectedCategory
  );
  const setLinkListSelectedCategory = useGlobalStore(
    (state) => state.setSelectedCategory
  );

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

  const createOrEditLink = async (
    animation: () => void,
    endAnimation: () => void
  ) => {
    if (!url) return;

    animation();

    try {
      await database.write(async () => {
        let setCategory: (link: Link) => void;
        let categoryId: string | undefined;

        if (selectedCategory) {
          // prepare category
          const category = await database.collections
            .get<Category>('categories')
            .find(selectedCategory);

          setCategory = (link: Link) => link.category.set(category);
          categoryId = category?.id;
        }

        if (id) {
          // edit link
          const link = await database.get<Link>('links').find(id);
          await link.update(() => {
            link.name = linkName;
            link.url = url;
            setCategory?.(link);
          });
          router.back();
        } else {
          // create new Link
          await database.get<Link>('links').create((link) => {
            link.name = linkName;
            link.url = url;
            setCategory?.(link);
          });
          if (categoryId) {
            setLinkListSelectedCategory(categoryId);
          } else {
            resetLinkListSelectedCategory();
          }
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
    setSelectedCategory('');
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
          <FontAwesome name='paste' size={20} color={theme.white.val} />
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
        <SaveButton onPress={createOrEditLink} disabled={!url} />
      </View>
    </View>
  );
};

export default CreateLink;
