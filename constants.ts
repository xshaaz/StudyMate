import { Priority, Task, CalendarEvent, UserStats } from './types';

export const INITIAL_USER: UserStats = {
  name: 'Rahul',
  streak: 7,
  tasksCompleted: 42,
  focusHours: 12.5,
  subjectsMastered: 3,
  productivity: 40,
  xp: 1250,
};

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Finish Math Assignment',
    subject: 'Math',
    dueDate: '2025-10-15',
    completed: false,
    priority: Priority.High,
  },
  {
    id: '2',
    title: 'Read Chapter 4 of History',
    subject: 'History',
    dueDate: '2025-10-16',
    completed: false,
    priority: Priority.Medium,
  },
  {
    id: '3',
    title: 'Lab Report for Chemistry',
    subject: 'Chemistry',
    dueDate: '2025-10-28',
    completed: true,
    priority: Priority.High,
  },
  {
    id: '4',
    title: 'Outline English Essay',
    subject: 'English',
    dueDate: '2025-10-29',
    completed: false,
    priority: Priority.Low,
  },
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Math Midterm', date: '2025-10-15', type: 'exam', color: 'bg-red-500' },
  { id: '2', title: 'Study Group', date: '2025-10-18', type: 'study', color: 'bg-blue-500' },
  { id: '3', title: 'History Essay', date: '2025-10-22', type: 'assignment', color: 'bg-green-500' },
];

export const MOCK_QUIZ_JSON = `
[
  {
    "id": 1,
    "question": "What is the SI unit of Force?",
    "options": ["Pascal", "Joule", "Newton", "Watt"],
    "correctAnswer": 2
  },
  {
    "id": 2,
    "question": "Which of these is a scalar quantity?",
    "options": ["Velocity", "Displacement", "Force", "Speed"],
    "correctAnswer": 3
  },
  {
    "id": 3,
    "question": "What is the acceleration due to gravity on Earth (approx)?",
    "options": ["9.8 m/s^2", "10.5 m/s^2", "8.9 m/s^2", "12 m/s^2"],
    "correctAnswer": 0
  }
]
`;