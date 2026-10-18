export type CourseId = '1' | '2' | '3' | '4';
export type SemesterId = '1' | '2';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'exercises' | 'time' | 'subject' | 'milestone';
  targetValue: number;
  unlockedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  avatarColor?: string;
  selectedCourseId: CourseId;
  createdAt: string;
  isRegistered?: boolean;
  currentStreak?: number;
  longestStreak?: number;
  lastActiveDate?: string;
  xp?: number;
  level?: number;
  unlockedBadgeIds?: string[];
}

export interface CookieConsent {
  accepted: boolean;
  functional: boolean; // Always true for session and exercise tracking
  preferences: boolean; // Theme, pomodoro, study plans
  analytics: boolean; // Study time analytics
  timestamp: string;
}

export interface ExamEvent {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  courseId?: CourseId;
  semesterId?: SemesterId;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  buildingBlock: string; // ej: "Bloque 1", "Bloque 4 (Aulas)"
  classroom: string; // ej: "Aula 1002", "Lab 2.3"
  topicsCovered: string[]; // List of topic titles
  weightPercentage: number; // e.g. 35
  notes?: string;
  completed?: boolean;
  score?: number;
}



export interface StudyDaySchedule {
  dayNumber: number;
  date: string;
  topicTitle: string;
  targetMinutes: number;
  completed: boolean;
  completedMinutes?: number;
  notes: string;
}

export interface StudyPlan {
  id: string;
  examId: string;
  examTitle: string;
  subjectId: string;
  subjectName: string;
  topicIds: string[];
  topicTitles: string[];
  examDate: string;
  dailyMinutes: number;
  reminderTime: string; // e.g. "17:30"
  reminderEnabled: boolean;
  schedule: StudyDaySchedule[];
  createdAt: string;
}

export interface GradeItem {
  id: string;
  title: string;
  weightPercent: number; // e.g. 30 for 30%
  score: number; // 0 to 10
}

export interface SubjectGradeRecord {
  subjectId: string;
  items: GradeItem[];
}

export interface PomodoroInterval {
  id: string;
  label: string;
  durationMinutes: number;
  type: 'work' | 'short_break' | 'long_break';
}

export interface Flashcard {
  id: string;
  subjectName?: string;
  topicTitle?: string;
  front: string;
  back: string;
  subtopicTitle?: string;
  formula?: string;
  examTip?: string;
  learned: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  difficulty: 'fácil' | 'medio' | 'avanzado' | 'examen';
  statement: string;
  hints?: string[];
  solution: {
    finalAnswer: string;
    stepByStep: string[];
    theoreticalNote?: string;
    codeSnippet?: string;
  };
}

export interface SubTopic {
  id: string;
  title: string;
  summary: string;
  explanation: string;
  simplifiedExplanation?: string;
  keyFormulas?: string[];
  examples?: string[];
  examTips?: string[];
  mindMapNodes?: {
    id: string;
    label: string;
    description: string;
    children?: string[];
  }[];
}

export interface Topic {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  subtopics: SubTopic[];
  exercises: Exercise[];
  examQuestions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    points: number;
  }[];
  practicalExamProblems: Exercise[];
  summaryPoints?: string[];
  mindMapNodes?: any[];
}

export interface Subject {
  id: string;
  name: string;
  shortName: string;
  code: string;
  ects: number;
  color: string;
  description: string;
  topics: Topic[];
}

export interface Semester {
  id: SemesterId;
  name: string;
  subjects: Subject[];
}

export interface Course {
  id: CourseId;
  name: string;
  semesters: Semester[];
}

export interface UploadedDocument {
  id: string;
  name: string;
  fileType: 'pdf' | 'text' | 'markdown' | 'image';
  dataUrl?: string; // base64 data for fallback
  fileUrl?: string; // direct HTTP URL from server e.g. /api/documents/:id/file
  textContent?: string;
  courseId: CourseId;
  semesterId: SemesterId;
  subjectId: string;
  topicId?: string;
  uploadedAt: string;
  sizeBytes: number;
}

export type ViewMode =
  | 'welcome'
  | 'courses'
  | 'subject'
  | 'topic_menu'
  | 'mind_map'
  | 'summary'
  | 'explanation'
  | 'exercises_list'
  | 'exercise_solver'
  | 'exam_simulation'
  | 'analytics'
  | 'flashcards'
  | 'pomodoro'
  | 'grades'
  | 'profile'
  | 'custom_exam'
  | 'ai_tutor_page'
  | 'exam_calendar'
  | 'study_planner'
  | 'ai_exam_simulator'
  | 'document_viewer';

export interface NavState {
  view: ViewMode;
  courseId: CourseId | null;
  semesterId: SemesterId | null;
  subjectId: string | null;
  topicId: string | null;
  subtopicId: string | null;
  exerciseId: string | null;
  documentId?: string | null;
  splitScreenTutor?: boolean;
  activeTab?: 'mindmap' | 'summary' | 'explanation' | 'exercises' | 'exam' | 'flashcards';
}
