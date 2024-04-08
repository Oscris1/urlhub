import { FlatList } from 'react-native';
import { Database } from '@nozbe/watermelondb';
import { Link } from '../../model/link';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import EnhancedLinkItem from './LinkItem';

interface LinkListProps {
  links: Link[];
}

interface EnchancedLinkListProps {
  database: Database;
  selectedCategory: string;
}

const LinksList: React.FC<LinkListProps> = ({ links }) => {
  return (
    <FlatList
      style={{ paddingHorizontal: 8 }}
      data={links}
      renderItem={({ item, index }) => (
        <EnhancedLinkItem link={item} index={index} />
      )}
    />
  );
};

const enhance = withObservables<EnchancedLinkListProps, LinkListProps>(
  ['database', 'selectedCategory'],
  //@ts-ignore
  ({ database, selectedCategory }) => {
    let query;

    if (selectedCategory === 'all') {
      // Pobiera wszystkie linki bez filtrowania
      query = database.collections
        .get<Link>('links')
        .query(Q.sortBy('created_at', Q.desc));
    } else if (selectedCategory === 'none') {
      // Pobiera linki bez kategorii
      query = database.collections
        .get<Link>('links')
        .query(Q.where('category_id', null), Q.sortBy('created_at', Q.desc));
    } else {
      // Pobiera linki z określonej kategorii
      query = database.collections
        .get<Link>('links')
        .query(
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
