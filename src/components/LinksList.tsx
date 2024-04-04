import { Feather, Entypo } from '@expo/vector-icons';
import { FlatList, TouchableOpacity, Share, Pressable } from 'react-native';
import { colors } from '../constants/colors';
import * as Clipboard from 'expo-clipboard';
import { Database } from '@nozbe/watermelondb';
import { Link } from '../model/link';
import { withObservables } from '@nozbe/watermelondb/react';
import * as Linking from 'expo-linking';
import { ReactNode, useEffect } from 'react';
import { View, Text } from 'tamagui';
import { router } from 'expo-router';
import { Q } from '@nozbe/watermelondb';
import { LinearGradient } from '@tamagui/linear-gradient';

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

interface ObservableProps {
  links: Link[];
}

interface LinkListProps {
  database: Database;
  selectedCategory: string;
}

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
    await Share.share({
      message: `Sprawdź tę stronę: ${newUrl}`,
    });
  } catch (error) {
    console.error('Wystąpił błąd podczas udostępniania:', error);
  }
};

const ObservableLinksList: React.FC<ObservableProps> = ({ links }) => {
  useEffect(() => {}, []);
  return (
    <FlatList
      style={{ paddingHorizontal: 16 }}
      data={links}
      renderItem={({ item, index }) => (
        <View flexDirection='row' height={30} marginBottom={15}>
          <Pressable style={{ flex: 1 }} onPress={() => openLink(item.url)}>
            <LinearGradient
              colors={colors[index % colors.length]}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
              borderRadius={6}
              height='100%'
              justifyContent='center'
              paddingLeft={10}
              style={{
                borderRadius: 6,
                height: '100%',
                justifyContent: 'center',
                paddingLeft: 10,
              }}
              shadowColor='#000'
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.25}
              shadowRadius={3.84}
              elevationAndroid={5}
            >
              <Text color='black' fontWeight='500' numberOfLines={1}>
                {!!item.name ? item.name : item.url}
              </Text>
            </LinearGradient>
          </Pressable>

          <OptionButton
            iconComponent={<Feather name='copy' size={20} color='black' />}
            onPress={() => copyToClipboard(item.url)}
            index={index}
          />
          <OptionButton
            iconComponent={<Feather name='share-2' size={20} color='black' />}
            onPress={() => shareLink(item.url)}
            index={index}
          />
          <OptionButton
            iconComponent={<Entypo name='edit' size={20} color='black' />}
            onPress={() => router.push('/add')}
            index={index}
          />
        </View>
      )}
    />
  );
};

// const enhance = withObservables<LinkListProps, ObservableProps>(
//   ['database', 'selectedCategory'],
//   ({ database, selectedCategory }) => ({
//     links: database.collections
//       .get<Link>('links')
//       .query(Q.where('category_id', selectedCategory))
//       .observe(),
//     allLinks: database.collections.get<Link>('links').query().observe(),
//   })
// );

const enhance = withObservables<LinkListProps, ObservableProps>(
  ['database', 'selectedCategory'],
  ({ database, selectedCategory }) => {
    let query;

    if (selectedCategory === 'all') {
      // Pobiera wszystkie linki bez filtrowania
      query = database.collections.get<Link>('links').query();
    } else if (selectedCategory === 'none') {
      // Pobiera linki bez kategorii
      query = database.collections
        .get<Link>('links')
        .query(Q.where('category_id', ''));
    } else {
      // Pobiera linki z określonej kategorii
      query = database.collections
        .get<Link>('links')
        .query(Q.where('category_id', selectedCategory));
    }

    return {
      links: query.observe(),
    };
  }
);

export const LinksList: React.FC<LinkListProps> = enhance(ObservableLinksList);

interface OptionButtonProps {
  onPress: () => void;
  iconComponent: ReactNode;
  index: number;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  onPress,
  iconComponent,
  index,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ marginLeft: 4, width: '12%', height: '100%' }}
    >
      <LinearGradient
        colors={colors[index % colors.length]}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        borderRadius={6}
        justifyContent='center'
        alignItems='center'
        height='100%'
        shadowColor='#000'
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.25}
        shadowRadius={3.84}
        elevationAndroid={5}
      >
        {iconComponent}
      </LinearGradient>
    </TouchableOpacity>
  );
};
