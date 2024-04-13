import { BaseToastProps, ToastConfig } from 'react-native-toast-message';
import { View, Text } from 'tamagui';
export const toastConfig: ToastConfig = {
  success: ({ text1 }: BaseToastProps) => (
    <View
      h={40}
      px={10}
      bg='$successToast'
      borderRadius={20}
      justifyContent='center'
      alignItems='center'
    >
      <Text fontSize={14} fontWeight='500' color='white'>
        {text1}
      </Text>
    </View>
  ),
  error: ({ text1 }: BaseToastProps) => (
    <View
      px={10}
      h={40}
      bg='$errorToast'
      borderRadius={20}
      justifyContent='center'
      alignItems='center'
    >
      <Text fontSize={14} fontWeight='500' color='white'>
        {text1}
      </Text>
    </View>
  ),
};
