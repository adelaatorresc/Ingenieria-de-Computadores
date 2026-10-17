import React, { useState, useEffect, useRef } from 'react';
import { Exercise } from '../types';
import { MathView } from './MathView';
import { FormattedMarkdownText } from './FormattedMarkdownText';
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
  Award,
  Columns2,
  Bot,
  Send,
  Loader2,
  Sparkles,
  X
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

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
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

  // Split-screen with AI Tutor state
  const [isSplitScreen, setIsSplitScreen] = useState<boolean>(false);
  const [tutorMessages, setTutorMessages] = useState<ChatMessage[]>([
    {
      id: 'tutor-init',
      role: 'model',
      text: `Hola. Estoy a tu disposición para este problema (**"${exercise.title}"**). Puedes preguntarme cómo enfocar el primer paso, dudas sobre fórmulas o pedirme que revise tu razonamiento.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [tutorInput, setTutorInput] = useState<string>('');
  const [isTutorLoading, setIsTutorLoading] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if exercise changes
  useEffect(() => {
    setSeconds(initialTime);
    setIsFinished(initialCompleted);
    setShowSolution(initialCompleted);
    setIsRunning(!initialCompleted);
    setScratchpad('');
    setShowHints(false);
    setTutorMessages([
      {
        id: `tutor-init-${exercise.id}`,
        role: 'model',
        text: `Hola. Estoy a tu disposición para este problema (**"${exercise.title}"**). Puedes preguntarme cómo enfocar el primer paso, dudas sobre fórmulas o pedirme que revise tu razonamiento.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
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

  const handleToggleTimer = () => {
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

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const handleSendTutorQuery = async (customText?: string) => {
    const textToSend = (customText || tutorInput).trim();
    if (!textToSend || isTutorLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTutorMessages((prev) => [...prev, userMsg]);
    setTutorInput('');
    setIsTutorLoading(true);

    try {
      const exerciseContext = `Título del ejercicio: ${exercise.title} (${exercise.difficulty})\nEnunciado: ${exercise.statement}\nPistas: ${(exercise.hints || []).join('; ')}\nSolución oficial:\nRespuesta final: ${exercise.solution.finalAnswer}\nPasos:\n${exercise.solution.stepByStep.join('\n')}`;

      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          topicTitle: exercise.title,
          exerciseContext,
          history: tutorMessages.map((m) => ({ role: m.role, text: m.text }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTutorMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            role: 'model',
            text: data.answer || 'No se pudo generar respuesta.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('Respuesta inválida');
      }
    } catch {
      setTutorMessages((prev) => [
        ...prev,
        {
          id: `model-err-${Date.now()}`,
          role: 'model',
          text: 'Error al conectar con el Tutor IA. Verifica tu conexión o intenta reformular tu pregunta.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTutorLoading(false);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`mx-auto px-4 sm:px-6 py-6 transition-all ${
        isSplitScreen ? 'max-w-7xl' : 'max-w-4xl'
      }`}
    >
      {/* Top Navigation Bar: Back & Action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBackToExercises}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a ejercicios</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Split Screen with AI Tutor Toggle */}
          <button
            onClick={() => setIsSplitScreen(!isSplitScreen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isSplitScreen
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-50'
            }`}
            title="Dividir pantalla para consultar dudas con el Tutor IA en paralelo"
          >
            <Columns2 className="w-4 h-4" />
            <span>
              {isSplitScreen ? 'Pantalla Dividida (Activa)' : 'Dividir con Tutor IA'}
            </span>
          </button>

          {nextExercise && (
            <button
              onClick={() => onGoToNextExercise(nextExercise)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: 1 Col or 2 Col Split Screen */}
      <div
        className={`grid gap-6 ${
          isSplitScreen ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {/* Left Side: Exercise Details & Solver */}
        <div className="space-y-6">
          {/* Exercise Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
            {/* Header / Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <span
                className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  exercise.difficulty === 'fácil'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                    : exercise.difficulty === 'medio'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                }`}
              >
                Dificultad: {exercise.difficulty}
              </span>

              {/* Individual Problem Timer */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <Timer className="w-4 h-4 text-indigo-500" />
                <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">
                  {formatTime(seconds)}
                </span>
                <button
                  onClick={handleToggleTimer}
                  className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  title={isRunning ? 'Pausar tiempo' : 'Continuar tiempo'}
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleResetTimer}
                  className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  title="Reiniciar cronómetro"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Exercise Title */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
              {exercise.title}
            </h1>

            {/* Problem Statement */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 mb-6 text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200">
              <FormattedMarkdownText content={exercise.statement} />
            </div>

            {/* Hints Section */}
            {exercise.hints && exercise.hints.length > 0 && (
              <div className="mb-6">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{showHints ? 'Ocultar pistas' : '¿Necesitas una pista? (Pulsa aquí)'}</span>
                </button>

                {showHints && (
                  <div className="mt-3 p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 space-y-2 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                    {exercise.hints.map((h, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="font-bold text-amber-500">Pista {i + 1}:</span>
                        <div className="flex-1">
                          <FormattedMarkdownText content={h} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Interactive Scratchpad */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Borrador de cálculos y notas del alumno</span>
              </label>
              <textarea
                rows={3}
                value={scratchpad}
                onChange={(e) => setScratchpad(e.target.value)}
                placeholder="Escribe tus hipótesis, cálculos intermedios o simplificaciones..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            {/* Complete / Check Solution Button */}
            {!showSolution ? (
              <button
                onClick={handleFinish}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Finalizar y comprobar solución completa</span>
              </button>
            ) : (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Ejercicio completado en {formatTime(seconds)}
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Progreso sincronizado en tu cuenta
                </span>
              </div>
            )}
          </div>

          {/* Step-by-Step Solution Card */}
          {showSolution && (
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div className="flex items-center gap-2 pb-3 border-b border-emerald-100 dark:border-emerald-900/40">
                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Solución Oficial Explicada Paso a Paso
                </h3>
              </div>

              {/* Final Answer Banner */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                  Resultado Definitivo de Examen:
                </p>
                <div className="text-sm sm:text-base font-bold">
                  <FormattedMarkdownText content={exercise.solution.finalAnswer} />
                </div>
              </div>

              {/* Step by Step Breakdown */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Desglose paso a paso:
                </p>
                {exercise.solution.stepByStep.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <FormattedMarkdownText content={step} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Theoretical Note */}
              {exercise.solution.theoreticalNote && (
                <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-300">
                  <span className="font-bold">Aviso de cátedra ETSISI: </span>
                  <FormattedMarkdownText content={exercise.solution.theoreticalNote} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: AI Tutor Dock (when Split Screen is active) */}
        {isSplitScreen && (
          <div className="rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-white dark:bg-slate-900 flex flex-col h-[700px] overflow-hidden shadow-sm">
            {/* Tutor Header */}
            <div className="p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold leading-tight">Tutor IA en Pantalla Dividida</h3>
                  <p className="text-[10px] text-purple-200">Apoyo en directo para este ejercicio</p>
                </div>
              </div>

              <button
                onClick={() => setIsSplitScreen(false)}
                className="p-1 rounded text-white/80 hover:text-white cursor-pointer"
                title="Cerrar pantalla dividida"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Context Prompts */}
            <div className="p-2 bg-purple-50/70 dark:bg-purple-950/40 border-b border-purple-100 dark:border-purple-900/40 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
              <button
                onClick={() => handleSendTutorQuery('¿Cómo planteo el primer paso de este ejercicio?')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 hover:bg-purple-50 whitespace-nowrap font-medium transition-colors cursor-pointer"
              >
                🚀 ¿Cómo empiezo?
              </button>
              <button
                onClick={() => handleSendTutorQuery('¿Qué fórmulas o teoremas específicos se aplican aquí?')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 hover:bg-purple-50 whitespace-nowrap font-medium transition-colors cursor-pointer"
              >
                📐 Fórmulas aplicables
              </button>
              <button
                onClick={() => handleSendTutorQuery('Explícame paso a paso cómo simplificar este problema')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 hover:bg-purple-50 whitespace-nowrap font-medium transition-colors cursor-pointer"
              >
                💡 Paso a paso
              </button>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {tutorMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'model' && (
                    <div className="w-6 h-6 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-xs whitespace-pre-line font-medium shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/80 dark:border-slate-700/80'
                    }`}
                  >
                    {m.role === 'model' ? (
                      <FormattedMarkdownText content={m.text} />
                    ) : (
                      <p>{m.text}</p>
                    )}
                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        m.role === 'user' ? 'text-purple-200' : 'text-slate-400'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isTutorLoading && (
                <div className="flex items-center gap-2 p-2 text-xs text-purple-600 dark:text-purple-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>El Tutor IA está analizando el problema para ayudarte...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendTutorQuery();
              }}
              className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-2 shrink-0"
            >
              <input
                type="text"
                value={tutorInput}
                onChange={(e) => setTutorInput(e.target.value)}
                placeholder="Pregunta cualquier duda sobre este ejercicio..."
                className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={!tutorInput.trim() || isTutorLoading}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white transition-colors cursor-pointer"
                title="Enviar duda al Tutor IA"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
