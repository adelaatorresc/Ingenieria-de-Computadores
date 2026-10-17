import React from 'react';
import { Topic } from '../types';
import { MathView } from './MathView';
import { FileText, Bookmark, CheckCircle2, AlertTriangle, Sparkles, Printer } from 'lucide-react';

interface SummaryViewProps {
  topic: Topic;
  onGoToExercises: () => void;
  onGoToExam: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  topic,
  onGoToExercises,
  onGoToExam
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Resumen Ejecutivo Oficial</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {topic.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {topic.subtitle}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-medium self-start sm:self-auto shadow-sm"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Imprimir / Guardar PDF</span>
        </button>
      </div>

      {/* Summary Cards by Subtopic */}
      <div className="space-y-8">
        {topic.subtopics.map((subtopic, index) => (
          <section
            key={subtopic.id}
            className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                {index + 1}
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {subtopic.title}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {subtopic.summary}
            </p>

            {/* Key formulas / rules */}
            {subtopic.keyFormulas && subtopic.keyFormulas.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Fórmulas y Teoremas
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {subtopic.keyFormulas.map((formula, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-3 rounded-xl bg-indigo-50/70 dark:bg-slate-800/60 font-mono text-xs text-indigo-950 dark:text-indigo-200 border border-indigo-200/60 dark:border-slate-700/80 overflow-x-auto shadow-2xs"
                    >
                      <MathView math={formula} block />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exam Tips if available */}
            {subtopic.examTips && subtopic.examTips.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Errores frecuentes y consejos de examen:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  {subtopic.examTips.map((tip, tIdx) => (
                    <li key={tIdx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Action Footer Callout */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-emerald-50 dark:from-indigo-950/30 dark:to-emerald-950/30 border border-indigo-200 dark:border-indigo-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            ¿Listo para poner a prueba tu conocimiento?
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Resuelve los problemas paso a paso con cronómetro o realiza un simulacro de examen oficial de 2 horas.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onGoToExercises}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-colors text-center whitespace-nowrap"
          >
            Resolver ejercicios
          </button>
          <button
            onClick={onGoToExam}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition-colors text-center whitespace-nowrap"
          >
            Simulacro 2h
          </button>
        </div>
      </div>
    </div>
  );
};
