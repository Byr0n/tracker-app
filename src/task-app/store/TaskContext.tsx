import React, { createContext, useContext, useState } from 'react';
import { Epic, QuickHit, SubTask, Collaborator, TaskStatus } from '../types';

interface TaskContextType {
  epics: Epic[];
  quickHits: QuickHit[];
  addEpic: (epic: Omit<Epic, 'id' | 'createdAt'>) => string;
  updateEpic: (id: string, updates: Partial<Epic>) => void;
  deleteEpic: (id: string) => void;
  addSubTask: (epicId: string, title: string) => void;
  updateSubTask: (epicId: string, subTaskId: string, updates: Partial<SubTask>) => void;
  deleteSubTask: (epicId: string, subTaskId: string) => void;
  addQuickHit: (quickHit: Omit<QuickHit, 'id' | 'createdAt'>) => void;
  updateQuickHit: (id: string, updates: Partial<QuickHit>) => void;
  deleteQuickHit: (id: string) => void;
  addCollaboratorToEpic: (epicId: string, collaborator: Omit<Collaborator, 'id'>) => void;
  addCollaboratorToQuickHit: (quickHitId: string, collaborator: Omit<Collaborator, 'id'>) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

const SAMPLE_EPICS: Epic[] = [
  {
    id: 'e1',
    title: 'Launch Mobile App v2.0',
    description: 'Complete redesign and new feature rollout for the mobile app.',
    status: 'in_progress',
    dueDate: '2026-03-31',
    subTasks: [
      { id: 's1', title: 'Design new onboarding flow', status: 'completed' },
      { id: 's2', title: 'Implement dark mode', status: 'in_progress' },
      { id: 's3', title: 'Performance optimizations', status: 'not_started' },
      { id: 's4', title: 'Beta testing with 50 users', status: 'not_started' },
    ],
    collaborators: [
      { id: 'c1', contact: 'alex@company.com', name: 'Alex' },
      { id: 'c2', contact: '+1 555-0100', name: 'Jordan' },
    ],
    createdAt: '2026-02-01',
  },
  {
    id: 'e2',
    title: 'Q1 Marketing Campaign',
    description: 'Plan and execute the Q1 marketing push across all channels.',
    status: 'not_started',
    dueDate: '2026-03-15',
    subTasks: [
      { id: 's5', title: 'Define target audience', status: 'not_started' },
      { id: 's6', title: 'Create ad creatives', status: 'not_started' },
      { id: 's7', title: 'Set up analytics tracking', status: 'not_started' },
    ],
    collaborators: [],
    createdAt: '2026-02-10',
  },
];

const SAMPLE_QUICK_HITS: QuickHit[] = [
  {
    id: 'q1',
    title: 'Review open pull requests',
    dueDate: '2026-02-26',
    completed: false,
    collaborators: [],
    createdAt: '2026-02-25',
  },
  {
    id: 'q2',
    title: 'Update team standup notes',
    dueDate: '2026-02-25',
    completed: true,
    collaborators: [],
    createdAt: '2026-02-25',
  },
  {
    id: 'q3',
    title: 'Schedule 1:1 with design team',
    dueDate: '2026-02-28',
    completed: false,
    collaborators: [{ id: 'c3', contact: 'design@company.com' }],
    createdAt: '2026-02-24',
  },
];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [epics, setEpics] = useState<Epic[]>(SAMPLE_EPICS);
  const [quickHits, setQuickHits] = useState<QuickHit[]>(SAMPLE_QUICK_HITS);

  const addEpic = (data: Omit<Epic, 'id' | 'createdAt'>): string => {
    const id = generateId();
    setEpics(prev => [...prev, { ...data, id, createdAt: new Date().toISOString() }]);
    return id;
  };

  const updateEpic = (id: string, updates: Partial<Epic>) => {
    setEpics(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEpic = (id: string) => {
    setEpics(prev => prev.filter(e => e.id !== id));
  };

  const addSubTask = (epicId: string, title: string) => {
    setEpics(prev =>
      prev.map(e => {
        if (e.id !== epicId) return e;
        return {
          ...e,
          subTasks: [...e.subTasks, { id: generateId(), title, status: 'not_started' as TaskStatus }],
        };
      }),
    );
  };

  const updateSubTask = (epicId: string, subTaskId: string, updates: Partial<SubTask>) => {
    setEpics(prev =>
      prev.map(e => {
        if (e.id !== epicId) return e;
        return {
          ...e,
          subTasks: e.subTasks.map(s => (s.id === subTaskId ? { ...s, ...updates } : s)),
        };
      }),
    );
  };

  const deleteSubTask = (epicId: string, subTaskId: string) => {
    setEpics(prev =>
      prev.map(e => {
        if (e.id !== epicId) return e;
        return { ...e, subTasks: e.subTasks.filter(s => s.id !== subTaskId) };
      }),
    );
  };

  const addQuickHit = (data: Omit<QuickHit, 'id' | 'createdAt'>) => {
    setQuickHits(prev => [
      ...prev,
      { ...data, id: generateId(), createdAt: new Date().toISOString() },
    ]);
  };

  const updateQuickHit = (id: string, updates: Partial<QuickHit>) => {
    setQuickHits(prev => prev.map(q => (q.id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuickHit = (id: string) => {
    setQuickHits(prev => prev.filter(q => q.id !== id));
  };

  const addCollaboratorToEpic = (epicId: string, collab: Omit<Collaborator, 'id'>) => {
    setEpics(prev =>
      prev.map(e => {
        if (e.id !== epicId) return e;
        return { ...e, collaborators: [...e.collaborators, { ...collab, id: generateId() }] };
      }),
    );
  };

  const addCollaboratorToQuickHit = (quickHitId: string, collab: Omit<Collaborator, 'id'>) => {
    setQuickHits(prev =>
      prev.map(q => {
        if (q.id !== quickHitId) return q;
        return { ...q, collaborators: [...q.collaborators, { ...collab, id: generateId() }] };
      }),
    );
  };

  return (
    <TaskContext.Provider
      value={{
        epics,
        quickHits,
        addEpic,
        updateEpic,
        deleteEpic,
        addSubTask,
        updateSubTask,
        deleteSubTask,
        addQuickHit,
        updateQuickHit,
        deleteQuickHit,
        addCollaboratorToEpic,
        addCollaboratorToQuickHit,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks(): TaskContextType {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}
