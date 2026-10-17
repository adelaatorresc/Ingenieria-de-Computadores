import React, { useState, useMemo } from 'react';
import { UserProfile, CourseId, Badge } from '../types';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import {
  getLevelFromXP,
  calculateTotalXP,
  ALL_BADGES
} from '../utils/gamification';
import {
  User,
  Mail,
  GraduationCap,
  Clock,
  CheckCircle2,
  Award,
  Sun,
  Moon,
  LogOut,
  Edit2,
  Save,
  ArrowLeft,
  Flame,
  Sparkles,
  Zap,
  Lock,
  Trophy,
  Target,
  KeyRound,
  CloudCheck,
  Cpu,
  Code,
  Sigma,
  Timer
} from 'lucide-react';

interface UserProfileSettingsViewProps {
  user: UserProfile;
  totalSeconds: number;
  completedExercisesCount: number;
  inProgressCount: number;
  examCount?: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
  onBack: () => void;
}

export const UserProfileSettingsView: React.FC<UserProfileSettingsViewProps> = ({
  user,
  totalSeconds,
  completedExercisesCount,
  inProgressCount,
  examCount = 0,
  darkMode,
  onToggleDarkMode,
  onUpdateUser,
  onLogout,
  onBack
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [studentId, setStudentId] = useState<string>(user.studentId || '');
  const [courseId, setCourseId] = useState<CourseId>(user.selectedCourseId);
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<string>('all');
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);
  const [resetEmailError, setResetEmailError] = useState<string | null>(null);

  // Compute Gamification: XP & Level
  const currentStreak = user.currentStreak || 1;
  const longestStreak = user.longestStreak || currentStreak;

  const totalXP = useMemo(() => {
    return calculateTotalXP(totalSeconds, completedExercisesCount, currentStreak, examCount);
  }, [totalSeconds, completedExercisesCount, currentStreak, examCount]);

  const levelInfo = useMemo(() => {
    return getLevelFromXP(totalXP);
  }, [totalXP]);

  // Compute Unlocked Badges
  const badgesWithStatus = useMemo(() => {
    return ALL_BADGES.map((badge) => {
      let isUnlocked = false;
      let currentValue = 0;

      switch (badge.id) {
        case 'badge-first-step':
          currentValue = completedExercisesCount;
          isUnlocked = completedExercisesCount >= 1;
          break;
        case 'badge-streak-3':
          currentValue = currentStreak;
          isUnlocked = currentStreak >= 3 || longestStreak >= 3;
          break;
        case 'badge-streak-7':
          currentValue = currentStreak;
          isUnlocked = currentStreak >= 7 || longestStreak >= 7;
          break;
        case 'badge-streak-14':
          currentValue = currentStreak;
          isUnlocked = currentStreak >= 14 || longestStreak >= 14;
          break;
        case 'badge-time-1h':
          currentValue = totalSeconds;
          isUnlocked = totalSeconds >= 3600;
          break;
        case 'badge-time-5h':
          currentValue = totalSeconds;
          isUnlocked = totalSeconds >= 18000;
          break;
        case 'badge-exercises-5':
          currentValue = completedExercisesCount;
          isUnlocked = completedExercisesCount >= 5;
          break;
        case 'badge-exercises-15':
          currentValue = completedExercisesCount;
          isUnlocked = completedExercisesCount >= 15;
          break;
        case 'badge-fc-master':
          // Estimate based on completion
          currentValue = Math.min(completedExercisesCount, 3);
          isUnlocked = completedExercisesCount >= 3;
          break;
        case 'badge-fp-master':
          currentValue = Math.min(completedExercisesCount, 5);
          isUnlocked = completedExercisesCount >= 5;
          break;
        case 'badge-am-master':
          currentValue = Math.min(completedExercisesCount, 3);
          isUnlocked = completedExercisesCount >= 3;
          break;
        case 'badge-planner-pro':
          isUnlocked = true; // Unlocked when user has account
          currentValue = 1;
          break;
        default:
          isUnlocked = completedExercisesCount >= 1;
          currentValue = completedExercisesCount;
      }

      return {
        ...badge,
        isUnlocked,
        currentValue
      };
    });
  }, [completedExercisesCount, currentStreak, longestStreak, totalSeconds]);

  const filteredBadges = useMemo(() => {
    if (selectedBadgeFilter === 'all') return badgesWithStatus;
    if (selectedBadgeFilter === 'unlocked') return badgesWithStatus.filter((b) => b.isUnlocked);
    if (selectedBadgeFilter === 'locked') return badgesWithStatus.filter((b) => !b.isUnlocked);
    return badgesWithStatus.filter((b) => b.category === selectedBadgeFilter);
  }, [badgesWithStatus, selectedBadgeFilter]);

  const unlockedCount = useMemo(() => {
    return badgesWithStatus.filter((b) => b.isUnlocked).length;
  }, [badgesWithStatus]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: name.trim(),
      email: email.trim(),
      studentId: studentId.trim(),
      selectedCourseId: courseId
    });
    setIsEditing(false);
  };

  const handleSendPasswordReset = async () => {
    setResetEmailError(null);
    try {
      if (auth.currentUser?.email || user.email) {
        await sendPasswordResetEmail(auth, auth.currentUser?.email || user.email);
        setResetEmailSent(true);
      }
    } catch (err: any) {
      setResetEmailError(err?.message || 'Error al enviar el correo.');
    }
  };

  const formatHoursMins = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'Timer':
        return <Timer className="w-5 h-5 text-purple-500" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'Award':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-indigo-500" />;
      case 'Code':
        return <Code className="w-5 h-5 text-teal-500" />;
      case 'Sigma':
        return <Sigma className="w-5 h-5 text-rose-500" />;
      case 'Target':
        return <Target className="w-5 h-5 text-cyan-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-1 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la vista anterior</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Perfil de Estudiante y Logros
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Racha de estudio, sistema de niveles, medallas y sincronización en la nube.
          </p>
        </div>

        {/* Cloud Sync Capsule */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sincronizado en tiempo real</span>
        </div>
      </div>

      {/* Grid: Profile Capsule + Racha Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Profile Info (2 cols) */}
        <div className="md:col-span-2 p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                style={{ backgroundColor: user.avatarColor || '#6366f1' }}
                className="w-16 h-16 rounded-2xl text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0"
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                    {user.name}
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shrink-0">
                    {user.selectedCourseId}º Curso
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {user.email} · Matrícula: {user.studentId || 'boXXXX'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Grado en Ingeniería de Computadores · Plan 61CI (ETSISI - UPM)
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0"
            >
              <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
            </button>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleSave} className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre y apellidos"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Curso UPM
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value as CourseId)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                  >
                    <option value="1">1.º Curso</option>
                    <option value="2">2.º Curso</option>
                    <option value="3">3.º Curso</option>
                    <option value="4">4.º Curso</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Matrícula / ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          )}

          {/* Stats Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-[11px] font-semibold text-slate-400 block">Tiempo de Estudio</span>
              <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                {formatHoursMins(totalSeconds)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-[11px] font-semibold text-slate-400 block">Ejercicios Hechos</span>
              <span className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {completedExercisesCount}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-[11px] font-semibold text-slate-400 block">Medallas</span>
              <span className="text-base sm:text-lg font-extrabold text-amber-500 font-mono">
                {unlockedCount} / {ALL_BADGES.length}
              </span>
            </div>
          </div>
        </div>

        {/* Racha de Estudio Card (1 col) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 border border-amber-200/80 dark:border-amber-900/40 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Flame className="w-32 h-32 text-amber-500 fill-amber-500" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
                Racha de Estudio
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                Récord: {longestStreak}d
              </span>
            </div>

            <div className="my-2 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-mono">
                {currentStreak}
              </span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                {currentStreak === 1 ? 'día consecutivo' : 'días consecutivos'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
              {currentStreak >= 3
                ? '¡Imparable! Estás consolidando el hábito de estudio diario para superar el curso.'
                : 'Estudia o resuelve al menos un ejercicio cada día para no perder tu racha.'}
            </p>
          </div>

          {/* Mini 7-day visual dots */}
          <div className="pt-4 mt-4 border-t border-amber-200/60 dark:border-amber-900/50">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Últimos 7 días
            </p>
            <div className="flex items-center justify-between gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((dayIdx) => {
                const isActive = dayIdx <= currentStreak;
                return (
                  <div key={dayIdx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full h-2.5 rounded-full transition-all ${
                        isActive
                          ? 'bg-amber-500 shadow-2xs shadow-amber-500/50'
                          : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                    <span className="text-[9px] font-mono text-slate-400">D{dayIdx}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Level System Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-600/30">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Nivel {levelInfo.level}
                </span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  · {levelInfo.title}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Consigues XP estudiando (+10 XP/min), resolviendo ejercicios (+50 XP) y con tu racha (+75 XP/día).
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400 block">Total acumulado</span>
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
              {totalXP} XP
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Progreso hacia Nivel {levelInfo.level + 1}</span>
            <span>
              {levelInfo.currentLevelXP} / {levelInfo.neededLevelXP} XP ({levelInfo.progressPercent}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Achievement Badges Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Medallas y Logros de Estudio
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Desbloquea insignias cumpliendo hitos de constancia, problemas resueltos y tiempo.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'unlocked', label: `Desbloqueadas (${unlockedCount})` },
              { id: 'locked', label: 'Por desbloquear' },
              { id: 'streak', label: 'Racha' },
              { id: 'exercises', label: 'Ejercicios' },
              { id: 'time', label: 'Tiempo' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedBadgeFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedBadgeFilter === f.id
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBadges.map((badge) => {
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all ${
                  badge.isUnlocked
                    ? 'bg-gradient-to-br from-indigo-50/50 via-white to-amber-50/30 dark:from-slate-800/80 dark:via-slate-850 dark:to-slate-800/60 border-indigo-200/80 dark:border-indigo-900/50 shadow-xs'
                    : 'bg-slate-50/60 dark:bg-slate-800/20 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                      badge.isUnlocked
                        ? 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-indigo-800 shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {badge.isUnlocked ? (
                      renderBadgeIcon(badge.icon)
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {badge.name}
                      </h4>
                      {badge.isUnlocked ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 shrink-0">
                          Desbloqueado
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400 shrink-0">
                          Bloqueado
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Settings & Preferences */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Seguridad y Preferencias del Entorno
        </h3>

        <div className="space-y-4 text-xs sm:text-sm">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                Tema de la interfaz: {darkMode ? 'Modo Oscuro' : 'Modo Claro'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cambia entre colores claros de alta nitidez o tema oscuro nocturno.
              </p>
            </div>

            <button
              onClick={onToggleDarkMode}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold transition-all shadow-2xs"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              <span>{darkMode ? 'Cambiar a Claro' : 'Cambiar a Oscuro'}</span>
            </button>
          </div>

          {/* Password Reset */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                Seguridad de la Contraseña
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ¿Deseas cambiar tu contraseña? Te enviaremos un enlace seguro a tu correo.
              </p>
              {resetEmailSent && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  ✓ Enlace de recuperación enviado a tu correo.
                </p>
              )}
              {resetEmailError && (
                <p className="text-xs text-rose-500 font-semibold mt-1">
                  {resetEmailError}
                </p>
              )}
            </div>

            <button
              onClick={handleSendPasswordReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold transition-all shadow-2xs shrink-0"
            >
              <KeyRound className="w-4 h-4 text-indigo-500" />
              <span>Cambiar Contraseña</span>
            </button>
          </div>

          {/* Logout button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                Cerrar sesión
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cierra la sesión activa en este navegador. Tus datos permanecerán sincronizados en tu cuenta.
              </p>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
