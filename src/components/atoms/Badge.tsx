import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface BadgeProps {
  label?: string;
  count?: number;
  variant?: BadgeVariant;
  dot?: boolean;       // show a small dot without any text
  maxCount?: number;
  style?: StyleProp<ViewStyle>;
}

export function Badge({
  label,
  count,
  variant = 'default',
  dot = false,
  maxCount = 99,
  style,
}: BadgeProps) {
  const { colors, radii, textStyles } = useTheme();

  const bg = getBgColor(variant, colors);
  const fg = getFgColor(variant, colors);

  if (dot) {
    return (
      <View
        style={[
          styles.dot,
          { backgroundColor: bg, borderRadius: radii.full },
          style,
        ]}
        accessibilityRole="none"
      />
    );
  }

  const displayText = label ?? (count !== undefined ? formatCount(count, maxCount) : '');
  if (!displayText) return null;

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: bg,
          borderRadius: radii.full,
          paddingHorizontal: displayText.length === 1 ? 6 : 8,
        },
        style,
      ]}
      accessibilityLabel={`${displayText} notifications`}
    >
      <Text style={[textStyles.labelSM, { color: fg }]}>{displayText}</Text>
    </View>
  );
}

function formatCount(count: number, max: number): string {
  if (count <= 0) return '';
  if (count > max) return `${max}+`;
  return String(count);
}

function getBgColor(
  variant: BadgeVariant,
  colors: ReturnType<typeof useTheme>['colors'],
): string {
  switch (variant) {
    case 'success': return colors.statusOnline;
    case 'warning': return colors.statusAway;
    case 'danger': return colors.statusDnd;
    case 'info': return colors.textLink;
    case 'neutral': return colors.bgTertiary;
    default: return colors.interactivePrimary;
  }
}

function getFgColor(
  variant: BadgeVariant,
  colors: ReturnType<typeof useTheme>['colors'],
): string {
  if (variant === 'neutral') return colors.textSecondary;
  return colors.textInverse;
}

// Notification dot — small standalone indicator
export interface NotificationDotProps {
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function NotificationDot({ color, size = 8, style }: NotificationDotProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color ?? colors.statusDnd,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
  },
  pill: {
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
