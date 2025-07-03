export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'ideas' | 'todo' | 'inprogress' | 'completed';
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
  tags: string[];
  sharedWith: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  country?: string;
  avatar?: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: Date;
  totalTasks: number;
  completedTasks: number;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActiveDate: Date;
  weeklyProgress: boolean[];
}