import { BaseToastProps, ToastConfig } from 'react-native-toast-message';
import { View, Text } from 'tamagui';
export const toastConfig: ToastConfig = {
  success: ({ text1 }: BaseToastProps) => (
    <View
      h={50}
      px={10}
      bg='rgba(141, 162, 238, 0.9)'
      borderRadius={20}
      justifyContent='center'
      alignItems='center'
    >
      <Text fontSize={18} fontWeight='500' color='white'>
        {text1}
      </Text>
    </View>
  ),
  error: ({ text1 }: BaseToastProps) => (
    <View
      px={10}
      h={50}
      bg='rgba(242, 133, 133, 0.9)'
      borderRadius={20}
      justifyContent='center'
      alignItems='center'
    >
      <Text fontSize={18} fontWeight='500' color='white'>
        {text1}
      </Text>
    </View>
  ),
};
