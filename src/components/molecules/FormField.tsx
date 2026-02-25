import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { Input, InputProps } from '../atoms/Input';

export interface FormFieldProps extends InputProps {
  required?: boolean;
  hint?: string;
  style?: StyleProp<ViewStyle>;
}

export function FormField({
  label,
  required = false,
  hint,
  errorText,
  style,
  ...inputProps
}: FormFieldProps) {
  const { colors, space, textStyles } = useTheme();

  const composedLabel = required && label ? `${label} *` : label;

  return (
    <View style={[styles.wrapper, { marginBottom: space.md }, style]}>
      <Input
        label={composedLabel}
        errorText={errorText}
        helperText={hint}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
  },
});
