import React, { useState, useMemo } from 'react';
import { Topic, Flashcard } from '../types';
import { MathView } from './MathView';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Sparkles,
  Layers,
  BookOpen
} from 'lucide-react';

interface FlashcardsViewProps {
  topic: Topic;
  onBack: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ topic, onBack }) => {
  // Generate flashcards from topic subtopics
  const initialCards: Flashcard[] = useMemo(() => {
    const list: Flashcard[] = [];
    topic.subtopics.forEach((st, idx) => {
      // Main definition card
      list.push({
        id: `card-${st.id}-def`,
        subtopicTitle: st.title,
        front: `¿Cuál es el concepto y significado fundamental de: "${st.title}"?`,
        back: st.summary,
        formula: st.keyFormulas?.[0],
        examTip: st.examTips?.[0],
        learned: false
      });

      // Additional formula cards if present
      if (st.keyFormulas && st.keyFormulas.length > 0) {
        st.keyFormulas.slice(0, 2).forEach((formula, fIdx) => {
          list.push({
            id: `card-${st.id}-formula-${fIdx}`,
            subtopicTitle: st.title,
            front: `¿Qué fórmula o teorema rige la siguiente propiedad en "${st.title}"?`,
            back: `Formulación matemática oficial:`,
            formula,
            examTip: st.examTips?.[fIdx] || 'Comprobar las hipótesis antes de aplicar en examen.',
            learned: false
          });
        });
      }
    });

    return list;
  }, [topic]);

  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const currentCard = cards[currentIndex] || cards[0];

  const learnedCount = cards.filter((c) => c.learned).length;
  const progressPercent = Math.round((learnedCount / cards.length) * 100);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
  };

  const handleToggleLearned = (learned: boolean) => {
    setCards((prev) =>
      prev.map((c, i) => (i === currentIndex ? { ...c, learned } : c))
    );
    if (learned && learnedCount + 1 === cards.length) {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // safe
      }
    }
    handleNext();
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  };

  const handleResetProgress = () => {
    setCards((prev) => prev.map((c) => ({ ...c, learned: false })));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-1 flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Volver al menú del tema</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Tarjetas de Estudio (Flashcards)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {topic.title} · Memorización activa y autoevaluación rápida
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5"
            title="Barajar tarjetas"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Barajar</span>
          </button>
          <button
            onClick={handleResetProgress}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5"
            title="Reiniciar progreso"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-400">
          <span>Progreso de memorización</span>
          <span>
            {learnedCount} de {cards.length} aprendidas ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Flashcard 3D Interactive Container */}
      <div className="relative min-h-[340px] perspective-1000 mb-6">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full min-h-[340px] p-6 sm:p-10 rounded-3xl border-2 transition-all duration-500 cursor-pointer shadow-xl flex flex-col justify-between select-none ${
            isFlipped
              ? 'border-indigo-400 dark:border-indigo-600 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700'
          }`}
        >
          {/* Card Top Label */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {currentCard?.subtopicTitle || 'Concepto'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {currentIndex + 1} / {cards.length}
            </span>
          </div>

          {/* Card Center Content */}
          <div className="my-auto py-4 text-center">
            {!isFlipped ? (
              <div>
                <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentCard?.front}
                </p>
                <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-1.5">
                  <span>Toca la tarjeta para dar la vuelta y ver la respuesta</span>
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Respuesta y Explicación
                </p>
                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {currentCard?.back}
                </p>

                {currentCard?.formula && (
                  <div className="p-3 rounded-2xl bg-indigo-50/80 dark:bg-slate-900 text-indigo-950 dark:text-indigo-200 border border-indigo-200/80 dark:border-slate-800 overflow-x-auto shadow-2xs text-sm font-mono max-w-lg mx-auto">
                    <MathView math={currentCard.formula} block />
                  </div>
                )}

                {currentCard?.examTip && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/50 text-xs max-w-lg mx-auto text-left">
                    <strong>💡 Consejo ETSISI: </strong>
                    {currentCard.examTip}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card Bottom Tag */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
            <span>{currentCard?.learned ? '✓ Marcada como aprendida' : 'Pendiente de aprender'}</span>
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              {isFlipped ? 'Voltear al frente' : 'Ver solución'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Controls & Rating */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handlePrev}
          className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          title="Anterior tarjeta"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleToggleLearned(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 transition-colors"
          >
            <XCircle className="w-4 h-4 text-rose-500" />
            <span>Repasar luego</span>
          </button>

          <button
            onClick={() => handleToggleLearned(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>¡Aprendido!</span>
          </button>
        </div>

        <button
          onClick={handleNext}
          className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          title="Siguiente tarjeta"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
