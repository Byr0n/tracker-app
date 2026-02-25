import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  size?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    helperText,
    errorText,
    size = 'md',
    leftIcon,
    rightIcon,
    clearable = false,
    style,
    inputStyle,
    labelStyle,
    value,
    onChangeText,
    ...rest
  },
  ref,
) {
  const { colors, radii, space, textStyles } = useTheme();
  const [focused, setFocused] = useState(false);

  const hasError = Boolean(errorText);

  const borderColor = hasError
    ? colors.borderDanger
    : focused
    ? colors.borderFocus
    : colors.borderDefault;

  const HEIGHT: Record<InputSize, number> = { sm: 36, md: 44, lg: 52 };
  const height = HEIGHT[size];

  const canClear = clearable && Boolean(value);

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Text style={[textStyles.labelMD, styles.label, { color: colors.textPrimary }, labelStyle]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputRow,
          {
            height,
            borderRadius: radii.md,
            borderColor,
            borderWidth: focused ? 2 : 1,
            backgroundColor: colors.surfaceDefault,
            paddingHorizontal: space.sm,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          style={[
            textStyles.bodyMD,
            styles.input,
            { color: colors.textPrimary },
            leftIcon ? { paddingLeft: space.xs } : undefined,
            (rightIcon || canClear) ? { paddingRight: space.xs } : undefined,
            inputStyle,
          ]}
          placeholderTextColor={colors.textTertiary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />

        {canClear && (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => onChangeText?.('')}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            accessibilityLabel="Clear input"
          >
            <View style={[styles.clearIcon, { backgroundColor: colors.textTertiary }]}>
              <Text style={{ color: colors.textInverse, fontSize: 10, lineHeight: 14 }}>✕</Text>
            </View>
          </TouchableOpacity>
        )}

        {rightIcon && !canClear && (
          <View style={styles.iconRight}>{rightIcon}</View>
        )}
      </View>

      {(errorText || helperText) && (
        <Text
          style={[
            textStyles.captionMD,
            styles.helperText,
            { color: hasError ? colors.textDanger : colors.textSecondary },
          ]}
        >
          {errorText ?? helperText}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
  },
  label: {
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
  },
  iconLeft: {
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRight: {
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperText: {
    marginTop: 4,
  },
  clearIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
