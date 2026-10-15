import React from 'react';
import { Subject, Topic } from '../types';
import { BookOpen, HelpCircle, FileText, Compass, ListChecks, Timer, ArrowRight, Sparkles } from 'lucide-react';

interface SubjectViewProps {
  subject: Subject;
  onSelectTopic: (topic: Topic) => void;
  onDirectAction: (topic: Topic, action: 'mindmap' | 'summary' | 'explanation' | 'exercises' | 'exam') => void;
}

export const SubjectView: React.FC<SubjectViewProps> = ({
  subject,
  onSelectTopic,
  onDirectAction
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Subject Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/10 text-indigo-200 backdrop-blur-sm">
              Código {subject.code}
            </span>
            <span className="text-xs text-slate-300">
              {subject.ects} Créditos ECTS
            </span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-emerald-300 flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Material de apuntes oficial ETSISI
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {subject.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed">
            {subject.description}
          </p>
        </div>
      </div>

      {/* Topics Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Temario del Semestre ({subject.topics.length} {subject.topics.length === 1 ? 'Tema' : 'Temas'})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pulsa en cualquier tema para abrir su menú de estudio interactivo.
          </p>
        </div>
      </div>

      {/* Topics Cards */}
      {subject.topics.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Material en digitalización
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
            Los temas de esta asignatura están en proceso de incorporación según el plan docente de cursos posteriores.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {subject.topics.map((topic) => {
            const isTSO = subject.id === 'tso';
            const numExercises = topic.exercises.length;

            return (
              <div
                key={topic.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700/80 shadow-sm hover:shadow-md transition-all p-5 sm:p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
                      Unidad {topic.number}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                      {topic.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {topic.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectTopic(topic)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors shrink-0"
                  >
                    <span>Ver menú de opciones</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Action Badges / Shortcut buttons */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <button
                    onClick={() => onDirectAction(topic, 'mindmap')}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors text-left"
                  >
                    <Compass className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="font-medium truncate">Mapa mental</span>
                  </button>

                  <button
                    onClick={() => onDirectAction(topic, 'summary')}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors text-left"
                  >
                    <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-medium truncate">Resumen</span>
                  </button>

                  <button
                    onClick={() => onDirectAction(topic, 'explanation')}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-300 transition-colors text-left"
                  >
                    <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="font-medium truncate">Explicación</span>
                  </button>

                  <button
                    onClick={() => onDirectAction(topic, 'exercises')}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600 dark:hover:text-amber-300 transition-colors text-left"
                  >
                    <ListChecks className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-medium truncate">
                      {isTSO ? 'Comandos y Labs' : `Ejercicios (${numExercises})`}
                    </span>
                  </button>

                  <button
                    onClick={() => onDirectAction(topic, 'exam')}
                    className="col-span-2 sm:col-span-1 flex items-center gap-2 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/60 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-semibold transition-colors text-left"
                  >
                    <Timer className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="truncate">Simulacro 2h</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
