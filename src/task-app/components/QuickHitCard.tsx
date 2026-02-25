import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { QuickHit } from '../types';

interface QuickHitCardProps {
  quickHit: QuickHit;
  onToggle: () => void;
  onPress: () => void;
}

export function QuickHitCard({ quickHit, onToggle, onPress }: QuickHitCardProps) {
  const { colors } = useTheme();

  const dueLabel = quickHit.dueDate
    ? new Date(quickHit.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  const isPastDue =
    quickHit.dueDate && !quickHit.completed && new Date(quickHit.dueDate + 'T00:00:00') < new Date();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.row,
        {
          backgroundColor: colors.surfaceDefault,
          borderColor: colors.borderSubtle,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onToggle}
        style={[
          styles.checkbox,
          {
            borderColor: quickHit.completed ? colors.statusOnline : colors.borderDefault,
            backgroundColor: quickHit.completed ? colors.statusOnline : 'transparent',
          },
        ]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityLabel={quickHit.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {quickHit.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: quickHit.completed ? colors.textTertiary : colors.textPrimary,
              textDecorationLine: quickHit.completed ? 'line-through' : 'none',
            },
          ]}
        >
          {quickHit.title}
        </Text>
        {(dueLabel || quickHit.collaborators.length > 0) && (
          <View style={styles.meta}>
            {dueLabel ? (
              <Text
                style={[
                  styles.metaText,
                  { color: isPastDue ? colors.textDanger : colors.textTertiary },
                ]}
              >
                {dueLabel}
              </Text>
            ) : null}
            {quickHit.collaborators.length > 0 ? (
              <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                {dueLabel ? '  ·  ' : ''}👥 {quickHit.collaborators.length}
              </Text>
            ) : null}
          </View>
        )}
      </View>

      <Text style={[styles.chevron, { color: colors.textTertiary }]}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: '500', lineHeight: 20 },
  meta: { flexDirection: 'row', marginTop: 3 },
  metaText: { fontSize: 13 },
  chevron: { fontSize: 20, fontWeight: '300' },
});
