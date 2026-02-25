import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { TaskStatus } from '../types';

const STATUS_CONFIG: Record<TaskStatus, { label: string; type: 'neutral' | 'info' | 'success' }> = {
  not_started: { label: 'Not Started', type: 'neutral' },
  in_progress: { label: 'In Progress', type: 'info' },
  completed: { label: 'Completed', type: 'success' },
};

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { colors } = useTheme();
  const { label, type } = STATUS_CONFIG[status];

  const bgColor =
    type === 'neutral'
      ? colors.bgTertiary
      : type === 'info'
        ? colors.bgBrand + '33'
        : colors.statusOnline + '22';

  const textColor =
    type === 'neutral'
      ? colors.textSecondary
      : type === 'info'
        ? colors.textBrand
        : colors.textSuccess;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  label: { fontSize: 12, fontWeight: '600' },
});
