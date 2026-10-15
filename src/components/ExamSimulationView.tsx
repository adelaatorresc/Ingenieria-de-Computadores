import React, { useState, useEffect, useRef } from 'react';
import { Topic, Subject } from '../types';
import confetti from 'canvas-confetti';
import {
  Timer,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  HelpCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';

interface ExamSimulationViewProps {
  subject: Subject;
  topic: Topic;
  onExit: () => void;
}

export const ExamSimulationView: React.FC<ExamSimulationViewProps> = ({
  subject,
  topic,
  onExit
}) => {
  // 2 hours in seconds = 7200
  const INITIAL_EXAM_TIME = 7200;
  const [timeLeft, setTimeLeft] = useState<number>(INITIAL_EXAM_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [developmentAnswers, setDevelopmentAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<{ obtained: number; total: number; percentage: number } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer
  useEffect(() => {
    if (isTimerRunning && !isSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, isSubmitted]);

  const formatCountdown = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitExam = () => {
    setIsTimerRunning(false);
    setIsSubmitted(true);

    let totalPoints = 0;
    let earnedPoints = 0;

    topic.examQuestions.forEach((q) => {
      totalPoints += q.points;
      if (selectedAnswers[q.id] === q.correctIndex) {
        earnedPoints += q.points;
      }
    });

    // If there are complex exercises in the exam, add their weight
    const complexExercises = topic.exercises.slice(0, 2);
    complexExercises.forEach(() => {
      totalPoints += 5; // 5 points per practical problem
      earnedPoints += 4; // base credit for review
    });

    if (totalPoints === 0) totalPoints = 10;

    const finalPct = Math.round((earnedPoints / totalPoints) * 100);
    setScore({ obtained: earnedPoints, total: totalPoints, percentage: finalPct });

    if (finalPct >= 50) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch {
        // fallback
      }
    }
  };

  const handleRestart = () => {
    setTimeLeft(INITIAL_EXAM_TIME);
    setIsTimerRunning(true);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setDevelopmentAnswers({});
    setScore(null);
  };

  // Complex practical problems for the exam (drawn from topic's advanced collection)
  const examPracticalProblems = topic.exercises.slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Sticky Exam Top Bar */}
      <div className="sticky top-20 z-30 mb-8 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-rose-200 dark:border-rose-900/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            Simulacro Oficial de Examen · {subject.shortName}
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {topic.title}
          </h2>
        </div>

        {/* 2-Hour Countdown Timer */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
            timeLeft < 600
              ? 'bg-rose-100 border-rose-300 text-rose-800 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
          }`}>
            <Timer className="w-4 h-4 text-rose-500" />
            <span className="font-mono text-base font-bold tabular-nums">
              {formatCountdown(timeLeft)}
            </span>
          </div>

          {!isSubmitted && (
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            >
              {isTimerRunning ? 'Pausar' : 'Reanudar'}
            </button>
          )}

          {!isSubmitted ? (
            <button
              onClick={handleSubmitExam}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Entregar examen</span>
            </button>
          ) : (
            <button
              onClick={handleRestart}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repetir</span>
            </button>
          )}
        </div>
      </div>

      {/* Submitted Result Scorecard */}
      {isSubmitted && score && (
        <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-500/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg ${
                score.percentage >= 50 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {score.percentage >= 50 ? 'APTO' : 'NO APTO'}
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  Calificación del Simulacro
                </p>
                <h3 className="text-2xl font-extrabold mt-0.5">
                  {score.obtained} / {score.total} puntos ({score.percentage}%)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Tiempo empleado: {formatCountdown(INITIAL_EXAM_TIME - timeLeft)} (límite máximo: 2 horas)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRestart}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                Reintentar prueba
              </button>
              <button
                onClick={onExit}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-md"
              >
                Volver al tema
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Content */}
      <div className="space-y-8">
        
        {/* Section 1: Questions (Multiple Choice) */}
        {topic.examQuestions.length > 0 && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <span>Parte 1: Cuestiones Teórico-Prácticas Tipo Test</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selecciona la opción correcta. Cada respuesta correcta suma puntos.
              </p>
            </div>

            <div className="space-y-4">
              {topic.examQuestions.map((q, qIndex) => {
                const userChoice = selectedAnswers[q.id];
                const hasAnswered = userChoice !== undefined;
                const isCorrect = userChoice === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-6 rounded-2xl border transition-all ${
                      isSubmitted
                        ? isCorrect
                          ? 'border-emerald-300 bg-emerald-50/20 dark:border-emerald-900 dark:bg-emerald-950/20'
                          : 'border-rose-300 bg-rose-50/20 dark:border-rose-900 dark:bg-rose-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center">
                          {qIndex + 1}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {q.question}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-slate-400 shrink-0">
                        {q.points} pts
                      </span>
                    </div>

                    {/* Options list */}
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userChoice === optIdx;
                        const isTargetCorrect = q.correctIndex === optIdx;

                        let optClasses = 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700';

                        if (isSubmitted) {
                          if (isTargetCorrect) {
                            optClasses = 'border-emerald-500 bg-emerald-100/50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold';
                          } else if (isChosen && !isCorrect) {
                            optClasses = 'border-rose-500 bg-rose-100/50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200';
                          }
                        } else if (isChosen) {
                          optClasses = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold ring-1 ring-indigo-500';
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-all ${optClasses}`}
                          >
                            <span>{opt}</span>
                            {isSubmitted && isTargetCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                            )}
                            {isSubmitted && isChosen && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 ml-2" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation when submitted */}
                    {isSubmitted && (
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/40 p-3 rounded-xl">
                        <strong className="text-indigo-600 dark:text-indigo-400">Justificación oficial: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 2: Complex Practical Problems */}
        {examPracticalProblems.length > 0 && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-rose-600" />
                <span>Parte 2: Problemas Complejos de Desarrollo (Formato Examen)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Desarrolla la resolución en tu borrador. Al entregar el simulacro se revelará la resolución oficial para autocorrección.
              </p>
            </div>

            <div className="space-y-6">
              {examPracticalProblems.map((prob, pIdx) => (
                <div
                  key={prob.id}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                      Problema {pIdx + 1}
                    </span>
                    <span className="text-xs font-mono text-slate-400">5 puntos</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {prob.title}
                  </h4>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed mb-4 border border-slate-200/80 dark:border-slate-700/80">
                    {prob.statement}
                  </div>

                  {/* Student Answer Box */}
                  {!isSubmitted ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Tu desarrollo o resultado final:
                      </label>
                      <textarea
                        value={developmentAnswers[prob.id] || ''}
                        onChange={(e) => setDevelopmentAnswers(prev => ({ ...prev, [prob.id]: e.target.value }))}
                        rows={3}
                        placeholder="Escribe tu resultado o razonamiento..."
                        className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  ) : (
                    /* Revealed solution on submission */
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                      <div>
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          Solución Oficial:
                        </p>
                        <p className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs mt-1">
                          {prob.solution.finalAnswer}
                        </p>
                      </div>

                      <div className="space-y-2">
                        {prob.solution.stepByStep.map((s, sIdx) => (
                          <div key={sIdx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Submit Banner */}
      {!isSubmitted && (
        <div className="mt-12 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              ¿Has revisado todas tus respuestas?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Puedes entregar en cualquier momento antes de que expiren las 2 horas.
            </p>
          </div>

          <button
            onClick={handleSubmitExam}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Entregar y Calificar Simulacro</span>
          </button>
        </div>
      )}
    </div>
  );
};
