import React, { useState } from 'react';
import {
  ArrowLeft,
  Menu,
  Home,
  X,
  BookOpen,
  GraduationCap,
  Sun,
  Moon,
  BarChart3,
  Upload,
  Sparkles,
  Timer,
  Clock,
  Award,
  Bot,
  User,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Target,
  Flame,
  Zap,
  Users
} from 'lucide-react';
import { NavState, UserProfile } from '../types';

interface HeaderProps {
  nav: NavState;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
  onGoHome: () => void;
  onOpenAnalytics: () => void;
  onOpenUploadNotes: () => void;
  onOpenPomodoro?: () => void;
  onOpenGrades?: () => void;
  onOpenCustomExam?: () => void;
  onOpenAITutor?: () => void;
  onOpenProfile?: () => void;
  onOpenAuth?: () => void;
  onOpenCalendar?: () => void;
  onOpenStudyPlanner?: () => void;
  onOpenStudyGroups?: () => void;
  user?: UserProfile | null;
  subjectTitle?: string;
  topicTitle?: string;
  exerciseTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  nav,
  darkMode,
  onToggleDarkMode,
  onBack,
  onGoHome,
  onOpenAnalytics,
  onOpenUploadNotes,
  onOpenPomodoro,
  onOpenGrades,
  onOpenCustomExam,
  onOpenAITutor,
  onOpenProfile,
  onOpenAuth,
  onOpenCalendar,
  onOpenStudyPlanner,
  onOpenStudyGroups,
  user,
  subjectTitle,
  topicTitle,
  exerciseTitle
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const canGoBack = nav.view !== 'welcome' && nav.view !== 'courses';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Back Button & Wordmark / Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            {canGoBack && (
              <button
                onClick={onBack}
                aria-label="Volver atrás"
                className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={onGoHome}
              className="flex items-center gap-2.5 text-left group shrink-0"
              title="Volver a la portada de inicio"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-indigo-700 transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 leading-none">
                  ETSISI · UPM 61CI
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Ingeniería de Computadores
                </p>
              </div>
            </button>

            {/* Context breadcrumb trail */}
            {subjectTitle && (
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate pl-3 border-l border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                  {subjectTitle}
                </span>
                {topicTitle && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">/</span>
                    <span className="truncate max-w-[180px]" title={topicTitle}>
                      {topicTitle.split(':')[0]}
                    </span>
                  </>
                )}
                {exerciseTitle && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">/</span>
                    <span className="truncate max-w-[150px] text-indigo-600 dark:text-indigo-400 font-medium">
                      {exerciseTitle.split(':')[0]}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Zone 2: Navigation Info / Indicator */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              {nav.courseId ? `${nav.courseId}º Curso` : 'Plan 61CI'}
              {nav.semesterId ? ` · ${nav.semesterId}º Semestre` : ''}
            </span>
          </div>

          {/* Zone 3: Quick Action Buttons & Menu */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Racha de Estudio Tracker */}
            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold text-xs hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all shadow-2xs"
                title={`Racha de estudio: ${user?.currentStreak || 1} días consecutivos. ¡Haz clic para ver tus logros y nivel!`}
              >
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                <span className="font-mono font-extrabold">{user?.currentStreak || 1}</span>
                <span className="hidden sm:inline text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                  {(user?.currentStreak || 1) === 1 ? 'día' : 'días'}
                </span>
              </button>
            )}

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label="Cambiar tema claro/oscuro"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Quick Dedicated AI Tutor */}
            {onOpenAITutor && (
              <button
                onClick={onOpenAITutor}
                className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  nav.view === 'ai_tutor_page'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
                title="Aula Virtual del Tutor IA ETSISI"
              >
                <Bot className="w-4 h-4 text-purple-500" />
                <span>Tutor IA</span>
              </button>
            )}

            {/* Quick Pomodoro Button */}
            {onOpenPomodoro && (
              <button
                onClick={onOpenPomodoro}
                className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  nav.view === 'pomodoro'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
                title="Temporizador Pomodoro"
              >
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Pomodoro</span>
              </button>
            )}

            {/* Quick Study Groups Button */}
            {onOpenStudyGroups && (
              <button
                onClick={onOpenStudyGroups}
                className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  nav.view === 'study_groups'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
                title="Grupos de Estudio Virtuales (Salas y Pomodoro sincrónico)"
              >
                <Users className="w-4 h-4 text-indigo-500" />
                <span>Salas Estudio</span>
              </button>
            )}

            {/* Quick Analytics Button */}
            <button
              onClick={onOpenAnalytics}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                nav.view === 'analytics'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
              title="Ver análisis de tiempos y estudio"
            >
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span>Análisis</span>
            </button>

            {/* Subir Apuntes Button */}
            <button
              onClick={onOpenUploadNotes}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all shadow-2xs"
              title="Subir apuntes o crear nuevo tema"
            >
              <Upload className="w-4 h-4 text-emerald-500" />
              <span>Subir apuntes</span>
            </button>

            {/* Hamburger Menu Button ("Volver al menú principal") */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-xs sm:text-sm transition-colors shadow-2xs"
              aria-label="Abrir menú principal"
            >
              <Menu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="whitespace-nowrap hidden sm:inline">Menú principal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Menu Modal */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Menu Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Menú Principal</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">ETSISI - UPM (Plan 61CI)</p>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Account Capsule */}
              <div className="my-4 p-3 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {user?.name ? user.name[0].toUpperCase() : 'E'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user?.name || 'Estudiante ETSISI'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/60 px-1.5 py-0.2 rounded">
                        <Flame className="w-3 h-3 fill-amber-500" />
                        {user?.currentStreak || 1}d racha
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || 'Plan 61CI'}
                      </span>
                    </div>
                  </div>
                </div>
                {onOpenAuth && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-slate-600 text-[11px] font-semibold hover:bg-indigo-50 transition-colors shrink-0"
                  >
                    {user ? 'Cuenta' : 'Entrar'}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {/* 1. Return to Welcome Screen */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onGoHome();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Portada de Inicio</p>
                    <p className="text-[11px] text-slate-500">"Ingeniería de computadores"</p>
                  </div>
                </button>

                {/* 2. Dedicated AI Tutor */}
                {onOpenAITutor && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenAITutor();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-purple-200/80 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20 hover:bg-purple-100/50 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Aula Tutor IA ETSISI</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-600 text-white font-semibold">
                          Oficial
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-500">Consultas, tablas y explicaciones paso a paso</p>
                    </div>
                  </button>
                )}

                {/* 3. Custom Multi-Topic Exam */}
                {onOpenCustomExam && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenCustomExam();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-100/50 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                      <Timer className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Simulacro Multitema</p>
                      <p className="text-[11px] text-slate-500">Elige temas para examen de 2 horas</p>
                    </div>
                  </button>
                )}

                {/* Exam Calendar */}
                {onOpenCalendar && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenCalendar();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-100/50 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Calendario de Exámenes</p>
                      <p className="text-[11px] text-slate-500">Aulas, bloques, convocatorias y fechas</p>
                    </div>
                  </button>
                )}

