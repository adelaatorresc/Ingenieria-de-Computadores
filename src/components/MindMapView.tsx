import React, { useState } from 'react';
import { Topic, SubTopic } from '../types';
import { Compass, BookOpen, Layers, Sparkles, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MindMapViewProps {
  topic: Topic;
  onGoToExplanation: (subtopic: SubTopic) => void;
}

export const MindMapView: React.FC<MindMapViewProps> = ({
  topic,
  onGoToExplanation
}) => {
  const [selectedSubtopic, setSelectedSubtopic] = useState<SubTopic>(topic.subtopics[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    topic.subtopics.forEach(st => { init[st.id] = true; });
    return init;
  });

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Mapa Mental Interactivo
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5">
            {topic.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explora las ramas conceptuales, fórmulas clave y relaciones lógicas del temario.
          </p>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.1))}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900"
            title="Reducir zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono px-2 text-slate-600 dark:text-slate-300">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900"
            title="Aumentar zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900"
            title="Reiniciar vista"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Mind Map Interactive Canvas / Visual Tree (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-6 overflow-hidden shadow-sm relative">
          
          <div
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
            className="transition-transform duration-200 space-y-6"
          >
            {/* Central Node */}
            <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-md max-w-md border border-indigo-500">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-1">
                <Compass className="w-4 h-4" />
                <span>Eje Temático Central</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold leading-snug">
                {topic.title}
              </h2>
              <p className="text-xs text-indigo-100 mt-1 line-clamp-2">
                {topic.subtitle}
              </p>
            </div>

            {/* Tree Branches (Subtopics) */}
            <div className="pl-6 border-l-2 border-indigo-200 dark:border-indigo-900/60 space-y-4">
              {topic.subtopics.map((st, index) => {
                const isSelected = selectedSubtopic?.id === st.id;
                const isExpanded = !!expandedNodes[st.id];

                return (
                  <div key={st.id} className="relative group">
                    {/* Horizontal connector line */}
                    <div className="absolute -left-6 top-5 w-6 h-0.5 bg-indigo-200 dark:border-indigo-900/60 group-hover:bg-indigo-400 transition-colors" />

                    <div
                      onClick={() => setSelectedSubtopic(st)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {st.title}
                          </h3>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleNode(st.id);
                          }}
                          className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline shrink-0"
                        >
                          {isExpanded ? 'Plegar' : 'Desplegar'}
                        </button>
                      </div>

                      {/* Branch Key Concept Nodes */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {st.summary}
                          </p>

                          {st.keyFormulas && st.keyFormulas.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {st.keyFormulas.slice(0, 2).map((formula, fIdx) => (
                                <span
                                  key={fIdx}
                                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 truncate max-w-full"
                                >
                                  {formula}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Concept Inspector (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" />
            <span>Detalle del Nodo Seleccionado</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedSubtopic.title}
          </h3>

          <div className="mt-4 space-y-4 text-xs sm:text-sm">
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1">
                Idea fundamental:
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedSubtopic.summary}
              </p>
            </div>

            {selectedSubtopic.keyFormulas && selectedSubtopic.keyFormulas.length > 0 && (
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1.5">
                  Fórmulas e Identidades:
                </p>
                <div className="space-y-1.5">
                  {selectedSubtopic.keyFormulas.map((f, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 font-mono text-xs text-indigo-900 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 overflow-x-auto"
                    >
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedSubtopic.examTips && selectedSubtopic.examTips.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs">
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Atención en examen:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  {selectedSubtopic.examTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => onGoToExplanation(selectedSubtopic)}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Ver explicación completa de este punto</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
