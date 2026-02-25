import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface ProgressBarProps {
  progress: number; // 0–1
  showLabel?: boolean;
}

export function ProgressBar({ progress, showLabel = true }: ProgressBarProps) {
  const { colors, radii } = useTheme();
  const pct = Math.round(Math.min(Math.max(progress, 0), 1) * 100);
  const isComplete = pct === 100;

  return (
    <View>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Progress</Text>
          <Text style={[styles.pct, { color: isComplete ? colors.textSuccess : colors.textBrand }]}>
            {pct}%
          </Text>
        </View>
      )}
      <View style={[styles.track, { backgroundColor: colors.bgTertiary, borderRadius: radii.full }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${pct}%`,
              backgroundColor: isComplete ? colors.statusOnline : colors.interactivePrimary,
              borderRadius: radii.full,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: { fontSize: 13 },
  pct: { fontSize: 13, fontWeight: '600' },
  track: { height: 8, overflow: 'hidden' },
  fill: { height: '100%' },
});
