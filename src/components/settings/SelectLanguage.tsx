import React, { useEffect, useState } from 'react';
import { View, Text, XStack, YStack } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { changeLanguage, storage } from '@/translations';

export const SelectLanguage = () => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(
    'pl'
  );

  useEffect(() => {
    setSelectedLanguage(storage.getString('userLanguage'));
  }, []);

  const valueChange = (language: string) => {
    setSelectedLanguage(language);
    changeLanguage(language);
  };

  const languages = [
    { id: 'pl', displayName: t('polish') },
    { id: 'en', displayName: t('english') },
  ];

  return (
    <View
      backgroundColor='rgba(141, 162, 238, 0.3)'
      padding={20}
      borderRadius={10}
    >
      <Text color='white'>{t('select_language')}</Text>
      <YStack>
        {languages.map((language) => (
          <Pressable key={language.id} onPress={() => valueChange(language.id)}>
            <XStack paddingVertical={4}>
              <View
                width={20}
                height={20}
                borderRadius={10}
                borderWidth={0.5}
                borderColor='#8DA2EE'
                justifyContent='center'
                alignItems='center'
                marginRight={4}
              >
                {selectedLanguage === language.id && (
                  <View
                    width={16}
                    height={16}
                    borderRadius={8}
                    backgroundColor='#8DA2EE'
                  />
                )}
              </View>
              <Text color='white'>{language.displayName}</Text>
            </XStack>
          </Pressable>
        ))}
      </YStack>
      <View flexDirection='row' justifyContent='space-between'></View>
    </View>
  );
};
