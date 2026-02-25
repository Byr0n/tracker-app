import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  labelStyle,
}: ButtonProps) {
  const { colors, radii, space, textStyles } = useTheme();

  const isDisabled = disabled || loading;

  const containerStyles = StyleSheet.flatten([
    styles.base,
    {
      borderRadius: radii.md,
      alignSelf: fullWidth ? 'stretch' as const : 'flex-start' as const,
      opacity: isDisabled ? 0.5 : 1,
    },
    sizeContainerStyles(size, space),
    variantContainerStyles(variant, colors),
    style,
  ]);

  const textColor = getTextColor(variant, colors);

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text
          style={[
            textStyles.labelMD,
            { color: textColor },
            labelStyle,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

function sizeContainerStyles(size: ButtonSize, space: ReturnType<typeof useTheme>['space']) {
  switch (size) {
    case 'sm':
      return { paddingHorizontal: space.sm, paddingVertical: space.xs, minHeight: 32 };
    case 'lg':
      return { paddingHorizontal: space.lg, paddingVertical: space.md, minHeight: 52 };
    default:
      return { paddingHorizontal: space.md, paddingVertical: space.sm, minHeight: 44 };
  }
}

function variantContainerStyles(
  variant: ButtonVariant,
  colors: ReturnType<typeof useTheme>['colors'],
): ViewStyle {
  switch (variant) {
    case 'secondary':
      return {
        backgroundColor: colors.interactiveSecondary,
        borderWidth: 1,
        borderColor: colors.borderDefault,
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
      };
    case 'destructive':
      return {
        backgroundColor: colors.interactiveDanger,
      };
    default:
      return {
        backgroundColor: colors.interactivePrimary,
      };
  }
}

function getTextColor(
  variant: ButtonVariant,
  colors: ReturnType<typeof useTheme>['colors'],
): string {
  switch (variant) {
    case 'secondary':
      return colors.textPrimary;
    case 'ghost':
      return colors.textBrand;
    default:
      return colors.textInverse;
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
