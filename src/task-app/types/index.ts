export type TaskStatus = 'not_started' | 'in_progress' | 'completed';

export interface Collaborator {
  id: string;
  contact: string; // email or phone number
  name?: string;
}

export interface SubTask {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface Epic {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string; // ISO date string YYYY-MM-DD
  subTasks: SubTask[];
  collaborators: Collaborator[];
  createdAt: string;
}

export interface QuickHit {
  id: string;
  title: string;
  dueDate?: string; // ISO date string YYYY-MM-DD
  completed: boolean;
  collaborators: Collaborator[];
  createdAt: string;
}

export type Screen = 'Home' | 'EpicDetail' | 'CreateEpic' | 'CreateQuickHit';

export interface NavigationState {
  screen: Screen;
  params?: {
    epicId?: string;
  };
}
