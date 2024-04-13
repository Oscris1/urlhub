import { Stack } from 'expo-router';
import { useTheme } from 'tamagui';

export default function Layout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.bg.val,
        },
        headerTintColor: theme.text.val,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  );
}
