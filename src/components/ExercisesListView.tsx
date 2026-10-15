import React from 'react';
import { Topic, Exercise, Subject } from '../types';
import { ListChecks, Play, CheckCircle2, Clock, Terminal, ArrowRight, Sparkles } from 'lucide-react';

interface ExercisesListViewProps {
  subject: Subject;
  topic: Topic;
  onSelectExercise: (exercise: Exercise) => void;
  savedTimes: Record<string, number>;
  completedExercises: Record<string, boolean>;
}

export const ExercisesListView: React.FC<ExercisesListViewProps> = ({
  subject,
  topic,
  onSelectExercise,
  savedTimes,
  completedExercises
}) => {
  const isTSO = subject.id === 'tso';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          <ListChecks className="w-4 h-4" />
          <span>Colección Oficial de Problemas de Clase y Examen</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          {isTSO ? 'Prácticas y Comandos de Shell' : 'Resolver ejercicios juntos'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          {isTSO
            ? 'En Taller de Sistemas Operativos no hay colecciones de ejercicios numéricos como en las demás asignaturas. Aquí tienes la guía de laboratorio con los comandos y scripts analizados.'
            : `Selecciona un ejercicio para resolverlo individualmente en pantalla completa con cronómetro de tiempo integrado y solución oculta que podrás revelar al terminar.`}
        </p>
      </div>

      {/* Special Notice for TSO */}
      {isTSO && (
        <div className="p-6 rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/20 text-teal-950 dark:text-teal-200 mb-8 shadow-sm">
          <div className="flex items-start gap-3">
            <Terminal className="w-6 h-6 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-bold">Laboratorio de Taller de Sistemas Operativos</h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                Tal como se indica en la programación oficial, en TSO la preparación se basa en la ejecución guiada de comandos de terminal, el editor <code>vi</code>, manejo de i-nodos (<code>cp</code> vs <code>ln</code> vs <code>mv</code>), scripts bash y filtros (<code>grep</code>, <code>sed</code>, <code>awk</code>).
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800">
                  ls -li (i-nodos)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800">
                  bash pripro (scripts)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800">
                  vi :wq / :q! (editor)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800">
                  grep / cut / sort / uniq
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exercises List */}
      {!isTSO && topic.exercises.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
          <ListChecks className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            No hay ejercicios registrados para este tema
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Consulta la explicación teórica o realiza el simulacro de examen.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {topic.exercises.map((exercise, index) => {
            const isCompleted = !!completedExercises[exercise.id];
            const timeSpent = savedTimes[exercise.id] || 0;

            const difficultyColors = {
              fácil: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
              medio: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800',
              avanzado: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-800',
              examen: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800'
            };

            return (
              <div
                key={exercise.id}
                onClick={() => onSelectExercise(exercise)}
                className={`group p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer ${
                  isCompleted
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10 hover:border-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${difficultyColors[exercise.difficulty]}`}>
                        {exercise.difficulty.toUpperCase()}
                      </span>
                      {isCompleted ? (
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Completado
                        </span>
                      ) : timeSpent > 0 ? (
                        <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          En pausa ({formatTime(timeSpent)})
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Pendiente
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {exercise.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 whitespace-pre-line">
                      {exercise.statement}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {timeSpent > 0 && (
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                          Tiempo
                        </p>
                        <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                          {formatTime(timeSpent)}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      <Play className="w-4 h-4 ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
