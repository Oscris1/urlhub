import { TouchableOpacity } from 'react-native';
import { ReactNode } from 'react';
import { LinearGradient } from '@tamagui/linear-gradient';

interface OptionButtonProps {
  onPress: () => void;
  iconComponent: ReactNode;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  onPress,
  iconComponent,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ marginLeft: 4, width: '12%', height: '50%' }}
    >
      <LinearGradient
        colors={['$gradientAdditional', '$primary']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        borderRadius={6}
        justifyContent='center'
        alignItems='center'
        height='100%'
        shadowColor='$black'
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

export default OptionButton;
