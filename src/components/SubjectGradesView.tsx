import React, { useState, useEffect, useMemo } from 'react';
import { Subject, Course, GradeItem } from '../types';
import {
  Award,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Calculator,
  ArrowLeft,
  Sparkles,
  Layers
} from 'lucide-react';

interface SubjectGradesViewProps {
  courses: Course[];
  userId: string;
  onBack: () => void;
}

export const SubjectGradesView: React.FC<SubjectGradesViewProps> = ({
  courses,
  userId,
  onBack
}) => {
  // Collect all subjects
  const allSubjects = React.useMemo(() => {
    const list: Subject[] = [];
    courses.forEach((c) => {
      c.semesters.forEach((sem) => {
        sem.subjects.forEach((subj) => {
          list.push(subj);
        });
      });
    });
    return list;
  }, [courses]);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    allSubjects[0]?.id || ''
  );

  // Default evaluation schemes for ETSISI subjects
  const defaultSubjectGrades: Record<string, GradeItem[]> = {
    fc: [
      { id: '1', title: 'Parcial de Combinacionales (Temas 1-3)', weightPercent: 30, score: 7.5 },
      { id: '2', title: 'Cuestionarios Moodle de Teoría', weightPercent: 10, score: 9.0 },
      { id: '3', title: 'Prácticas de Simulación Multisim', weightPercent: 20, score: 8.5 },
      { id: '4', title: 'Examen Final Ordinario', weightPercent: 40, score: 6.8 }
    ],
    am: [
      { id: '1', title: 'Prueba de Evaluación Continua 1', weightPercent: 25, score: 6.5 },
      { id: '2', title: 'Prueba de Evaluación Continua 2', weightPercent: 25, score: 7.0 },
      { id: '3', title: 'Examen Final Teórico-Práctico', weightPercent: 50, score: 7.5 }
    ],
    lymd: [
      { id: '1', title: 'Parcial 1: Conjuntos y Aritmética', weightPercent: 30, score: 8.0 },
      { id: '2', title: 'Parcial 2: Combinatoria y Grafos', weightPercent: 30, score: 7.5 },
      { id: '3', title: 'Examen Final / Prácticas', weightPercent: 40, score: 8.2 }
    ],
    fp: [
      { id: '1', title: 'Pruebas Prácticas de Laboratorio C', weightPercent: 30, score: 8.5 },
      { id: '2', title: 'Examen Parcial de Programación', weightPercent: 30, score: 7.0 },
      { id: '3', title: 'Proyecto Final de la Asignatura', weightPercent: 40, score: 9.0 }
    ],
    tso: [
      { id: '1', title: 'Prácticas de Shell y Comandos', weightPercent: 50, score: 9.0 },
      { id: '2', title: 'Examen Práctico de Laboratorio', weightPercent: 50, score: 8.0 }
    ]
  };

  // State with user-scoped persistence
  const storageKey = `etsisi_grades_${userId}`;
  const [gradesData, setGradesData] = useState<Record<string, GradeItem[]>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultSubjectGrades;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(gradesData));
    } catch {
      // safe
    }
  }, [gradesData, storageKey]);

  const currentSubject = allSubjects.find((s) => s.id === selectedSubjectId) || allSubjects[0];
  const items = gradesData[selectedSubjectId] || [];

  const totalWeight = items.reduce((acc, it) => acc + (Number(it.weightPercent) || 0), 0);
  const isComplete = totalWeight === 100;

  // Weighted grade calculation
  const weightedGrade = useMemo(() => {
    if (!isComplete || items.length === 0) return null;
    const sum = items.reduce((acc, it) => acc + (Number(it.score) || 0) * (Number(it.weightPercent) / 100), 0);
    return Math.round(sum * 100) / 100;
  }, [items, isComplete]);

  const getGradeLabel = (grade: number) => {
    if (grade >= 9.5) return { label: 'Matrícula de Honor', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60' };
    if (grade >= 9.0) return { label: 'Sobresaliente', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60' };
    if (grade >= 7.0) return { label: 'Notable', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' };
    if (grade >= 5.0) return { label: 'Aprobado', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60' };
    return { label: 'Suspenso', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60' };
  };

  const handleUpdateItem = (id: string, field: 'title' | 'weightPercent' | 'score', value: string | number) => {
    setGradesData((prev) => {
      const currentList = prev[selectedSubjectId] || [];
      const updated = currentList.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
      return { ...prev, [selectedSubjectId]: updated };
    });
  };

  const handleAddItem = () => {
    const newItem: GradeItem = {
      id: `item-${Date.now()}`,
      title: 'Nueva prueba o entrega',
      weightPercent: Math.max(0, 100 - totalWeight),
      score: 5.0
    };
    setGradesData((prev) => ({
      ...prev,
      [selectedSubjectId]: [...(prev[selectedSubjectId] || []), newItem]
    }));
  };

  const handleDeleteItem = (id: string) => {
    setGradesData((prev) => ({
      ...prev,
      [selectedSubjectId]: (prev[selectedSubjectId] || []).filter((item) => item.id !== id)
    }));
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
            Calculadora Oficial de Calificaciones y Notas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Introduce las pruebas de clase y exámenes. Al sumar el 100% de la ponderación se calcula automáticamente la nota final.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold self-start sm:self-auto">
          <Calculator className="w-4 h-4" />
          <span>ETSISI Plan 61CI</span>
        </div>
      </div>

      {/* Subject Selector Bar */}
      <div className="mb-8 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
          Selecciona la asignatura:
        </label>
        <select
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm"
        >
          {allSubjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.shortName}) - {s.ects} ECTS - Código {s.code}
            </option>
          ))}
        </select>
      </div>

      {/* Evaluation Items List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Criterios de Evaluación: {currentSubject?.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pruebas continuas, prácticas y examen final.
            </p>
          </div>

          <button
            onClick={handleAddItem}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir prueba</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No hay pruebas añadidas para esta asignatura. Pulsa en "Añadir prueba" para configurar los porcentajes.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                    placeholder="Nombre de la prueba"
                    className="w-full text-xs sm:text-sm font-semibold bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:outline-none py-1"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-400">Ponderación:</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={item.weightPercent}
                        onChange={(e) => handleUpdateItem(item.id, 'weightPercent', parseFloat(e.target.value) || 0)}
                        className="w-16 p-1.5 pr-5 text-right font-mono font-bold text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                      <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-bold">%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-400">Nota (0-10):</label>
                    <input
                      type="number"
                      step={0.1}
                      min={0}
                      max={10}
                      value={item.score}
                      onChange={(e) => handleUpdateItem(item.id, 'score', parseFloat(e.target.value) || 0)}
                      className="w-16 p-1.5 text-right font-mono font-bold text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400"
                    />
                  </div>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Eliminar prueba"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Weight Status Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-600 dark:text-slate-400">Suma total de ponderaciones:</span>
            <span className={`font-mono font-bold ${
              totalWeight === 100
                ? 'text-emerald-600 dark:text-emerald-400'
                : totalWeight > 100
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}>
              {totalWeight}% / 100%
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-3">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                totalWeight === 100
                  ? 'bg-emerald-500'
                  : totalWeight > 100
                  ? 'bg-rose-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, totalWeight)}%` }}
            />
          </div>

          {!isComplete && (
            <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {totalWeight < 100
                  ? `Falta un ${(100 - totalWeight).toFixed(1)}% para completar el 100% de la evaluación y calcular tu nota final.`
                  : `La ponderación suma ${totalWeight}%, superando el 100%. Por favor, ajusta los porcentajes.`}
              </span>
            </p>
          )}
        </div>

        {/* Final Grade Score Banner (Computed when exactly 100%) */}
        {isComplete && weightedGrade !== null && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center font-bold text-3xl text-emerald-400 font-mono shadow-inner">
                {weightedGrade.toFixed(2)}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  Nota Final Calculada
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-xl font-bold">
                    {weightedGrade >= 5.0 ? '¡Asignatura Superada!' : 'Asignatura no superada'}
                  </h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getGradeLabel(weightedGrade).color}`}>
                    {getGradeLabel(weightedGrade).label}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Ponderación al 100% verificada para {currentSubject.name}.
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Guardado en tu perfil
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
