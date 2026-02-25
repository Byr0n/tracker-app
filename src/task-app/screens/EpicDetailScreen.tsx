import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Header } from '../../components/organisms/Header';
import { ActionSheet } from '../../components/organisms/ActionSheet';
import { Divider } from '../../components/atoms/Divider';
import { ProgressBar } from '../components/ProgressBar';
import { StatusBadge } from '../components/StatusBadge';
import { SubTaskItem } from '../components/SubTaskItem';
import { CollaboratorModal } from '../components/CollaboratorModal';
import { useTasks } from '../store/TaskContext';
import { useNavigation } from '../navigation/NavigationContext';
import { TaskStatus } from '../types';

interface EpicDetailScreenProps {
  epicId: string;
}

export function EpicDetailScreen({ epicId }: EpicDetailScreenProps) {
  const { colors } = useTheme();
  const { epics, updateEpic, deleteEpic, addSubTask, updateSubTask, deleteSubTask, addCollaboratorToEpic } =
    useTasks();
  const { goBack } = useNavigation();

  const [showCollabModal, setShowCollabModal] = useState(false);
  const [showStatusSheet, setShowStatusSheet] = useState(false);
  const [newSubTaskText, setNewSubTaskText] = useState('');

  const epic = epics.find(e => e.id === epicId);
  if (!epic) return null;

  const completedCount = epic.subTasks.filter(s => s.status === 'completed').length;
  const totalCount = epic.subTasks.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const dueLabel = epic.dueDate
    ? new Date(epic.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const isPastDue =
    epic.dueDate && epic.status !== 'completed' && new Date(epic.dueDate + 'T00:00:00') < new Date();

  const handleAddSubTask = () => {
    const trimmed = newSubTaskText.trim();
    if (!trimmed) return;
    addSubTask(epicId, trimmed);
    setNewSubTaskText('');
  };

  const handleDeleteEpic = () => {
    Alert.alert('Delete Epic', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteEpic(epicId);
          goBack();
        },
      },
    ]);
  };

  const handleRemoveCollaborator = (id: string) => {
    updateEpic(epicId, {
      collaborators: epic.collaborators.filter(c => c.id !== id),
    });
  };

  const statusActions: Array<{ label: string; onPress: () => void }> = (
    ['not_started', 'in_progress', 'completed'] as TaskStatus[]
  ).map(s => ({
    label: s === 'not_started' ? 'Not Started' : s === 'in_progress' ? 'In Progress' : 'Completed',
    onPress: () => {
      updateEpic(epicId, { status: s });
      setShowStatusSheet(false);
    },
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <Header
        title="Epic"
        leftAction={{ label: '← Back', onPress: goBack }}
        rightActions={[{ label: 'Delete', onPress: handleDeleteEpic }]}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title + status */}
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{epic.title}</Text>
          <TouchableOpacity onPress={() => setShowStatusSheet(true)}>
            <StatusBadge status={epic.status} />
          </TouchableOpacity>
        </View>

        {epic.description ? (
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {epic.description}
          </Text>
        ) : null}

        {dueLabel ? (
          <Text style={[styles.dueDate, { color: isPastDue ? colors.textDanger : colors.textSecondary }]}>
            📅 Due {dueLabel}{isPastDue ? '  ·  Overdue' : ''}
          </Text>
        ) : null}

        <Divider style={styles.divider} />

        {/* Progress */}
        <ProgressBar progress={progress} />

        <Divider style={styles.divider} />

        {/* Sub-tasks */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Sub-tasks{totalCount > 0 ? ` (${completedCount}/${totalCount})` : ''}
        </Text>

        {epic.subTasks.map(sub => (
          <SubTaskItem
            key={sub.id}
            subTask={sub}
            onStatusChange={status => updateSubTask(epicId, sub.id, { status })}
            onDelete={() => deleteSubTask(epicId, sub.id)}
          />
        ))}

        <View
          style={[
            styles.addSubTaskRow,
            { borderTopColor: colors.borderSubtle, borderTopWidth: epic.subTasks.length > 0 ? 1 : 0 },
          ]}
        >
          <TextInput
            value={newSubTaskText}
            onChangeText={setNewSubTaskText}
            placeholder="Add a sub-task…"
            placeholderTextColor={colors.textTertiary}
            style={[styles.addSubTaskInput, { color: colors.textPrimary }]}
            returnKeyType="done"
            onSubmitEditing={handleAddSubTask}
          />
          <TouchableOpacity
            onPress={handleAddSubTask}
            disabled={!newSubTaskText.trim()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text
              style={{
                color: newSubTaskText.trim() ? colors.textBrand : colors.textDisabled,
                fontWeight: '600',
                fontSize: 15,
              }}
            >
              Add
            </Text>
          </TouchableOpacity>
        </View>

        <Divider style={styles.divider} />

        {/* Collaborators */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Collaborators
            {epic.collaborators.length > 0 ? ` (${epic.collaborators.length})` : ''}
          </Text>
          <TouchableOpacity onPress={() => setShowCollabModal(true)}>
            <Text style={{ color: colors.textBrand, fontWeight: '600', fontSize: 14 }}>
              Manage
            </Text>
          </TouchableOpacity>
        </View>

        {epic.collaborators.length > 0 ? (
          epic.collaborators.map(c => (
            <View
              key={c.id}
              style={[styles.collabRow, { borderBottomColor: colors.borderSubtle }]}
            >
              <View style={[styles.collabAvatar, { backgroundColor: colors.bgBrand }]}>
                <Text style={styles.collabInitial}>{c.contact[0].toUpperCase()}</Text>
              </View>
              <Text style={[styles.collabContact, { color: colors.textPrimary }]}>
                {c.contact}
              </Text>
            </View>
          ))
        ) : (
          <TouchableOpacity onPress={() => setShowCollabModal(true)}>
            <Text style={[styles.invitePrompt, { color: colors.textTertiary }]}>
              + Invite collaborators by email or phone
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <ActionSheet
        visible={showStatusSheet}
        onClose={() => setShowStatusSheet(false)}
        title="Change Status"
        actions={statusActions}
      />

      <CollaboratorModal
        visible={showCollabModal}
        collaborators={epic.collaborators}
        onClose={() => setShowCollabModal(false)}
        onAdd={contact => addCollaboratorToEpic(epicId, { contact })}
        onRemove={handleRemoveCollaborator}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  dueDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  divider: { marginVertical: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addSubTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    gap: 12,
  },
  addSubTaskInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 4,
  },
  collabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 12,
  },
  collabAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collabInitial: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  collabContact: { flex: 1, fontSize: 15 },
  invitePrompt: { fontSize: 14, paddingVertical: 8 },
});
