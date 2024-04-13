// import { Link } from 'expo-router';
// import { FlatList, Pressable } from 'react-native';
// import Category from '../src/model/category';
// import { colors } from '../src/constants/colors';
// import { withObservables } from '@nozbe/watermelondb/react';
// import { Database } from '@nozbe/watermelondb';
// import { Text } from 'tamagui';
// import { LinearGradient } from 'tamagui/linear-gradient';

// interface ObservableProps {
//   categories: Category[];
// }

// interface CategoriesListProps {
//   database: Database;
// }

// const ObservableCategoriesList: React.FC<ObservableProps> = ({
//   categories,
// }) => {
//   return (
//     <FlatList
//       data={categories}
//       keyExtractor={(item) => item.id.toString()}
//       renderItem={({ item, index }) => {
//         return (
//           <Link asChild href={`/${item.id}`}>
//             <Pressable
//               style={{
//                 flex: 1,
//                 borderRadius: 10,
//                 aspectRatio: 1,
//                 maxWidth: '50%',
//               }}
//             >
//               {/* <LinearGradient
//                 colors={colors[index % colors.length]}
//                 start={{ x: 1, y: 1 }}
//                 end={{ x: 0, y: 0 }}
//                 width='100%'
//                 height='100%'
//                 alignItems='center'
//                 justifyContent='center'
//                 borderRadius={10}
//               >
//                 <Text color='black' fontWeight='500'>
//                   {item.name}
//                 </Text>
//               </LinearGradient> */}
//             </Pressable>
//           </Link>
//         );
//       }}
//       numColumns={2}
//       contentContainerStyle={{ gap: 20, padding: 20 }}
//       columnWrapperStyle={{ gap: 20 }}
//     />
//   );
// };

// const enhance = withObservables<CategoriesListProps, ObservableProps>(
//   ['database'],
//   ({ database }) => ({
//     // @ts-ignore
//     // fix types later
//     categories: database.collections
//       .get<Category>('categories')
//       .query()
//       .observe(),
//   })
// );

// export const CategoriesList: React.FC<CategoriesListProps> = enhance(
//   ObservableCategoriesList
// );
