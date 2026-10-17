import { Badge } from '../types';

export interface LevelInfo {
  level: number;
  title: string;
  minXP: number;
  nextXP: number;
  progressPercent: number;
  currentLevelXP: number;
  neededLevelXP: number;
}

export const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Novato ETSISI', minXP: 0, nextXP: 250 },
  { level: 2, title: 'Iniciado en Computadores', minXP: 250, nextXP: 600 },
  { level: 3, title: 'Algoritmista de Primer Año', minXP: 600, nextXP: 1200 },
  { level: 4, title: 'Maestro del Silicio', minXP: 1200, nextXP: 2200 },
  { level: 5, title: 'Experto en Arquitecturas', minXP: 2200, nextXP: 3800 },
  { level: 6, title: 'Teórico de Grafos y Discreta', minXP: 3800, nextXP: 6000 },
  { level: 7, title: 'Titán del Análisis Matemático', minXP: 6000, nextXP: 9000 },
  { level: 8, title: 'Hacker de Sistemas UPM', minXP: 9000, nextXP: 13500 },
  { level: 9, title: 'Ingeniero Superior 61CI', minXP: 13500, nextXP: 20000 },
  { level: 10, title: 'Leyenda del Campus Sur', minXP: 20000, nextXP: 30000 }
];

export const ALL_BADGES: Badge[] = [
  {
    id: 'badge-first-step',
    name: 'Primer Paso',
    description: 'Completa tu primer ejercicio con éxito',
    icon: 'Sparkles',
    category: 'exercises',
    targetValue: 1
  },
  {
    id: 'badge-streak-3',
    name: 'Hábito Forjado',
    description: 'Mantén una racha de estudio de 3 días consecutivos',
    icon: 'Flame',
    category: 'streak',
    targetValue: 3
  },
  {
    id: 'badge-streak-7',
    name: 'Semana Imparable',
    description: 'Alcanza una racha legendaria de 7 días seguidos',
    icon: 'Flame',
    category: 'streak',
    targetValue: 7
  },
  {
    id: 'badge-streak-14',
    name: 'Constancia ETSISI',
    description: 'Consigue 14 días de racha de estudio continuo',
    icon: 'Flame',
    category: 'streak',
    targetValue: 14
  },
  {
    id: 'badge-time-1h',
    name: 'Foco de Hierro',
    description: 'Acumula más de 1 hora (60 minutos) de estudio efectivo',
    icon: 'Clock',
    category: 'time',
    targetValue: 3600
  },
  {
    id: 'badge-time-5h',
    name: 'Maratón Académico',
    description: 'Supera las 5 horas de estudio acumuladas',
    icon: 'Timer',
    category: 'time',
    targetValue: 18000
  },
  {
    id: 'badge-exercises-5',
    name: 'Práctica Constante',
    description: 'Resuelve 5 problemas o ejercicios del temario',
    icon: 'CheckCircle2',
    category: 'exercises',
    targetValue: 5
  },
  {
    id: 'badge-exercises-15',
    name: 'Resolutor Maestro',
    description: 'Resuelve 15 ejercicios del grado de computadores',
    icon: 'Award',
    category: 'exercises',
    targetValue: 15
  },
  {
    id: 'badge-fc-master',
    name: 'Cerebro Binario',
    description: 'Completa al menos 3 ejercicios de Fundamentos de Computadores',
    icon: 'Cpu',
    category: 'subject',
    targetValue: 3
  },
  {
    id: 'badge-fp-master',
    name: 'Código Limpio',
    description: 'Completa al menos 5 ejercicios de Fundamentos de Programación',
    icon: 'Code',
    category: 'subject',
    targetValue: 5
  },
  {
    id: 'badge-am-master',
    name: 'Mente Diferencial',
    description: 'Completa al menos 3 ejercicios de Análisis Matemático o LyMD',
    icon: 'Sigma',
    category: 'subject',
    targetValue: 3
  },
  {
    id: 'badge-planner-pro',
    name: 'Estratega de Exámenes',
    description: 'Crea una planificación de estudio en el calendario',
    icon: 'Target',
    category: 'milestone',
    targetValue: 1
  }
];

export function getLevelFromXP(xp: number): LevelInfo {
  let matched = LEVEL_THRESHOLDS[0];
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].minXP) {
      matched = LEVEL_THRESHOLDS[i];
      break;
    }
  }

  const range = matched.nextXP - matched.minXP;
  const currentLevelXP = Math.max(0, xp - matched.minXP);
  const progressPercent = Math.min(100, Math.round((currentLevelXP / range) * 100));

  return {
    level: matched.level,
    title: matched.title,
    minXP: matched.minXP,
    nextXP: matched.nextXP,
    progressPercent,
    currentLevelXP,
    neededLevelXP: range
  };
}

export function calculateTotalXP(
  totalSeconds: number,
  completedCount: number,
  streak: number,
  examCount: number = 0
): number {
  const xpFromTime = Math.floor(totalSeconds / 60) * 10; // 10 XP por minuto
  const xpFromExercises = completedCount * 50; // 50 XP por ejercicio
  const xpFromStreak = (streak || 0) * 75; // 75 XP por día de racha
  const xpFromExams = examCount * 150; // 150 XP por simulacro
  return xpFromTime + xpFromExercises + xpFromStreak + xpFromExams;
}

export function updateStudyStreak(
  lastActiveDate?: string,
  currentStreak: number = 0,
  longestStreak: number = 0
): { newStreak: number; newLongestStreak: number; todayStr: string; updated: boolean } {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  if (!lastActiveDate) {
    return {
      newStreak: 1,
      newLongestStreak: Math.max(1, longestStreak),
      todayStr,
      updated: true
    };
  }

  if (lastActiveDate === todayStr) {
    // Ya activo hoy
    return {
      newStreak: Math.max(1, currentStreak),
      newLongestStreak: Math.max(currentStreak, longestStreak),
      todayStr,
      updated: false
    };
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastActiveDate === yesterdayStr) {
    // Día consecutivo -> Racha aumenta
    const nextStreak = currentStreak + 1;
    return {
      newStreak: nextStreak,
      newLongestStreak: Math.max(nextStreak, longestStreak),
      todayStr,
      updated: true
    };
  }

  // Se rompió la racha -> reiniciar a 1
  return {
    newStreak: 1,
    newLongestStreak: Math.max(currentStreak, longestStreak),
    todayStr,
    updated: true
  };
}
