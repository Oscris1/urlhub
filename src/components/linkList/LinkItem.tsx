import { Feather, Entypo } from '@expo/vector-icons';
import { Share, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Link } from '../../model/link';
import { withObservables } from '@nozbe/watermelondb/react';
import * as Linking from 'expo-linking';
import { View, Text, YStack } from 'tamagui';
import { router } from 'expo-router';
import Category from '@/model/category';
import OptionButton from './OptionButton';

const addHttps = (url: string) => {
  // Sprawdza, czy URL zaczyna się od "http://" lub "https://", jeśli nie - dodaje "https://"
  if (!url.match(/^[a-zA-Z]+:\/\//)) {
    return `https://${url}`;
  }
  return url;
};

const copyToClipboard = async (text: string) => {
  await Clipboard.setStringAsync(text);
};

const openLink = async (url: string) => {
  // Sprawdza, czy URL zaczyna się od "http://" lub "https://", jeśli nie - dodaje "https://"
  let newUrl = addHttps(url);

  await Linking.openURL(newUrl).catch((err) =>
    console.error('An error occurred', err)
  );
};

const shareLink = async (url: string) => {
  let newUrl = addHttps(url);
  try {
    await Share.share(
      {
        title: 'Udostępnij link', // change later
        message: `Sprawdź tę stronę: ${newUrl}`,
        url: newUrl,
      },
      {
        dialogTitle: 'Udostępnij link',
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
  return (
    <View
      flexDirection='row'
      height={60}
      marginBottom={15}
      // backgroundColor='#20262E'
      backgroundColor='rgba(141, 162, 238, 0.2)'
      justifyContent='center'
      alignItems='center'
      px={10}
      borderRadius={10}
    >
      <Pressable style={{ flex: 1 }} onPress={() => openLink(link.url)}>
        <YStack>
          <Text color='white' fontWeight='500' numberOfLines={1}>
            {!!link.name ? link.name : link.url}
          </Text>
          <Text
            color='#8DA2EE'
            fontWeight='300'
            fontSize={10}
            numberOfLines={1}
          >
            {!!category?.name ? category?.name : 'Brak kategorii'}
          </Text>
        </YStack>
      </Pressable>

      <OptionButton
        iconComponent={<Feather name='copy' size={20} color='#20262E' />}
        onPress={() => copyToClipboard(link.url)}
      />
      <OptionButton
        iconComponent={<Feather name='share-2' size={20} color='#20262E' />}
        onPress={() => shareLink(link.url)}
      />
      <OptionButton
        iconComponent={<Entypo name='edit' size={20} color='#20262E' />}
        // @ts-ignore
        onPress={() => router.push(`/createEdit?id=${link.id}`)}
      />
    </View>
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
