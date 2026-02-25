import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { SubTask, TaskStatus } from '../types';

const STATUS_CYCLE: TaskStatus[] = ['not_started', 'in_progress', 'completed'];

interface SubTaskItemProps {
  subTask: SubTask;
  onStatusChange: (status: TaskStatus) => void;
  onDelete: () => void;
}

export function SubTaskItem({ subTask, onStatusChange, onDelete }: SubTaskItemProps) {
  const { colors } = useTheme();

  const cycleStatus = () => {
    const idx = STATUS_CYCLE.indexOf(subTask.status);
    onStatusChange(STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]);
  };

  const dotColor =
    subTask.status === 'completed'
      ? colors.statusOnline
      : subTask.status === 'in_progress'
        ? colors.interactivePrimary
        : colors.borderDefault;

  const dotBorder = subTask.status === 'not_started' ? 2 : 0;

  return (
    <View style={[styles.row, { borderBottomColor: colors.borderSubtle }]}>
      <TouchableOpacity
        onPress={cycleStatus}
        style={[
          styles.dot,
          {
            backgroundColor: dotColor,
            borderWidth: dotBorder,
            borderColor: colors.borderDefault,
          },
        ]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel={`Toggle subtask status: ${subTask.status}`}
      />
      <Text
        style={[
          styles.title,
          {
            color: subTask.status === 'completed' ? colors.textTertiary : colors.textPrimary,
            textDecorationLine: subTask.status === 'completed' ? 'line-through' : 'none',
          },
        ]}
      >
        {subTask.title}
      </Text>
      <TouchableOpacity
        onPress={onDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Delete subtask"
      >
        <Text style={[styles.deleteBtn, { color: colors.textTertiary }]}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  deleteBtn: {
    fontSize: 20,
    lineHeight: 22,
  },
});
