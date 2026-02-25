import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export interface DividerProps {
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
}

export function Divider({ label, orientation = 'horizontal', style }: DividerProps) {
  const { colors, space, textStyles } = useTheme();

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.vertical,
          { backgroundColor: colors.borderDefault },
          style,
        ]}
      />
    );
  }

  if (label) {
    return (
      <View style={[styles.labeledRow, style]}>
        <View style={[styles.line, { backgroundColor: colors.borderDefault }]} />
        <Text
          style={[
            textStyles.captionSM,
            styles.labelText,
            {
              color: colors.textTertiary,
              marginHorizontal: space.sm,
            },
          ]}
        >
          {label}
        </Text>
        <View style={[styles.line, { backgroundColor: colors.borderDefault }]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.horizontal,
        { backgroundColor: colors.borderDefault },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
  labeledRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  labelText: {
    textTransform: 'uppercase',
  },
});
