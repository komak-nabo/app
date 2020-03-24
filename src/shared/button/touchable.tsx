import React, { memo, FC } from 'react';
import {
  NativeSyntheticEvent,
  NativeTouchEvent,
  Platform,
  ViewStyle,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import { Text } from '../text';

interface ButtonProps {
  onPress: (event: NativeSyntheticEvent<NativeTouchEvent>) => void;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  rippleColor?: string;
}

export const Touchable: FC<ButtonProps> = memo(
  ({ onPress, children, containerStyle, textStyle, disabled, rippleColor }) => {
    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback
          onPress={onPress}
          style={containerStyle}
          disabled={disabled}
          background={TouchableNativeFeedback.Ripple(rippleColor || '#EEE')}
        >
          <Text style={textStyle}>{children}</Text>
        </TouchableNativeFeedback>
      );
    }

    return (
      <TouchableOpacity
        onPress={onPress}
        style={containerStyle}
        disabled={disabled}
      >
        <Text style={textStyle}>{children}</Text>
      </TouchableOpacity>
    );
  }
);
