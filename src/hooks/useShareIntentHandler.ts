import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useShareIntentContext } from 'expo-share-intent';
import { shortenLink } from '@/utils';
import Toast from 'react-native-toast-message';

const useShareIntentHandler = (
  saveToDatabase: (text: string, callback?: () => void) => Promise<void>
) => {
  const { t } = useTranslation();
  const {
    hasShareIntent,
    shareIntent: { webUrl },
    resetShareIntent,
    isReady,
  } = useShareIntentContext();

  useEffect(() => {
    if (hasShareIntent && !!webUrl) {
      Alert.alert(
        t('receive_shared_content'), // Tytuł
        `${t('confirm_save_link')}\n\n${shortenLink(webUrl)}`, // Wiadomość
        [
          {
            text: t('no'),
            onPress: () => resetShareIntent(),
            style: 'cancel',
          },
          {
            text: t('yes'),
            onPress: () => saveToDatabase(webUrl, resetShareIntent),
          },
        ],
        { cancelable: true }
      );
    } else if (hasShareIntent && !webUrl) {
      Toast.show({
        type: 'error',
        text1: t('shared_content_no_weburl'),
        visibilityTime: 2000,
      });
      resetShareIntent();
    }
  }, [hasShareIntent, isReady]);
};

export default useShareIntentHandler;
