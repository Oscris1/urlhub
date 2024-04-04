import { TextInput, TouchableOpacity, Keyboard } from 'react-native';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import Category from '@/model/category';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from '@/model/link';
import * as Clipboard from 'expo-clipboard';
import { View, Text } from 'tamagui';

import GradientButton from '@/components/GradientButton';
import { SelectCategoryEnchanted } from '@/components/SelectCategory';
import CreateCategory from '@/components/add/CreateCategory';
import CreateLink from '@/components/add/CreateLink';

const Add = () => {
  const { top } = useSafeAreaInsets();

  return (
    <>
      <View
        backgroundColor='black'
        width='100%'
        height='100%'
        paddingHorizontal={20}
        paddingTop={top}
      >
        {/* New Category */}
        <CreateCategory />

        {/* new link */}
        <CreateLink />
      </View>
    </>
  );
};

export default Add;
