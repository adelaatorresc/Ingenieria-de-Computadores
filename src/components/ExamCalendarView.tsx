import React, { useState, useMemo } from 'react';
import { Subject, Course, ExamEvent, CourseId, SemesterId } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Building,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  CalendarDays,
  Target,
  GraduationCap,
  Layers,
  X,
  Filter,
  Upload,
  FileText,
  Sparkles,
  Loader2,
  AlertCircle,
  FileCheck
} from 'lucide-react';

interface ExamCalendarViewProps {
  courses: Course[];
  exams: ExamEvent[];
  onUpdateExams: (updated: ExamEvent[]) => void;
  onBack: () => void;
  onGoToStudyPlanner: (exam: ExamEvent) => void;
}

interface SubjectOption {
  subject: Subject;
  courseId: CourseId;
  courseName: string;
  semesterId: SemesterId;
  semesterName: string;
}

export const ExamCalendarView: React.FC<ExamCalendarViewProps> = ({
  courses,
  exams,
  onUpdateExams,
  onBack,
  onGoToStudyPlanner
}) => {
  // Collect all subjects from all courses and all semesters
  const allSubjectOptions = useMemo<SubjectOption[]>(() => {
    const list: SubjectOption[] = [];
    courses.forEach((c) => {
      c.semesters.forEach((sem) => {
        sem.subjects.forEach((subj) => {
          list.push({
            subject: subj,
            courseId: c.id,
            courseName: c.name,
            semesterId: sem.id,
            semesterName: sem.name
          });
        });
      });
    });
    return list;
  }, [courses]);

  // Filters for display
  const [filterSemester, setFilterSemester] = useState<'all' | '1' | '2'>('all');
  const [filterCourse, setFilterCourse] = useState<'all' | CourseId>('all');

  // Manual Form modal state
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [formCourseId, setFormCourseId] = useState<CourseId>('1');
  const [formSemesterId, setFormSemesterId] = useState<SemesterId>('2');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('alg');
  const [isCustomSubject, setIsCustomSubject] = useState<boolean>(false);
  const [customSubjectName, setCustomSubjectName] = useState<string>('');

  const [newTitle, setNewTitle] = useState<string>('');
  const [newDate, setNewDate] = useState<string>('2027-04-15');
  const [newTime, setNewTime] = useState<string>('10:00');
  const [newBlock, setNewBlock] = useState<string>('Bloque 4 (Aulario)');
  const [newClassroom, setNewClassroom] = useState<string>('Aula 1002');
  const [newWeight, setNewWeight] = useState<number>(30);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopicInput, setCustomTopicInput] = useState<string>('');

  // PDF Upload modal state
  const [isUploadingPdf, setIsUploadingPdf] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [rawSyllabusText, setRawSyllabusText] = useState<string>('');
  const [isParsingPdf, setIsParsingPdf] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedExamsPreview, setParsedExamsPreview] = useState<ExamEvent[]>([]);
  const [selectedParsedIds, setSelectedParsedIds] = useState<Record<string, boolean>>({});

  // Available subjects matching selected course & semester in the form
  const availableSubjects = useMemo(() => {
    return allSubjectOptions.filter(
      (opt) => opt.courseId === formCourseId && opt.semesterId === formSemesterId
    );
  }, [allSubjectOptions, formCourseId, formSemesterId]);

  // When course or semester changes, reset selectedSubjectId to first available
  React.useEffect(() => {
    if (availableSubjects.length > 0 && !isCustomSubject) {
      setSelectedSubjectId(availableSubjects[0].subject.id);
    }
  }, [formCourseId, formSemesterId, availableSubjects, isCustomSubject]);

  const currentSubjectObj = availableSubjects.find(
    (opt) => opt.subject.id === selectedSubjectId
  )?.subject;

  // Add custom topic
  const handleAddCustomTopic = () => {
    if (customTopicInput.trim() && !selectedTopics.includes(customTopicInput.trim())) {
      setSelectedTopics([...selectedTopics, customTopicInput.trim()]);
      setCustomTopicInput('');
    }
  };

  const handleToggleTopic = (tTitle: string) => {
    if (selectedTopics.includes(tTitle)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== tTitle));
    } else {
      setSelectedTopics([...selectedTopics, tTitle]);
    }
  };

  // Submit manual exam creation
  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();

    let finalSubjectName = '';
    let finalSubjectId = '';

    if (isCustomSubject) {
      finalSubjectName = customSubjectName.trim() || 'Asignatura Optativa';
      finalSubjectId = 'custom-' + Date.now();
    } else {
      const found = availableSubjects.find((s) => s.subject.id === selectedSubjectId);
      finalSubjectName = found ? found.subject.name : 'Asignatura ETSISI';
      finalSubjectId = selectedSubjectId;
    }

    const newExam: ExamEvent = {
      id: `exam-${Date.now()}`,
      title: newTitle.trim() || `Examen de ${finalSubjectName}`,
      subjectId: finalSubjectId,
      subjectName: finalSubjectName,
      courseId: formCourseId,
      semesterId: formSemesterId,
      date: newDate,
      time: newTime || '10:00',
      buildingBlock: newBlock.trim() || 'Bloque 4 (Aulario)',
      classroom: newClassroom.trim() || 'Aula 1002',
      topicsCovered: selectedTopics.length > 0 ? selectedTopics : ['Temario completo'],
      weightPercentage: Number(newWeight) || 30,
      completed: false
    };

    onUpdateExams([...exams, newExam]);
    setIsAdding(false);

    // Reset fields
    setNewTitle('');
    setSelectedTopics([]);
    setCustomTopicInput('');
    setIsCustomSubject(false);
    setCustomSubjectName('');
  };

  // Handle PDF upload and AI parsing
  const handleProcessPdfExams = async () => {
    if (!uploadFile && !rawSyllabusText.trim()) {
      setParseError('Por favor selecciona un archivo PDF o pega el texto del calendario de exámenes.');
      return;
    }

    setIsParsingPdf(true);
    setParseError(null);

    try {
      let fileData: string | undefined = undefined;
      let mimeType: string | undefined = undefined;

      if (uploadFile) {
        mimeType = uploadFile.type || 'application/pdf';
        fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(uploadFile);
        });
      }

      const res = await fetch('/api/parse-exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData,
          mimeType,
          rawText: rawSyllabusText.trim() || undefined
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al conectar con el servidor.');
      }

      const data = await res.json();
      if (!data.exams || data.exams.length === 0) {
        throw new Error('No se detectaron exámenes o parciales evaluables en el documento.');
      }

      setParsedExamsPreview(data.exams);
      // Select all by default
      const initialSelection: Record<string, boolean> = {};
      data.exams.forEach((ex: ExamEvent) => {
        initialSelection[ex.id] = true;
      });
      setSelectedParsedIds(initialSelection);
    } catch (err: any) {
      console.error(err);
      setParseError(err.message || 'Error al procesar el archivo. Asegúrate de que el PDF sea legible.');
    } finally {
      setIsParsingPdf(false);
    }
  };

  const handleConfirmImportParsedExams = () => {
    const toImport = parsedExamsPreview.filter((ex) => selectedParsedIds[ex.id]);
    if (toImport.length === 0) {
      setParseError('Selecciona al menos un examen para importar de la lista.');
      return;
    }

    onUpdateExams([...exams, ...toImport]);
    setIsUploadingPdf(false);
    setParsedExamsPreview([]);
    setUploadFile(null);
    setRawSyllabusText('');
  };

  const handleDeleteExam = (id: string) => {
    onUpdateExams(exams.filter((e) => e.id !== id));
  };

  const handleToggleCompleted = (id: string) => {
    onUpdateExams(
      exams.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  // Filtered and sorted exams
  const filteredExams = useMemo(() => {
    return exams
      .filter((e) => {
        if (filterSemester !== 'all' && e.semesterId && e.semesterId !== filterSemester) {
          return false;
        }
        if (filterCourse !== 'all' && e.courseId && e.courseId !== filterCourse) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [exams, filterSemester, filterCourse]);

  // Days left calculation
  const getDaysLeft = (dateStr: string) => {
    const target = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-2 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Volver al menú</span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Calendario de Exámenes Oficiales
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Planifica convocatorias de 1.º a 4.º curso (1.er y 2.º semestre) sincronizadas en tu cuenta.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setIsUploadingPdf(true);
              setParsedExamsPreview([]);
              setParseError(null);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Subir PDF con el calendario de exámenes para extraerlos automáticamente"
          >
            <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Subir PDF de exámenes</span>
          </button>

          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir examen</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Year Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs mb-8">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Semestre:</span>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setFilterSemester('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterSemester === 'all'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Todos ({exams.length})
            </button>
            <button
              onClick={() => setFilterSemester('1')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterSemester === '1'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              1.er Semestre
            </button>
            <button
              onClick={() => setFilterSemester('2')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterSemester === '2'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              2.º Semestre
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Curso:</span>
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value as any)}
            className="text-xs font-medium py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">Todos los cursos</option>
            <option value="1">1.º Curso (Plan 61CI)</option>
            <option value="2">2.º Curso</option>
            <option value="3">3.º Curso</option>
            <option value="4">4.º Curso</option>
          </select>
        </div>
      </div>

      {/* Empty State when no exams exist */}
      {filteredExams.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {exams.length === 0
              ? 'No tienes ningún examen registrado todavía'
              : 'No hay exámenes con los filtros seleccionados'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1.5 mb-6">
            {exams.length === 0
              ? 'Puedes añadir tus exámenes oficiales a mano especificando curso y semestre, o subir el PDF oficial de la ETSISI para que la IA extraiga todas las fechas al instante.'
              : 'Prueba a cambiar los filtros de curso o semestre para ver tus otras pruebas.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir examen a mano</span>
            </button>
            <button
              onClick={() => {
                setIsUploadingPdf(true);
                setParsedExamsPreview([]);
                setParseError(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Subir PDF de calendario</span>
            </button>
          </div>
        </div>
      ) : (
        /* Exams Grid Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExams.map((exam) => {
            const daysLeft = getDaysLeft(exam.date);
            const isUrgent = daysLeft >= 0 && daysLeft <= 14;
            const isPast = daysLeft < 0;

            return (
              <div
                key={exam.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                  exam.completed
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                    : isUrgent
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300/80 dark:border-amber-800/80 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300'
                }`}
              >
                <div>
                  {/* Card Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {exam.courseId && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                          {exam.courseId}.º Curso
                        </span>
                      )}
                      {exam.semesterId && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          {exam.semesterId}.º Semestre
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {exam.weightPercentage}% nota
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleCompleted(exam.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          exam.completed
                            ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60'
                            : 'text-slate-400 hover:text-emerald-500'
                        }`}
                        title={exam.completed ? 'Marcar como pendiente' : 'Marcar como completado'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Eliminar examen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Subject */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                    {exam.subjectName}
                  </p>

                  {/* Location & Time info */}
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="font-semibold">{exam.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{exam.time} h</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{exam.buildingBlock}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="font-mono text-[11px] truncate">{exam.classroom}</span>
                    </div>
                  </div>

                  {/* Topics covered pill list */}
                  {exam.topicsCovered && exam.topicsCovered.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Materia evaluada:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {exam.topicsCovered.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium truncate max-w-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Countdown & Study Planner CTA */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    {isPast ? (
                      <span className="text-xs font-semibold text-slate-400">Examen finalizado</span>
                    ) : daysLeft === 0 ? (
                      <span className="text-xs font-bold text-rose-600 animate-pulse">¡Es hoy!</span>
                    ) : (
                      <span
                        className={`text-xs font-bold ${
                          isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Quedan {daysLeft} {daysLeft === 1 ? 'día' : 'días'}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onGoToStudyPlanner(exam)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Plan de estudio</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Add Exam Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
                <span>Apuntar Examen o Parcial</span>
              </h2>
              <button
                onClick={() => setIsAdding(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Configura el curso, semestre, asignatura, aula oficial y peso en la nota final
            </p>

            <form onSubmit={handleCreateExam} className="space-y-4">
              {/* Step 1: Curso selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  <span>¿De qué curso es la asignatura?</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['1', '2', '3', '4'] as CourseId[]).map((cId) => (
                    <button
                      key={cId}
                      type="button"
                      onClick={() => setFormCourseId(cId)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        formCourseId === cId
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/30'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cId}.º Curso
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Semestre selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>¿De qué semestre?</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['1', '2'] as SemesterId[]).map((sId) => (
                    <button
                      key={sId}
                      type="button"
                      onClick={() => setFormSemesterId(sId)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        formSemesterId === sId
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-600/30'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {sId === '1' ? '1.er Semestre (Otoño)' : '2.º Semestre (Primavera)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Asignatura selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Asignatura ({formCourseId}.º Curso • {formSemesterId}.º Semestre)
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomSubject(!isCustomSubject)}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {isCustomSubject ? 'Elegir del plan oficial' : '¿Otra asignatura?'}
                  </button>
                </div>

                {!isCustomSubject ? (
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium cursor-pointer"
                  >
                    {availableSubjects.map((opt) => (
                      <option key={opt.subject.id} value={opt.subject.id}>
                        {opt.subject.name} ({opt.subject.shortName})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={customSubjectName}
                    onChange={(e) => setCustomSubjectName(e.target.value)}
                    placeholder="Ej. Álgebra, Física II, Redes de Computadores..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium"
                  />
                )}
              </div>

              {/* Title input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la prueba o convocatoria
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Parcial 1: Espacios vectoriales y Matrices"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha del examen
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hora de inicio
                  </label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Location info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bloque o Edificio
                  </label>
                  <input
                    type="text"
                    value={newBlock}
                    onChange={(e) => setNewBlock(e.target.value)}
                    placeholder="Ej. Bloque 4 (Aulario)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Aula o Laboratorio
                  </label>
                  <input
                    type="text"
                    value={newClassroom}
                    onChange={(e) => setNewClassroom(e.target.value)}
                    placeholder="Ej. Aula 1002 / Lab 2.3"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Weight percentage */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Peso en la nota final
                  </label>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {newWeight}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={newWeight}
                  onChange={(e) => setNewWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Temas Cubiertos */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Temas incluidos en la prueba
                </label>

                {currentSubjectObj && currentSubjectObj.topics.length > 0 && (
                  <div className="space-y-1 max-h-32 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-2">
                    {currentSubjectObj.topics.map((t) => (
                      <label
                        key={t.id}
                        className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 hover:text-indigo-600 cursor-pointer p-1"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTopics.includes(t.title)}
                          onChange={() => handleToggleTopic(t.title)}
                          className="rounded text-indigo-600"
                        />
                        <span className="truncate">{t.title}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Custom topic add input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTopicInput}
                    onChange={(e) => setCustomTopicInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTopic();
                      }
                    }}
                    placeholder="Escribir tema (ej. Tema 1: Espacios Vectoriales)"
                    className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTopic}
                    className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 transition-colors cursor-pointer"
                  >
                    Añadir
                  </button>
                </div>

                {/* Selected topics badges */}
                {selectedTopics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedTopics.map((st, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1"
                      >
                        <span className="truncate max-w-[200px]">{st}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleTopic(st)}
                          className="hover:text-rose-500 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  Guardar examen en mi calendario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Exam Upload & Parser Modal */}
      {isUploadingPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Subir PDF o Calendario de Exámenes
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    La IA extraerá fechas, asignaturas, parciales y aulas oficiales automáticamente.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsUploadingPdf(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error badge */}
            {parseError && (
              <div className="p-3 my-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{parseError}</span>
              </div>
            )}

            {parsedExamsPreview.length === 0 ? (
              <div className="space-y-5 my-4">
                {/* File Dropzone */}
                <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-900/80 rounded-2xl p-6 text-center hover:border-indigo-400 transition-colors bg-indigo-50/30 dark:bg-indigo-950/20">
                  <FileText className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {uploadFile ? uploadFile.name : 'Arrastra tu archivo PDF o imagen del calendario aquí'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Formatos soportados: PDF oficial UPM, Word, TXT o capturas
                  </p>

                  <label className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer">
                    <span>Seleccionar archivo</span>
                    <input
                      type="file"
                      accept=".pdf,.txt,.md,image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setUploadFile(f);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                  <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 font-semibold absolute">
                    O PEGA EL TEXTO DEL CALENDARIO
                  </span>
                </div>

                {/* Paste Text fallback */}
                <div>
                  <textarea
                    rows={4}
                    value={rawSyllabusText}
                    onChange={(e) => setRawSyllabusText(e.target.value)}
                    placeholder="Pega aquí el texto copiado de la web de la ETSISI, el aula virtual Moodle o la guía docente..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  onClick={handleProcessPdfExams}
                  disabled={isParsingPdf || (!uploadFile && !rawSyllabusText.trim())}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isParsingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analizando documento y extrayendo exámenes con IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Extraer exámenes con Gemini IA</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Preview of Extracted Exams */
              <div className="space-y-4 my-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Se han detectado {parsedExamsPreview.length} exámenes oficiales
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const allSelected = Object.values(selectedParsedIds).every(Boolean);
                      const updated: Record<string, boolean> = {};
                      parsedExamsPreview.forEach((ex) => {
                        updated[ex.id] = !allSelected;
                      });
                      setSelectedParsedIds(updated);
                    }}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Marcar/Desmarcar todos
                  </button>
                </div>

                {/* List of extracted exams to review before adding */}
                <div className="max-h-72 overflow-y-auto space-y-2 p-1">
                  {parsedExamsPreview.map((ex) => (
                    <div
                      key={ex.id}
                      onClick={() =>
                        setSelectedParsedIds({
                          ...selectedParsedIds,
                          [ex.id]: !selectedParsedIds[ex.id]
                        })
                      }
                      className={`p-3.5 rounded-2xl border text-xs flex items-start gap-3 transition-all cursor-pointer ${
                        selectedParsedIds[ex.id]
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!selectedParsedIds[ex.id]}
                        onChange={() => {}}
                        className="rounded text-indigo-600 mt-1 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate">
                            {ex.title}
                          </h4>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 shrink-0">
                            {ex.date} {ex.time}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                          {ex.subjectName} · {ex.courseId}º Curso ({ex.semesterId}º Semestre)
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {ex.buildingBlock} · {ex.classroom} · {ex.weightPercentage}% nota
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setParsedExamsPreview([]);
                      setUploadFile(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Subir otro archivo
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmImportParsedExams}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    Importar al calendario
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
