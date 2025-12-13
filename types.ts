export type ViewState = 'dashboard' | 'tasks' | 'calendar' | 'focus' | 'profile' | 'aitools';

export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
  priority: Priority;
  subTasks?: { id: string; title: string; completed: boolean }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'exam' | 'study' | 'assignment';
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
}

export interface QuizResult {
  questions: QuizQuestion[];
  score: number;
  completed: boolean;
}

export interface UserStats {
  name: string;
  streak: number;
  tasksCompleted: number;
  focusHours: number;
  subjectsMastered: number;
  productivity: number; // percentage
  xp: number;
}