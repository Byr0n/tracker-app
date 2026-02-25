import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Header } from '../../components/organisms/Header';
import { Button } from '../../components/atoms/Button';
import { EpicCard } from '../components/EpicCard';
import { QuickHitCard } from '../components/QuickHitCard';
import { useTasks } from '../store/TaskContext';
import { useNavigation } from '../navigation/NavigationContext';

type Tab = 'epics' | 'quickhits';

export function HomeScreen() {
  const { colors } = useTheme();
  const { epics, quickHits, updateQuickHit } = useTasks();
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<Tab>('epics');

  const activeEpics = epics.filter(e => e.status !== 'completed');
  const completedEpics = epics.filter(e => e.status === 'completed');
  const pendingHits = quickHits.filter(q => !q.completed);
  const completedHits = quickHits.filter(q => q.completed);

  const handleAdd = () => {
    navigate(activeTab === 'epics' ? 'CreateEpic' : 'CreateQuickHit');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <Header
        title="My Tasks"
        subtitle={
          activeTab === 'epics'
            ? `${activeEpics.length} active epic${activeEpics.length !== 1 ? 's' : ''}`
            : `${pendingHits.length} pending`
        }
        rightActions={[{ label: '+ Add', onPress: handleAdd }]}
      />

      {/* Tab bar */}
      <View style={[styles.tabBar, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.borderSubtle }]}>
        {(['epics', 'quickhits'] as Tab[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && {
                borderBottomColor: colors.interactivePrimary,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === tab ? colors.textBrand : colors.textSecondary },
              ]}
            >
              {tab === 'epics' ? 'Epics' : 'Quick Hits'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'epics' ? (
          epics.length === 0 ? (
            <EmptyState
              title="No epics yet"
              hint="Epics are large projects with sub-tasks, due dates, and progress tracking."
              actionLabel="Create Epic"
              onAction={() => navigate('CreateEpic')}
            />
          ) : (
            <>
              {activeEpics.map(epic => (
                <EpicCard
                  key={epic.id}
                  epic={epic}
                  onPress={() => navigate('EpicDetail', { epicId: epic.id })}
                />
              ))}
              {completedEpics.length > 0 && (
                <>
                  <SectionDivider label={`Completed (${completedEpics.length})`} />
                  {completedEpics.map(epic => (
                    <EpicCard
                      key={epic.id}
                      epic={epic}
                      onPress={() => navigate('EpicDetail', { epicId: epic.id })}
                    />
                  ))}
                </>
              )}
            </>
          )
        ) : quickHits.length === 0 ? (
          <EmptyState
            title="No quick hits yet"
            hint="Quick hits are small tasks you want to get done fast, with optional due dates."
            actionLabel="Create Quick Hit"
            onAction={() => navigate('CreateQuickHit')}
          />
        ) : (
          <>
            {pendingHits.map(qh => (
              <QuickHitCard
                key={qh.id}
                quickHit={qh}
                onToggle={() => updateQuickHit(qh.id, { completed: true })}
                onPress={() => navigate('CreateQuickHit')}
              />
            ))}
            {completedHits.length > 0 && (
              <>
                <SectionDivider label={`Done (${completedHits.length})`} />
                {completedHits.map(qh => (
                  <QuickHitCard
                    key={qh.id}
                    quickHit={qh}
                    onToggle={() => updateQuickHit(qh.id, { completed: false })}
                    onPress={() => navigate('CreateQuickHit')}
                  />
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function EmptyState({
  title,
  hint,
  actionLabel,
  onAction,
}: {
  title: string;
  hint: string;
  actionLabel: string;
  onAction: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.empty}>
      <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>{title}</Text>
      <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>{hint}</Text>
      <Button label={actionLabel} variant="primary" onPress={onAction} style={styles.emptyBtn} />
    </View>
  );
}

function SectionDivider({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionDivider}>
      <Text style={[styles.sectionDividerLabel, { color: colors.textTertiary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabel: { fontSize: 15, fontWeight: '600' },
  scroll: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 40 },
  empty: { alignItems: 'center', paddingTop: 56, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 17, fontWeight: '600', marginBottom: 8 },
  emptyHint: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  emptyBtn: { marginTop: 20 },
  sectionDivider: { paddingVertical: 8, paddingHorizontal: 4, marginBottom: 4 },
  sectionDividerLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
});
