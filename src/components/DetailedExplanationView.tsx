import React, { useState, useEffect } from 'react';
import { Topic, SubTopic } from '../types';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  Maximize2,
  Eye,
  EyeOff
} from 'lucide-react';

interface DetailedExplanationViewProps {
  topic: Topic;
  initialSubtopic?: SubTopic | null;
  onGoToExercises: () => void;
  onBackToTopicMenu: () => void;
}

export const DetailedExplanationView: React.FC<DetailedExplanationViewProps> = ({
  topic,
  initialSubtopic,
  onGoToExercises,
  onBackToTopicMenu
}) => {
  const [selectedSubtopic, setSelectedSubtopic] = useState<SubTopic>(() => {
    if (initialSubtopic) return initialSubtopic;
    return topic.subtopics[0];
  });

  // On mobile/tablet, hide subtopics drawer once a point is selected so it never covers the text!
  const [showSubtopicsSidebar, setShowSubtopicsSidebar] = useState<boolean>(false);

  useEffect(() => {
    if (initialSubtopic) {
      setSelectedSubtopic(initialSubtopic);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialSubtopic]);

  const currentIndex = topic.subtopics.findIndex((s) => s.id === selectedSubtopic.id);
  const prevSubtopic = currentIndex > 0 ? topic.subtopics[currentIndex - 1] : null;
  const nextSubtopic = currentIndex < topic.subtopics.length - 1 ? topic.subtopics[currentIndex + 1] : null;

  const handleSelectPoint = (st: SubTopic) => {
    setSelectedSubtopic(st);
    setShowSubtopicsSidebar(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <button
            onClick={onBackToTopicMenu}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-1 flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Volver al menú del tema</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {topic.title}
          </h1>
        </div>

        {/* Toggleable Points Index button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSubtopicsSidebar(!showSubtopicsSidebar)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showSubtopicsSidebar
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Menu className="w-4 h-4" />
            <span>{showSubtopicsSidebar ? 'Ocultar índice de puntos' : `Índice de puntos (${topic.subtopics.length})`}</span>
          </button>
        </div>
      </div>

      {/* Subtopics Index Drawer / Dropdown when toggled */}
      {showSubtopicsSidebar && (
        <div className="mb-8 p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-400 dark:border-blue-600 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Selecciona el punto que deseas estudiar:
            </h2>
            <button
              onClick={() => setShowSubtopicsSidebar(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {topic.subtopics.map((st, idx) => {
              const isSelected = selectedSubtopic.id === st.id;

              return (
                <button
                  key={st.id}
                  onClick={() => handleSelectPoint(st)}
                  className={`flex items-center justify-between p-3 rounded-xl text-left text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="truncate">{st.title}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area: FULL WIDTH EXPLANATION WITH ZERO OCCLUSION */}
      <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-sm">
        
        {/* Point Banner */}
        <div className="pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Punto {currentIndex + 1} de {topic.subtopics.length}
            </span>

            <span className="text-xs text-slate-400 hidden sm:inline">
              Documentación oficial de diapositivas
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3 leading-tight">
            {selectedSubtopic.title}
          </h2>
        </div>

        {/* Core Content */}
        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          
          {/* Summary Box */}
          <div className="p-4 sm:p-5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1.5">
              Concepto Clave
            </p>
            {selectedSubtopic.summary}
          </div>

          {/* Full explanation text */}
          <div className="whitespace-pre-line leading-relaxed text-slate-800 dark:text-slate-200 font-normal">
            {selectedSubtopic.explanation}
          </div>

          {/* Key Formulas Section */}
          {selectedSubtopic.keyFormulas && selectedSubtopic.keyFormulas.length > 0 && (
            <div className="my-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Formulaciones e Identidades Relevantes
              </h3>
              <div className="space-y-2">
                {selectedSubtopic.keyFormulas.map((formula, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-3.5 rounded-xl bg-slate-900 text-indigo-300 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner border border-slate-800"
                  >
                    {formula}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exam tips if any */}
          {selectedSubtopic.examTips && selectedSubtopic.examTips.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
              <p className="font-bold mb-1.5 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Atención especial para exámenes:</span>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                {selectedSubtopic.examTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          {prevSubtopic ? (
            <button
              onClick={() => handleSelectPoint(prevSubtopic)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline truncate max-w-[200px]">{prevSubtopic.title}</span>
              <span className="sm:hidden">Punto anterior</span>
            </button>
          ) : <div />}

          {nextSubtopic ? (
            <button
              onClick={() => handleSelectPoint(nextSubtopic)}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              <span className="hidden sm:inline truncate max-w-[200px]">{nextSubtopic.title}</span>
              <span className="sm:hidden">Siguiente punto</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onGoToExercises}
              className="flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
            >
              <span>Ir a Resolver Ejercicios</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </article>
    </div>
  );
};
