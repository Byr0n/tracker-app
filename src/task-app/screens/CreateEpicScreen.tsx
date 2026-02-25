import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../theme';
import { Header } from '../../components/organisms/Header';
import { FormField } from '../../components/molecules/FormField';
import { Button } from '../../components/atoms/Button';
import { Divider } from '../../components/atoms/Divider';
import { useTasks } from '../store/TaskContext';
import { useNavigation } from '../navigation/NavigationContext';
import { TaskStatus } from '../types';

const STATUS_OPTIONS: Array<{ value: TaskStatus; label: string }> = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export function CreateEpicScreen() {
  const { colors } = useTheme();
  const { addEpic } = useTasks();
  const { goBack, navigate } = useNavigation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('not_started');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [titleError, setTitleError] = useState('');

  const handleCreate = () => {
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    const id = addEpic({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : undefined,
      subTasks: [],
      collaborators: [],
    });
    navigate('EpicDetail', { epicId: id });
  };

  const dueDateLabel = dueDate
    ? dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Set due date';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <Header title="New Epic" leftAction={{ label: '← Cancel', onPress: goBack }} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormField
          label="Title"
          value={title}
          onChangeText={val => {
            setTitle(val);
            setTitleError('');
          }}
          placeholder="e.g. Launch Mobile App v2.0"
          errorText={titleError}
          required
        />

        <FormField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Describe this epic (optional)"
          multiline
          numberOfLines={4}
          style={styles.fieldSpacing}
        />

        <Divider style={styles.divider} />

        {/* Status selector */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Status</Text>
        <View style={styles.statusRow}>
          {STATUS_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setStatus(opt.value)}
              style={[
                styles.statusChip,
                {
                  backgroundColor:
                    status === opt.value ? colors.interactivePrimary : colors.bgSecondary,
                  borderColor:
                    status === opt.value ? colors.interactivePrimary : colors.borderDefault,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusChipLabel,
                  {
                    color: status === opt.value ? colors.textInverse : colors.textPrimary,
                  },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Divider style={styles.divider} />

        {/* Due date */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Due Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(!showDatePicker)}
          style={[
            styles.dateButton,
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
            minimumDate={new Date()}
            onChange={(_, date) => {
              if (Platform.OS === 'android') setShowDatePicker(false);
              if (date) setDueDate(date);
            }}
          />
        )}

        <Button
          label="Create Epic"
          variant="primary"
          fullWidth
          onPress={handleCreate}
          style={styles.createBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  fieldSpacing: { marginTop: 16 },
  divider: { marginVertical: 20 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusChipLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearBtn: { marginTop: 8 },
  createBtn: { marginTop: 32 },
});
