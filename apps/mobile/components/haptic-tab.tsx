import { Pressable, type GestureResponderEvent } from 'react-native';
import * as Haptics from 'expo-haptics';

type TabBarButtonProps = {
  onPressIn?: (ev: GestureResponderEvent) => void;
  [key: string]: unknown;
};

export function HapticTab({ onPressIn, ...props }: TabBarButtonProps) {
  return (
    <Pressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPressIn?.(ev);
      }}
    />
  );
}
