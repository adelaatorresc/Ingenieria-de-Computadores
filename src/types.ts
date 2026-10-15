export type CourseId = '1' | '2' | '3' | '4';
export type SemesterId = '1' | '2';

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
  | 'analytics';

export interface NavState {
  view: ViewMode;
  courseId: CourseId | null;
  semesterId: SemesterId | null;
  subjectId: string | null;
  topicId: string | null;
  subtopicId: string | null;
  exerciseId: string | null;
  activeTab?: 'mindmap' | 'summary' | 'explanation' | 'exercises' | 'exam';
}
