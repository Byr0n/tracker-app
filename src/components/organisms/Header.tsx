import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: {
    label: string;
    icon?: React.ReactNode;
    onPress: () => void;
  };
  rightActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onPress: () => void;
  }>;
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Header({
  title,
  subtitle,
  leftAction,
  rightActions,
  transparent = false,
  style,
}: HeaderProps) {
  const { colors, space, textStyles, shadows } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: transparent ? 'transparent' : colors.bgBrand,
          paddingHorizontal: space.md,
          paddingTop: Platform.OS === 'android' ? space.md : space.sm,
          paddingBottom: space.sm,
        },
        !transparent && shadows.sm,
        style,
      ]}
    >
      {/* Left action */}
      <View style={styles.side}>
        {leftAction && (
          <TouchableOpacity
            onPress={leftAction.onPress}
            style={styles.actionButton}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            accessibilityLabel={leftAction.label}
          >
            {leftAction.icon ?? (
              <Text style={[textStyles.bodyMD, { color: colors.textInverse }]}>
                {leftAction.label}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Title */}
      <View style={styles.center}>
        <Text
          style={[textStyles.headingSM, { color: colors.textInverse }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[textStyles.captionMD, { color: colors.textInverse, opacity: 0.75 }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right actions */}
      <View style={[styles.side, styles.sideRight]}>
        {rightActions?.map((action, i) => (
          <TouchableOpacity
            key={i}
            onPress={action.onPress}
            style={[styles.actionButton, i > 0 && { marginLeft: space.sm }]}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            accessibilityLabel={action.label}
          >
            {action.icon ?? (
              <Text style={[textStyles.bodyMD, { color: colors.textInverse }]}>
                {action.label}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  side: {
    width: 80,
    justifyContent: 'center',
  },
  sideRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  actionButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
