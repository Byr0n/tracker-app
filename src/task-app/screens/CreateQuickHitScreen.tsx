import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../theme';
import { Header } from '../../components/organisms/Header';
import { FormField } from '../../components/molecules/FormField';
import { Button } from '../../components/atoms/Button';
import { Divider } from '../../components/atoms/Divider';
import { CollaboratorModal } from '../components/CollaboratorModal';
import { useTasks } from '../store/TaskContext';
import { useNavigation } from '../navigation/NavigationContext';
import { Collaborator } from '../types';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function CreateQuickHitScreen() {
  const { colors } = useTheme();
  const { addQuickHit } = useTasks();
  const { goBack } = useNavigation();

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [titleError, setTitleError] = useState('');

  const handleCreate = () => {
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    addQuickHit({
      title: title.trim(),
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : undefined,
      completed: false,
      collaborators,
    });
    goBack();
  };

  const dueDateLabel = dueDate
    ? dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Set due date';

  const collabLabel =
    collaborators.length > 0
      ? `${collaborators.length} collaborator${collaborators.length !== 1 ? 's' : ''} added`
      : 'Add collaborators';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <Header title="New Quick Hit" leftAction={{ label: '← Cancel', onPress: goBack }} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormField
          label="Task"
          value={title}
          onChangeText={val => {
            setTitle(val);
            setTitleError('');
          }}
          placeholder="What needs to get done?"
          errorText={titleError}
          required
        />

        <Divider style={styles.divider} />

        {/* Due date */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Due Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(!showDatePicker)}
          style={[
            styles.selectButton,
            {
              backgroundColor: dueDate ? colors.bgBrand + '22' : colors.bgSecondary,
              borderColor: dueDate ? colors.borderBrand : colors.borderDefault,
            },
          ]}
        >
          <Text style={{ color: dueDate ? colors.textBrand : colors.textSecondary, fontSize: 15 }}>
            📅  {dueDateLabel}
          </Text>
        </TouchableOpacity>

        {dueDate && (
          <Button
            label="Clear due date"
            variant="ghost"
            size="sm"
            onPress={() => {
              setDueDate(null);
              setShowDatePicker(false);
            }}
            style={styles.clearBtn}
          />
        )}

        {showDatePicker && (
          <DateTimePicker
            value={dueDate ?? new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(_, date) => {
              if (Platform.OS === 'android') setShowDatePicker(false);
              if (date) setDueDate(date);
            }}
          />
        )}

        <Divider style={styles.divider} />

        {/* Collaborators */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Collaborators</Text>
        <TouchableOpacity
          onPress={() => setShowCollabModal(true)}
          style={[
            styles.selectButton,
            {
              backgroundColor:
                collaborators.length > 0 ? colors.bgBrand + '22' : colors.bgSecondary,
              borderColor:
                collaborators.length > 0 ? colors.borderBrand : colors.borderDefault,
            },
          ]}
        >
          <Text
            style={{
              color: collaborators.length > 0 ? colors.textBrand : colors.textSecondary,
              fontSize: 15,
            }}
          >
            👥  {collabLabel}
          </Text>
        </TouchableOpacity>

        <Button
          label="Create Quick Hit"
          variant="primary"
          fullWidth
          onPress={handleCreate}
          style={styles.createBtn}
        />
      </ScrollView>

      <CollaboratorModal
        visible={showCollabModal}
        collaborators={collaborators}
        onClose={() => setShowCollabModal(false)}
        onAdd={contact => setCollaborators(prev => [...prev, { id: generateId(), contact }])}
        onRemove={id => setCollaborators(prev => prev.filter(c => c.id !== id))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  divider: { marginVertical: 20 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  selectButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearBtn: { marginTop: 8 },
  createBtn: { marginTop: 32 },
});
