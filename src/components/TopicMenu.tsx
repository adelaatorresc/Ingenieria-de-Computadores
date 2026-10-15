import React from 'react';
import { Topic, Subject, SubTopic } from '../types';
import { Compass, FileText, BookOpen, ListChecks, Timer, ArrowRight, ChevronRight, AlertCircle } from 'lucide-react';

interface TopicMenuProps {
  subject: Subject;
  topic: Topic;
  onOpenMindMap: () => void;
  onOpenSummary: () => void;
  onOpenExplanation: (subtopic?: SubTopic) => void;
  onOpenExercises: () => void;
  onOpenExam: () => void;
}

export const TopicMenu: React.FC<TopicMenuProps> = ({
  subject,
  topic,
  onOpenMindMap,
  onOpenSummary,
  onOpenExplanation,
  onOpenExercises,
  onOpenExam
}) => {
  const isTSO = subject.id === 'tso';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Info */}
      <div className="mb-8">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          {subject.name} · Tema {topic.number}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          {topic.title}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-3xl">
          {topic.description}
        </p>
      </div>

      {/* The 5 Key Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        
        {/* 1. Mapa Mental */}
        <button
          onClick={onOpenMindMap}
          className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all text-left"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Hacer mapa mental
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Visualiza en un diagrama interactivo ramificado todos los conceptos, propiedades y relaciones de este tema.
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>Explorar mapa interactivo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* 2. Resumen */}
        <button
          onClick={onOpenSummary}
          className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg transition-all text-left"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Hacer resumen
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Síntesis estructurada con definiciones rigurosas, tablas comparativas, fórmulas indispensables y avisos de examen.
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Consultar resumen ejecutivo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* 3. Explicación Extensa */}
        <button
          onClick={() => onOpenExplanation()}
          className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all text-left"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Explicación extensa
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Desarrollo punto por punto con demostraciones completas, deducciones matemáticas y explicaciones detalladas de diapositivas.
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span>Ver lección completa ({topic.subtopics.length} puntos)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* 4. Resolver ejercicios juntos */}
        <button
          onClick={onOpenExercises}
          className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-lg transition-all text-left"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ListChecks className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Resolver ejercicios juntos
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {isTSO ? (
                'En TSO no hay ejercicios numéricos: incluye prácticas de terminal, scripts de shell y catálogo de comandos.'
              ) : (
                `Práctica enfocada uno a uno: contador de tiempo individual, soluciones escondidas y revelación al pulsar "He terminado".`
              )}
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span>{isTSO ? 'Ver prácticas guiadas' : `Entrar a ejercicios (${topic.exercises.length})`}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* 5. Simulacro de examen (2 horas) */}
        <button
          onClick={onOpenExam}
          className="md:col-span-2 lg:col-span-2 group flex flex-col justify-between p-6 rounded-2xl border-2 border-rose-200 dark:border-rose-900/70 bg-gradient-to-r from-rose-50/50 via-white to-orange-50/50 dark:from-rose-950/20 dark:via-slate-900 dark:to-orange-950/20 hover:border-rose-400 dark:hover:border-rose-600 hover:shadow-lg transition-all text-left"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Timer className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-600 text-white shadow-sm flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5" />
                Límite: 2 horas (120 min)
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              Simulacro de examen oficial
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-xl leading-relaxed">
              Simula la prueba oficial de este tema: batería de preguntas tipo test de examen de la ETSISI-UPM y problemas complejos con temporizador regresivo de 2 horas y cálculo de calificación final.
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-rose-200/60 dark:border-rose-900/60 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
            <span>Comenzar simulacro de examen</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

      </div>

      {/* Subtopics Index List */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Puntos tratados en este tema ({topic.subtopics.length} puntos)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Pulsa en cualquier punto para acceder a su explicación y fórmulas específicas:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {topic.subtopics.map((st, idx) => (
            <button
              key={st.id}
              onClick={() => onOpenExplanation(st)}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all text-left group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                  {st.title}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
