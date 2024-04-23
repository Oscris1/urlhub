import { TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from '@/model/link';
import * as Clipboard from 'expo-clipboard';
import { View, Text, Input, useTheme } from 'tamagui';
import { InputWrapper, SaveButton } from '@/components/common';
import { SelectCategory } from '@/components/SelectCategory';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '@/stores/globalStore';
import { linksCollection, categoriesCollection } from '@/model';

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
      const link = await linksCollection.find(id);
      setUrl(link.url);
      setLinkName(link.name);
      setSelectedCategory(link.category.id);
    }
  };

  useEffect(() => {
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
          const category = await categoriesCollection.find(selectedCategory);

          setCategory = (link: Link) => link.category.set(category);
          categoryId = category?.id;
        }

        // create new Link
        if (!id) {
          await linksCollection.create((link) => {
            link.name = linkName;
            link.url = url;
            setCategory?.(link);
          });
          if (!categoryId) {
            resetLinkListSelectedCategory();
          }
        }

        // edit link
        if (id) {
          const link = await linksCollection.find(id);
          await link.update(() => {
            link.name = linkName;
            link.url = url;
            setCategory?.(link);
          });
          router.back();
        }

        if (categoryId) {
          setLinkListSelectedCategory(categoryId);
        }
      });

      Toast.show({
        type: 'success',
        text1: !!id ? t('link_updated') : t('link_created'),
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
    <View backgroundColor='$secondary' padding={20} borderRadius={10} gap={5}>
      <View justifyContent='center' alignItems='center'>
        <Text fontSize={18} fontWeight='bold' color='$text'>
          {id ? t('edit') : t('add')} link
        </Text>
      </View>

      <InputWrapper label={t('url')}>
        <View flexDirection='row' justifyContent='space-between'>
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
      </InputWrapper>

      <InputWrapper label={t('link_name')}>
        <View flexDirection='row' justifyContent='space-between'>
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
      </InputWrapper>

      <InputWrapper label={'Kategoria'}>
        <SelectCategory
          add
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          size='$3'
          borderRadius={6}
        />
      </InputWrapper>

      <View pt={10}>
        <SaveButton onPress={createOrEditLink} disabled={!url} />
      </View>
    </View>
  );
};

export default CreateLink;
