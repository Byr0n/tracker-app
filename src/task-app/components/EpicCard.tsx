import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Card } from '../../components/atoms/Card';
import { Epic } from '../types';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';

interface EpicCardProps {
  epic: Epic;
  onPress: () => void;
}

export function EpicCard({ epic, onPress }: EpicCardProps) {
  const { colors } = useTheme();

  const completedCount = epic.subTasks.filter(s => s.status === 'completed').length;
  const totalCount = epic.subTasks.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const dueLabel = epic.dueDate
    ? new Date(epic.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const isPastDue =
    epic.dueDate &&
    epic.status !== 'completed' &&
    new Date(epic.dueDate + 'T00:00:00') < new Date();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card elevation="sm" style={styles.card}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
            {epic.title}
          </Text>
          <StatusBadge status={epic.status} />
        </View>

        {epic.description ? (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {epic.description}
          </Text>
        ) : null}

        {totalCount > 0 && (
          <View style={styles.progressSection}>
            <ProgressBar progress={progress} showLabel={false} />
            <Text style={[styles.subtaskMeta, { color: colors.textTertiary }]}>
              {completedCount}/{totalCount} subtasks complete
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          {dueLabel ? (
            <Text style={[styles.meta, { color: isPastDue ? colors.textDanger : colors.textSecondary }]}>
              📅 {dueLabel}{isPastDue ? '  ·  Overdue' : ''}
            </Text>
          ) : null}
          {epic.collaborators.length > 0 ? (
            <Text style={[styles.meta, { color: colors.textTertiary }]}>
              👥 {epic.collaborators.length}
            </Text>
          ) : null}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  progressSection: {
    marginBottom: 12,
  },
  subtaskMeta: {
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    fontSize: 13,
  },
});
