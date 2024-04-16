import { Feather, Entypo } from '@expo/vector-icons';
import { Share, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Link } from '../../model/link';
import { withObservables } from '@nozbe/watermelondb/react';
import * as Linking from 'expo-linking';
import { Text, YStack, useTheme } from 'tamagui';
import { router } from 'expo-router';
import Category from '@/model/category';
import OptionButton from './OptionButton';
import { useTranslation } from 'react-i18next';
import { t as translate } from 'i18next';
import { AnimatedView } from '../common';
import { SlideInLeft } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

const addHttps = (url: string) => {
  // Sprawdza, czy URL zaczyna się od "http://" lub "https://", jeśli nie - dodaje "https://"
  if (!url.match(/^[a-zA-Z]+:\/\//)) {
    return `https://${url}`;
  }
  return url;
};

const copyToClipboard = async (text: string) => {
  await Clipboard.setStringAsync(text);
  Toast.show({
    type: 'success',
    text1: translate('copied_to_clipboard'),
    visibilityTime: 1500,
  });
};

const openLink = async (url: string) => {
  // Sprawdza, czy URL zaczyna się od "http://" lub "https://", jeśli nie - dodaje "https://"
  let newUrl = addHttps(url);

  await Linking.openURL(newUrl).catch((err) =>
    console.error('An error occurred', err)
  );
};

const shareLink = async (url: string, title: string, message: string) => {
  let newUrl = addHttps(url);
  try {
    await Share.share(
      {
        title: title, // change later
        message: `${message} ${newUrl}`,
        url: newUrl,
      },
      {
        dialogTitle: title,
      }
    );
  } catch (error) {
    console.error('Wystąpił błąd podczas udostępniania:', error);
  }
};

interface LinkItemProps {
  link: Link;
  index: number;
  category: Category;
}

const LinkItem: React.FC<LinkItemProps> = ({ link, index, category }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const iconColor = theme.textContrast.val;

  return (
    <AnimatedView
      entering={SlideInLeft.delay(index * 25)
        .springify()
        .mass(2)
        .damping(16)}
      flexDirection='row'
      height={60}
      marginBottom={15}
      backgroundColor='$secondary'
      justifyContent='center'
      alignItems='center'
      px={10}
      borderRadius={10}
    >
      <Pressable style={{ flex: 1 }} onPress={() => openLink(link.url)}>
        <YStack maxWidth='90%'>
          <Text color='$text' fontWeight='500' numberOfLines={1}>
            {!!link.name ? link.name : link.url}
          </Text>
          <Text
            color='$primary'
            fontWeight='300'
            fontSize={10}
            numberOfLines={1}
          >
            {!!category?.name ? category?.name : t('no_category')}
          </Text>
        </YStack>
      </Pressable>

      <OptionButton
        iconComponent={<Feather name='copy' size={20} color={iconColor} />}
        onPress={() => copyToClipboard(link.url)}
      />
      <OptionButton
        iconComponent={<Feather name='share-2' size={20} color={iconColor} />}
        onPress={() =>
          shareLink(link.url, t('share_link'), t('check_this_page'))
        }
      />
      <OptionButton
        iconComponent={<Entypo name='edit' size={20} color={iconColor} />}
        // @ts-ignore
        onPress={() => router.push(`/createEdit?id=${link.id}`)}
      />
    </AnimatedView>
  );
};

const EnhancedLinkItem = withObservables(
  ['link'],
  ({ link }: { link: Link }) => ({
    link: link.observe(), // Obserwuj zmiany linku
    category: link?.category?.observe(), // Obserwuj zmiany w powiązanej kategorii
  })
)(LinkItem);

export default EnhancedLinkItem;