                {/* Study Planner */}
                {onOpenStudyPlanner && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenStudyPlanner();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-cyan-200/80 dark:border-cyan-900/50 bg-cyan-50/40 dark:bg-cyan-950/20 hover:bg-cyan-100/50 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0">
                      <Target className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Planificación de Estudio</p>
                      <p className="text-[11px] text-slate-500">Cronograma diario por temas y recordatorios</p>
                    </div>
                  </button>
                )}

                {/* Study Groups */}
                {onOpenStudyGroups && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenStudyGroups();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-indigo-200/80 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-100/50 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors text-left cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Grupos de Estudio Virtuales</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-600 text-white font-semibold">
                          En vivo
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-500">Salas por asignatura, Pomodoro sincronizado y apuntes</p>
                    </div>
                  </button>
                )}

                {/* 4. Pomodoro Study Timer */}
                {onOpenPomodoro && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenPomodoro();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-100/50 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Estudio Pomodoro</p>
                      <p className="text-[11px] text-slate-500">5 intervalos ajustables con descansos y sonido</p>
                    </div>
                  </button>
                )}

                {/* 5. Grades Calculator */}
                {onOpenGrades && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenGrades();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-100/50 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Notas y Calificaciones</p>
                      <p className="text-[11px] text-slate-500">Cálculo ponderado hasta el 100%</p>
                    </div>
                  </button>
                )}

                {/* 6. Study Analytics */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenAnalytics();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Análisis de Estudio</p>
                    <p className="text-[11px] text-slate-500">Gráficos de tiempo por ejercicio y tema</p>
                  </div>
                </button>

                {/* 7. Upload Notes */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenUploadNotes();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Subir Apuntes / Nuevo Tema</p>
                    <p className="text-[11px] text-slate-500">Crea resúmenes y mapas de tus propios PDF</p>
                  </div>
                </button>

                {/* 8. User Profile & Settings */}
                {onOpenProfile && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                      <Settings className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Ajustes y Perfil</p>
                      <p className="text-[11px] text-slate-500">Datos personales, matrícula y progreso</p>
                    </div>
                  </button>
                )}

                {/* Dark/Light mode in menu */}
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Tema de la Interfaz
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Actualmente: {darkMode ? 'Modo Oscuro' : 'Modo Claro'}
                    </p>
                  </div>
                  <button
                    onClick={onToggleDarkMode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700"
                  >
                    {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
                    <span>{darkMode ? 'Claro' : 'Oscuro'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center">
              ETSISI · UPM 2026-2027 · Plan 61CI
            </div>
          </div>
        </div>
      )}
    </>
  );
};
