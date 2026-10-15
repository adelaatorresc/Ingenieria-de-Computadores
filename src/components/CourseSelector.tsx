import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Layers, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Course, CourseId, SemesterId, Subject } from '../types';

interface CourseSelectorProps {
  courses: Course[];
  selectedCourseId: CourseId | null;
  selectedSemesterId: SemesterId | null;
  onSelectSubject: (courseId: CourseId, semesterId: SemesterId, subject: Subject) => void;
}

export const CourseSelector: React.FC<CourseSelectorProps> = ({
  courses,
  selectedCourseId,
  selectedSemesterId,
  onSelectSubject
}) => {
  // Default to 1st course open
  const [expandedCourses, setExpandedCourses] = useState<Record<CourseId, boolean>>({
    '1': true,
    '2': false,
    '3': false,
    '4': false
  });

  const [expandedSemesters, setExpandedSemesters] = useState<Record<string, boolean>>({
    '1-1': true,
    '1-2': false,
    '2-1': false,
    '2-2': false,
    '3-1': false,
    '3-2': false,
    '4-1': false,
    '4-2': false
  });

  const toggleCourse = (cId: CourseId) => {
    setExpandedCourses(prev => ({ ...prev, [cId]: !prev[cId] }));
  };

  const toggleSemester = (key: string) => {
    setExpandedSemesters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Intro banner */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Plan de Estudios · Grado en Ingeniería de Computadores
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-2xl">
          Selecciona tu curso y semestre para acceder a los temas, mapas mentales, resúmenes, explicaciones y problemas resueltos oficiales de los PDFs.
        </p>
      </div>

      {/* Courses Accordion List */}
      <div className="space-y-4">
        {courses.map((course) => {
          const isCourseExpanded = !!expandedCourses[course.id];
          const hasActiveContent = course.id === '1';

          return (
            <div
              key={course.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isCourseExpanded
                  ? 'border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 shadow-md shadow-indigo-950/5'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Course Header Button */}
              <button
                onClick={() => toggleCourse(course.id)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors"
                aria-expanded={isCourseExpanded}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base transition-colors ${
                    hasActiveContent
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {course.id}º
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {course.name}
                      </h2>
                      {hasActiveContent && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Material de PDFs activo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {course.semesters.length} semestres · {course.semesters.reduce((acc, s) => acc + s.subjects.length, 0)} asignaturas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-400">
                  <span className="text-xs font-medium hidden sm:inline">
                    {isCourseExpanded ? 'Ocultar semestres' : 'Desplegar semestres'}
                  </span>
                  {isCourseExpanded ? (
                    <ChevronDown className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </div>
              </button>

              {/* Course Content: Semesters */}
              {isCourseExpanded && (
                <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-100 dark:border-slate-800/80">
                  {course.semesters.map((semester) => {
                    const semKey = `${course.id}-${semester.id}`;
                    const isSemExpanded = !!expandedSemesters[semKey];

                    return (
                      <div
                        key={semester.id}
                        className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden"
                      >
                        {/* Semester Header */}
                        <button
                          onClick={() => toggleSemester(semKey)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Layers className="w-4 h-4 text-indigo-500" />
                            <div>
                              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {semester.name}
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {semester.subjects.length} asignaturas
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-slate-400">
                            {isSemExpanded ? (
                              <ChevronDown className="w-4 h-4 text-indigo-500" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                        </button>

                        {/* Semester Subjects Grid */}
                        {isSemExpanded && (
                          <div className="p-4 pt-1 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-200/60 dark:border-slate-800/60">
                            {semester.subjects.map((subject) => {
                              const hasPDFs = subject.topics.length > 0;
                              const totalExercises = subject.topics.reduce(
                                (acc, t) => acc + t.exercises.length,
                                0
                              );

                              return (
                                <button
                                  key={subject.id}
                                  onClick={() => onSelectSubject(course.id, semester.id, subject)}
                                  className="group relative flex flex-col justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/90 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all text-left"
                                >
                                  <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                                        {subject.shortName}
                                      </span>
                                      <span className="text-[11px] text-slate-400 font-mono">
                                        {subject.ects} ECTS
                                      </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                      {subject.name}
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                      {subject.description}
                                    </p>
                                  </div>

                                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs">
                                    {hasPDFs ? (
                                      <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        {subject.topics.length} temas cargados
                                        {totalExercises > 0 && ` · ${totalExercises} ejercicios`}
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-slate-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        Guía docente
                                      </span>
                                    )}
                                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                                      Entrar →
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
