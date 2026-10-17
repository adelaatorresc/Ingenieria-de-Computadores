import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings,
  Volume2,
  VolumeX,
  CheckCircle2,
  Coffee,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface PomodoroStudyViewProps {
  onBack: () => void;
  onRecordStudyTime?: (seconds: number) => void;
}

interface IntervalConfig {
  id: string;
  type: 'work' | 'break';
  label: string;
  durationMinutes: number;
}

export const PomodoroStudyView: React.FC<PomodoroStudyViewProps> = ({
  onBack,
  onRecordStudyTime
}) => {
  // Preset defaults: 5 intervals (3 work, 2 breaks)
  const defaultIntervals: IntervalConfig[] = [
    { id: '1', type: 'work', label: '1.º Bloque: Estudio concentrado', durationMinutes: 25 },
    { id: '2', type: 'break', label: '2.º Bloque: Descanso breve', durationMinutes: 5 },
    { id: '3', type: 'work', label: '3.º Bloque: Estudio concentrado', durationMinutes: 25 },
    { id: '4', type: 'break', label: '4.º Bloque: Descanso breve', durationMinutes: 5 },
    { id: '5', type: 'work', label: '5.º Bloque: Consolidación y problemas', durationMinutes: 30 }
  ];

  const [intervals, setIntervals] = useState<IntervalConfig[]>(defaultIntervals);
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(defaultIntervals[0].durationMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState<number>(0);

  // Custom interval inputs
  const [customWorkMin, setCustomWorkMin] = useState<number>(25);
  const [customBreakMin, setCustomBreakMin] = useState<number>(5);
  const [customIntervalCount, setCustomIntervalCount] = useState<number>(5);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play synthetic pleasant sound using Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const now = audioCtx.currentTime;

      // Primary tone
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880.0, now + 0.15); // A5
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.8);

      // Harmony tone
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880.0, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6
      gain2.gain.setValueAtTime(0.2, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 1.2);
    } catch {
      // AudioContext unavailable
    }
  };

  // Interval timer tick
  useEffect(() => {
    if (isRunning && !sessionCompleted) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            playChime();
            // Advance interval or complete session
            if (currentIntervalIndex < intervals.length - 1) {
              const nextIdx = currentIntervalIndex + 1;
              setCurrentIntervalIndex(nextIdx);
              return intervals[nextIdx].durationMinutes * 60;
            } else {
              // Session finished!
              clearInterval(timerRef.current!);
              setIsRunning(false);
              setSessionCompleted(true);
              try {
                confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
              } catch {
                // safe
              }
              return 0;
            }
          }
          return prev - 1;
        });

        // Track total seconds studied
        setTotalSessionSeconds((prev) => {
          const updated = prev + 1;
          if (onRecordStudyTime) onRecordStudyTime(1);
          return updated;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, sessionCompleted, currentIntervalIndex, intervals, soundEnabled, onRecordStudyTime]);

  const currentInterval = intervals[currentIntervalIndex] || intervals[0];
  const isWork = currentInterval.type === 'work';

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTotalSeconds = currentInterval.durationMinutes * 60;
  const progressPercent = Math.max(0, Math.min(100, Math.round(((currentTotalSeconds - secondsRemaining) / currentTotalSeconds) * 100)));

  const handleApplyConfig = () => {
    const newItems: IntervalConfig[] = [];
    for (let i = 0; i < customIntervalCount; i++) {
      const isWorkStep = i % 2 === 0;
      newItems.push({
        id: `int-${i + 1}`,
        type: isWorkStep ? 'work' : 'break',
        label: isWorkStep ? `${i + 1}.º Bloque: Estudio concentrado` : `${i + 1}.º Bloque: Descanso`,
        durationMinutes: isWorkStep ? customWorkMin : customBreakMin
      });
    }
    setIntervals(newItems);
    setCurrentIntervalIndex(0);
    setSecondsRemaining(newItems[0].durationMinutes * 60);
    setIsRunning(false);
    setSessionCompleted(false);
    setIsConfigOpen(false);
  };

  const handleSkip = () => {
    playChime();
    if (currentIntervalIndex < intervals.length - 1) {
      const nextIdx = currentIntervalIndex + 1;
      setCurrentIntervalIndex(nextIdx);
      setSecondsRemaining(intervals[nextIdx].durationMinutes * 60);
    } else {
      setIsRunning(false);
      setSessionCompleted(true);
    }
  };

  const handleRestartSession = () => {
    setCurrentIntervalIndex(0);
    setSecondsRemaining(intervals[0].durationMinutes * 60);
    setIsRunning(false);
    setSessionCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-1 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la vista anterior</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Temporizador Pomodoro y Bloques de Estudio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Maximiza tu concentración con intervalos ajustables de estudio y descansos con alarma sonora.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
              soundEnabled
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
            title={soundEnabled ? 'Sonido activado' : 'Sonido silenciado'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-semibold"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Ajustar intervalos</span>
          </button>
        </div>
      </div>

      {/* Interval Configuration Drawer */}
      {isConfigOpen && (
        <div className="mb-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-800 shadow-xl space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Configuración personalizada de la sesión
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Número total de intervalos:
              </label>
              <input
                type="number"
                min={2}
                max={12}
                value={customIntervalCount}
                onChange={(e) => setCustomIntervalCount(parseInt(e.target.value) || 4)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Minutos por intervalo de estudio:
              </label>
              <input
                type="number"
                min={5}
                max={120}
                value={customWorkMin}
                onChange={(e) => setCustomWorkMin(parseInt(e.target.value) || 25)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Minutos por intervalo de descanso:
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={customBreakMin}
                onChange={(e) => setCustomBreakMin(parseInt(e.target.value) || 5)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsConfigOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleApplyConfig}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              Aplicar y Reiniciar Sesión
            </button>
          </div>
        </div>
      )}

      {/* Main Timer Display */}
      {!sessionCompleted ? (
        <div className="space-y-6">
          <div className={`p-8 sm:p-12 rounded-3xl border-2 text-center transition-all shadow-xl relative overflow-hidden ${
            isWork
              ? 'border-indigo-200 dark:border-indigo-900 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20'
              : 'border-emerald-200 dark:border-emerald-900 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20'
          }`}>
            
            {/* Interval indicator pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              {isWork ? (
                <Sparkles className="w-4 h-4 text-indigo-500" />
              ) : (
                <Coffee className="w-4 h-4 text-emerald-500" />
              )}
              <span>{currentInterval.label}</span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">
                {currentIntervalIndex + 1} de {intervals.length}
              </span>
            </div>

            {/* Huge Clock Digit */}
            <div className="my-6">
              <span className="font-mono text-6xl sm:text-8xl md:text-9xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
                {formatTime(secondsRemaining)}
              </span>
            </div>

            {/* Circular / Line Progress */}
            <div className="max-w-md mx-auto mb-8">
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${isWork ? 'bg-indigo-600' : 'bg-emerald-500'}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                {progressPercent}% completado de este bloque
              </p>
            </div>

            {/* Main Action Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-8 py-4 rounded-2xl font-bold text-base shadow-lg transition-all transform hover:scale-105 flex items-center gap-3 ${
                  isRunning
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : isWork
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/30'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/30'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 ml-0.5" />
                    <span>Iniciar Temporizador</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSkip}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
                title="Saltar al siguiente bloque"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={handleRestartSession}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                title="Reiniciar bloque"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sequence Timeline */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Planificación de los {intervals.length} bloques
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {intervals.map((item, idx) => {
                const isPassed = idx < currentIntervalIndex;
                const isCurrent = idx === currentIntervalIndex;

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border text-xs text-left transition-all ${
                      isCurrent
                        ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 font-bold ring-2 ring-indigo-500/20'
                        : isPassed
                        ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/20 text-slate-500 line-through'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Paso {idx + 1}
                    </p>
                    <p className="truncate mt-0.5">{item.type === 'work' ? '💻 Estudio' : '☕ Descanso'}</p>
                    <p className="font-mono text-xs mt-1 font-semibold">{item.durationMinutes} min</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Session Completed Screen */
        <div className="p-8 sm:p-14 rounded-3xl border-2 border-emerald-400 dark:border-emerald-700 bg-white dark:bg-slate-900 text-center shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              ¡La sesión de estudio se ha completado!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-2">
              Has completado todos los {intervals.length} bloques planificados. Todo el tiempo ha quedado registrado en tu cuenta de estudiante.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={handleRestartSession}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all"
            >
              Iniciar otra sesión
            </button>
            <button
              onClick={onBack}
              className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50"
            >
              Volver a asignaturas
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
