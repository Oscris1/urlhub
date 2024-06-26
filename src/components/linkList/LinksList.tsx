import { Link } from '../../model/link';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import EnhancedLinkItem from './LinkItem';
import { FlashList } from '@shopify/flash-list';
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useEffect, useRef } from 'react';
import { View, Text } from 'tamagui';
import { PressableButton } from '../common';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { linksCollection } from '@/model';
import { useGlobalStore } from '@/stores/globalStore';

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<Link>);

interface LinkListProps {
  links: Link[];
  yPosition: SharedValue<number>;
  selectedCategory: string;
}

interface EnchancedLinkListProps {
  selectedCategory: string;
  yPosition: SharedValue<number>;
}

const LinksList: React.FC<LinkListProps> = ({
  links,
  yPosition,
  selectedCategory,
}) => {
  const listRef = useRef<FlashList<Link>>(null);
  const prevLinksLength = useRef(links.length);
  const prevCategory = useRef(selectedCategory);
  const scrollToTopDependency = useGlobalStore(
    (state) => state.scrollToTopDependency
  );

  const scrollHandler = useAnimatedScrollHandler((event) => {
    yPosition.value = event.contentOffset.y;
  });

  useEffect(() => {
    /// scroll to top if new link was created
    if (
      links.length > prevLinksLength.current &&
      selectedCategory === prevCategory.current
    ) {
      listRef.current?.scrollToIndex({ index: 0, animated: true });
    }
    prevLinksLength.current = links.length;
  }, [links]);

  useEffect(() => {
    // scroll to Top if category is changed
    if (selectedCategory !== prevCategory.current) {
      listRef.current?.scrollToIndex({ index: 0, animated: true });
      prevLinksLength.current = links.length;
    }
    prevCategory.current = selectedCategory;
  }, [selectedCategory]);

  useEffect(() => {
    // scroll to top on on demand
    listRef.current?.scrollToIndex({ index: 0, animated: true });
  }, [scrollToTopDependency]);

  return (
    <AnimatedFlashList
      ref={listRef}
      contentContainerStyle={{ paddingHorizontal: 8 }}
      estimatedItemSize={75}
      onScroll={scrollHandler}
      data={links}
      renderItem={({ item, index }) => (
        <EnhancedLinkItem link={item} index={index} />
      )}
      ListEmptyComponent={() => (
        <LinksEmptyComponent selectedCategory={selectedCategory} />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

const enhance = withObservables<EnchancedLinkListProps, LinkListProps>(
  ['selectedCategory'],
  //@ts-ignore
  ({ selectedCategory }) => {
    let query;

    if (selectedCategory === 'all') {
      // Pobiera wszystkie linki bez filtrowania
      query = linksCollection.query(Q.sortBy('created_at', Q.desc));
    } else if (selectedCategory === 'none') {
      // Pobiera linki bez kategorii
      query = linksCollection.query(
        Q.where('category_id', null),
        Q.sortBy('created_at', Q.desc)
      );
    } else {
      // Pobiera linki z określonej kategorii
      query = linksCollection.query(
        Q.where('category_id', selectedCategory),
        Q.sortBy('created_at', Q.desc)
      );
    }

    return {
      links: query.observe(),
    };
  }
);

export const EnchancedLinksList: React.FC<EnchancedLinkListProps> =
  enhance(LinksList);

interface LinksEmptyComponentProps {
  selectedCategory: string;
}

const LinksEmptyComponent: React.FC<LinksEmptyComponentProps> = ({
  selectedCategory,
}) => {
  const { t } = useTranslation();
  const isUserCategory = !(
    selectedCategory === 'all' || selectedCategory === 'none'
  );
  return (
    <View
      width='100%'
      justifyContent='center'
      alignItems='center'
      py={10}
      gap={12}
    >
      <Text fontWeight='500' fontSize={20} color='$text' textAlign='center'>
        {isUserCategory ? t('no_links_in_category') : t('no_links_yet')}
      </Text>
      <PressableButton
        buttonTextReplacment={t('create_link')}
        onPress={() =>
          router.push(
            // @ts-ignore broken types
            `/createEdit${
              isUserCategory ? `?passedCategory=${selectedCategory}` : ''
            }`
          )
        }
      />
    </View>
  );
};
