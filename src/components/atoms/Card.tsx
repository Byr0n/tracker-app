import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { ShadowKey } from '../../tokens/shadows';

export type CardElevation = 'none' | 'xs' | 'sm' | 'md' | 'lg';

export interface CardProps {
  children: React.ReactNode;
  elevation?: CardElevation;
  padding?: number;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, elevation = 'sm', padding, style }: CardProps) {
  const { colors, radii, space, shadows } = useTheme();

  const shadowKey = elevation as ShadowKey;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceRaised,
          borderRadius: radii.lg,
          padding: padding ?? space.md,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.borderSubtle,
        },
        shadows[shadowKey],
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
  },
});
