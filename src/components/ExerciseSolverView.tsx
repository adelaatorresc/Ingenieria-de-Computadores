import React, { useState, useEffect, useRef } from 'react';
import { Exercise } from '../types';
import confetti from 'canvas-confetti';
import {
  Timer,
  Pause,
  Play,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Code2,
  BookOpen,
  Edit3,
  Award
} from 'lucide-react';

interface ExerciseSolverViewProps {
  exercise: Exercise;
  nextExercise: Exercise | null;
  initialTime?: number;
  initialCompleted?: boolean;
  onSaveTime: (exerciseId: string, seconds: number) => void;
  onCompleteExercise: (exerciseId: string, seconds: number) => void;
  onBackToExercises: () => void;
  onGoToNextExercise: (next: Exercise) => void;
}

export const ExerciseSolverView: React.FC<ExerciseSolverViewProps> = ({
  exercise,
  nextExercise,
  initialTime = 0,
  initialCompleted = false,
  onSaveTime,
  onCompleteExercise,
  onBackToExercises,
  onGoToNextExercise
}) => {
  const [seconds, setSeconds] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(!initialCompleted);
  const [isFinished, setIsFinished] = useState<boolean>(initialCompleted);
  const [showSolution, setShowSolution] = useState<boolean>(initialCompleted);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [scratchpad, setScratchpad] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if exercise changes
  useEffect(() => {
    setSeconds(initialTime);
    setIsFinished(initialCompleted);
    setShowSolution(initialCompleted);
    setIsRunning(!initialCompleted);
    setScratchpad('');
    setShowHints(false);
  }, [exercise.id, initialTime, initialCompleted]);

  // Interval timer
  useEffect(() => {
    if (isRunning && !isFinished) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          onSaveTime(exercise.id, next);
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isFinished, exercise.id, onSaveTime]);

  const togglePause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    setSeconds(0);
    onSaveTime(exercise.id, 0);
  };

  const handleFinish = () => {
    setIsRunning(false);
    setIsFinished(true);
    setShowSolution(true);
    onCompleteExercise(exercise.id, seconds);

    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback if canvas-confetti is not loaded
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      
      {/* Top Navigation Bar: Back & Action buttons */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBackToExercises}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a ejercicios</span>
        </button>

        {nextExercise && (
          <button
            onClick={() => onGoToNextExercise(nextExercise)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
          >
            <span>Seguir al siguiente ejercicio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Focus Container: ONLY THIS EXERCISE */}
      <div className="space-y-6">
        
        {/* Exercise Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          
          {/* Header Row: Difficulty & Floating Persistent Timer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                {exercise.difficulty}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {exercise.title}
              </h1>
            </div>

            {/* Timer Controller Box */}
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 self-start sm:self-auto shadow-inner">
              <div className="flex items-center gap-2 px-2">
                <Timer className={`w-4 h-4 ${isRunning ? 'text-indigo-600 animate-pulse' : 'text-slate-400'}`} />
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white tabular-nums tracking-wide">
                  {formatTime(seconds)}
                </span>
              </div>

              {!isFinished ? (
                <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
                  <button
                    onClick={togglePause}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                    title={isRunning ? 'Pausar contador' : 'Reanudar contador'}
                  >
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleResetTimer}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title="Reiniciar a cero"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pl-2 border-l border-slate-200 dark:border-slate-700">
                  Completado
                </span>
              )}
            </div>
          </div>

          {/* Statement */}
          <div className="py-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Enunciado del problema
            </h2>
            <div className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line font-normal">
              {exercise.statement}
            </div>
          </div>

          {/* Hints Accordion if available */}
          {exercise.hints && exercise.hints.length > 0 && (
            <div className="pt-2 pb-4">
              <button
                onClick={() => setShowHints(!showHints)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHints ? 'Ocultar pistas' : '¿Necesitas una pista?'}</span>
              </button>
              {showHints && (
                <div className="mt-2 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  {exercise.hints.map((hint, idx) => (
                    <p key={idx}>💡 {hint}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Student Scratchpad / Working Notes */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" />
                Borrador / Espacio de cálculo personal:
              </span>
              <span className="text-[11px] text-slate-400">
                Escribe aquí tus pasos o notas
              </span>
            </div>
            <textarea
              value={scratchpad}
              onChange={(e) => setScratchpad(e.target.value)}
              placeholder="Escribe tus cálculos intermedios o hipótesis aquí..."
              rows={3}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </div>

          {/* Core Action: "He terminado" Button */}
          {!isFinished && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Al pulsar en <strong>"He terminado"</strong>, el contador se detendrá y se mostrará la solución completa detallada debajo.
              </p>

              <button
                onClick={handleFinish}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shrink-0"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>He terminado</span>
              </button>
            </div>
          )}
        </div>

        {/* Revealed Solution Box (Shown when finished or solution requested) */}
        {showSolution && (
          <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-900/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            
            {/* Success Summary Header */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    ¡Ejercicio completado!
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Has tardado <strong className="font-mono">{formatTime(seconds)}</strong> en resolver este problema.
                  </p>
                </div>
              </div>
            </div>

            {/* Final Answer Highlight */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Respuesta Final
              </p>
              <div className="p-3.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs sm:text-sm font-semibold overflow-x-auto shadow-inner">
                {exercise.solution.finalAnswer}
              </div>
            </div>

            {/* Step by step development */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Resolución Detallada Paso a Paso
              </p>
              <div className="space-y-3">
                {exercise.solution.stepByStep.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Code Snippet if present */}
            {exercise.solution.codeSnippet && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-indigo-500" />
                  <span>Código Fuente de la Solución (C / Script)</span>
                </p>
                <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                  <code>{exercise.solution.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Theoretical note */}
            {exercise.solution.theoreticalNote && (
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200">
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Nota teórica relevante:</span>
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  {exercise.solution.theoreticalNote}
                </p>
              </div>
            )}

            {/* Post-Solution Action Footer */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={onBackToExercises}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center"
              >
                Volver a ejercicios
              </button>

              {nextExercise ? (
                <button
                  onClick={() => onGoToNextExercise(nextExercise)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Seguir al siguiente ejercicio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs text-slate-400">
                  ¡Has completado todos los ejercicios de este tema!
                </span>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
