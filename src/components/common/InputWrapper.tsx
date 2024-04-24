import React, { ReactNode } from 'react';
import { Text, YStack } from 'tamagui';

interface InputWrapperProps {
  children: ReactNode;
  label: string;
}

const InputWrapper: React.FC<InputWrapperProps> = ({ children, label }) => {
  return (
    <YStack gap={2}>
      <Text color='$text' paddingLeft={3} fontSize={12}>
        {label}
      </Text>
      {children}
    </YStack>
  );
};

export default InputWrapper;
