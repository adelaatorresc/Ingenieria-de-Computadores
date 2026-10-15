import React, { useMemo } from 'react';
import { Subject, Topic, Exercise } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Timer, CheckCircle2, Clock, Award, BarChart3, ArrowLeft, Play } from 'lucide-react';

interface StudyAnalyticsViewProps {
  subjects: Subject[];
  savedTimes: Record<string, number>;
  completedExercises: Record<string, boolean>;
  onSelectExercise: (subject: Subject, topic: Topic, exercise: Exercise) => void;
  onBack: () => void;
}

export const StudyAnalyticsView: React.FC<StudyAnalyticsViewProps> = ({
  subjects,
  savedTimes,
  completedExercises,
  onSelectExercise,
  onBack
}) => {
  // Aggregate stats
  const {
    totalSeconds,
    totalCompleted,
    totalAttempted,
    subjectData,
    topicData,
    difficultyData,
    exerciseList
  } = useMemo(() => {
    let secs = 0;
    let completed = 0;
    let attempted = 0;

    const subjMap: Record<string, { name: string; seconds: number; completedCount: number }> = {};
    const topMap: Record<string, { name: string; seconds: number; completedCount: number }> = {};
    const diffMap: Record<string, { difficulty: string; seconds: number; count: number }> = {
      fácil: { difficulty: 'Fácil', seconds: 0, count: 0 },
      medio: { difficulty: 'Medio', seconds: 0, count: 0 },
      avanzado: { difficulty: 'Avanzado', seconds: 0, count: 0 },
      examen: { difficulty: 'Examen', seconds: 0, count: 0 }
    };

    const exList: {
      exercise: Exercise;
      subject: Subject;
      topic: Topic;
      timeSpent: number;
      isDone: boolean;
    }[] = [];

    subjects.forEach((subj) => {
      if (!subjMap[subj.id]) {
        subjMap[subj.id] = { name: subj.shortName, seconds: 0, completedCount: 0 };
      }

      subj.topics.forEach((top) => {
        const topKey = `${subj.id}-${top.id}`;
        if (!topMap[topKey]) {
          topMap[topKey] = {
            name: `${subj.shortName} T${top.number}`,
            seconds: 0,
            completedCount: 0
          };
        }

        top.exercises.forEach((ex) => {
          const t = savedTimes[ex.id] || 0;
          const done = !!completedExercises[ex.id];

          secs += t;
          if (done) completed++;
          if (t > 0) attempted++;

          subjMap[subj.id].seconds += t;
          if (done) subjMap[subj.id].completedCount++;

          topMap[topKey].seconds += t;
          if (done) topMap[topKey].completedCount++;

          if (diffMap[ex.difficulty]) {
            diffMap[ex.difficulty].seconds += t;
            if (t > 0 || done) diffMap[ex.difficulty].count++;
          }

          if (t > 0 || done) {
            exList.push({
              exercise: ex,
              subject: subj,
              topic: top,
              timeSpent: t,
              isDone: done
            });
          }
        });
      });
    });

    // Convert to chart array formats
    const subjChart = Object.values(subjMap).map((s) => ({
      name: s.name,
      minutos: Math.round((s.seconds / 60) * 10) / 10,
      completados: s.completedCount
    }));

    const topChart = Object.values(topMap).map((t) => ({
      name: t.name,
      minutos: Math.round((t.seconds / 60) * 10) / 10,
      completados: t.completedCount
    }));

    const diffChart = Object.values(diffMap).map((d) => ({
      name: d.difficulty,
      minutos: Math.round((d.seconds / 60) * 10) / 10,
      count: d.count
    }));

    // Sort exercises by time spent descending
    exList.sort((a, b) => b.timeSpent - a.timeSpent);

    return {
      totalSeconds: secs,
      totalCompleted: completed,
      totalAttempted: attempted,
      subjectData: subjChart,
      topicData: topChart,
      difficultyData: diffChart,
      exerciseList: exList
    };
  }, [subjects, savedTimes, completedExercises]);

  const formatHoursMins = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  const COLORS = ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la vista anterior</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Análisis de Estudio y Rendimiento
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Métricas de tiempo invertido, progreso por asignaturas y ejercicios resueltos.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold self-start sm:self-auto">
          <BarChart3 className="w-4 h-4" />
          <span>Datos en tiempo real (Recharts)</span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Tiempo Total
            </span>
            <Timer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {formatHoursMins(totalSeconds)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Acumulado en ejercicios</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Ejercicios Finalizados
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {totalCompleted}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Con solución verificada</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Iniciados / En Curso
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {totalAttempted}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Con cronómetro guardado</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Media por Ejercicio
            </span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {totalAttempted > 0 ? formatHoursMins(Math.round(totalSeconds / totalAttempted)) : '0m 0s'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Ritmo de resolución</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Chart 1: Time per Subject (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Tiempo Invertido por Asignatura (minutos)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Distribución del tiempo de trabajo en cada materia del plan de estudios.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#888888' }}
                  tickLine={false}
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: '#888888' }} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val ?? 0} minutos`, 'Tiempo']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="minutos" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Difficulty Breakdown (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Tiempo por Nivel de Dificultad
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Minutos dedicados según la complejidad del ejercicio.
          </p>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="minutos"
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    (percent ?? 0) > 0 ? `${name ?? ''} ${( (percent ?? 0) * 100).toFixed(0)}%` : ''
                  }
                  labelLine={false}
                >
                  {difficultyData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val ?? 0} minutos`, 'Tiempo']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: Time per Topic */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm mb-8">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Tiempo por Temas Específicos
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Compara el esfuerzo dedicado a cada unidad didáctica.
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#888888' }}
                tickLine={false}
                interval={0}
              />
              <YAxis tick={{ fontSize: 11, fill: '#888888' }} tickLine={false} />
              <Tooltip
                formatter={(val: any) => [`${val ?? 0} minutos`, 'Tiempo']}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="minutos" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exercise Detail Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Historial de Ejercicios Cronometrados
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Listado ordenado por mayor tiempo dedicado.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {exerciseList.length} registrados
          </span>
        </div>

        {exerciseList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Aún no has iniciado ningún ejercicio con cronómetro. Elige un tema y pulsa en "Resolver ejercicios juntos" para comenzar a registrar tiempos.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">Asignatura</th>
                  <th className="py-2.5 px-3">Ejercicio</th>
                  <th className="py-2.5 px-3">Dificultad</th>
                  <th className="py-2.5 px-3 text-right">Tiempo Empleado</th>
                  <th className="py-2.5 px-3 text-center">Estado</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {exerciseList.map(({ exercise, subject, topic, timeSpent, isDone }) => (
                  <tr key={exercise.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {subject.shortName}
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate font-medium text-slate-900 dark:text-white">
                      {exercise.title}
                    </td>
                    <td className="py-3 px-3 uppercase text-[10px] font-bold text-slate-500">
                      {exercise.difficulty}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                      {formatHoursMins(timeSpent)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {isDone ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Finalizado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          En pausa
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onSelectExercise(subject, topic, exercise)}
                        className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors"
                        title="Reanudar ejercicio"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
