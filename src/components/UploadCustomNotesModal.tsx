import React, { useState } from 'react';
import { Course, CourseId, SemesterId, Subject, Topic, SubTopic, Exercise } from '../types';
import { Upload, FileText, CheckCircle2, Sparkles, X, AlertCircle, Plus, BookOpen } from 'lucide-react';

interface UploadCustomNotesModalProps {
  courses: Course[];
  isOpen: boolean;
  onClose: () => void;
  onSaveNewTopic: (courseId: CourseId, semesterId: SemesterId, subjectId: string, newTopic: Topic) => void;
  onAddSubtopicsToExistingTopic: (courseId: CourseId, semesterId: SemesterId, subjectId: string, topicId: string, newSubtopics: SubTopic[], newExercises: Exercise[]) => void;
}

export const UploadCustomNotesModal: React.FC<UploadCustomNotesModalProps> = ({
  courses,
  isOpen,
  onClose,
  onSaveNewTopic,
  onAddSubtopicsToExistingTopic
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<CourseId>('1');
  const [selectedSemesterId, setSelectedSemesterId] = useState<SemesterId>('1');
  
  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const currentSemester = currentCourse.semesters.find(s => s.id === selectedSemesterId) || currentCourse.semesters[0];
  
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(currentSemester.subjects[0]?.id || '');
  const currentSubject = currentSemester.subjects.find(s => s.id === selectedSubjectId) || currentSemester.subjects[0];

  const [topicMode, setTopicMode] = useState<'new' | 'existing'>('new');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(currentSubject?.topics[0]?.id || '');
  
  // New topic metadata
  const [newTopicNumber, setNewTopicNumber] = useState<number>((currentSubject?.topics.length || 0) + 1);
  const [newTopicTitle, setNewTopicTitle] = useState<string>('');
  const [newTopicSubtitle, setNewTopicSubtitle] = useState<string>('');
  
  // Content input
  const [inputMethod, setInputMethod] = useState<'text' | 'file'>('text');
  const [pastedContent, setPastedContent] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle file reading
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setPastedContent(text || '');
    };
    reader.readAsText(file);
  };

  // Automated intelligent parser to turn user notes into rich topics
  const handleProcessAndSave = () => {
    if (!pastedContent.trim() && !newTopicTitle.trim()) {
      alert('Por favor, introduce el título del tema o el contenido de los apuntes.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const rawText = pastedContent.trim();
      const lines = rawText.split('\n').filter(l => l.trim().length > 0);

      // Extract or synthesize subtopics by splitting on headers or numbering
      const generatedSubtopics: SubTopic[] = [];
      const generatedExercises: Exercise[] = [];

      // Split content into chunks
      const paragraphs = rawText.split(/\n\s*\n/).filter(p => p.trim().length > 0);

      if (paragraphs.length <= 1 && lines.length > 0) {
        // Simple structure
        generatedSubtopics.push({
          id: `custom-sub-${Date.now()}-1`,
          title: `1. Contenido Principal: ${newTopicTitle || 'Fundamentos'}`,
          summary: lines.slice(0, 3).join(' ').substring(0, 220) + '...',
          explanation: rawText,
          keyFormulas: lines.filter(l => l.includes('=') || l.includes('->') || l.includes('+')).slice(0, 4),
          examTips: ['Revisar la definición rigurosa y las demostraciones del teorema.']
        });
      } else {
        paragraphs.forEach((p, idx) => {
          const pLines = p.split('\n');
          const pTitle = pLines[0].replace(/^[#*0-9.\- ]+/, '').trim() || `Punto ${idx + 1}`;
          const pBody = pLines.slice(1).join('\n').trim() || p;

          generatedSubtopics.push({
            id: `custom-sub-${Date.now()}-${idx}`,
            title: `${idx + 1}. ${pTitle}`,
            summary: pBody.substring(0, 200) + (pBody.length > 200 ? '...' : ''),
            explanation: pBody || p,
            keyFormulas: pLines.filter(l => l.includes('=') || l.includes('=>') || l.includes('->')).slice(0, 3)
          });
        });
      }

      // Generate a practical exercise from the notes
      generatedExercises.push({
        id: `custom-ej-${Date.now()}-1`,
        title: `Ejercicio Práctico 1: Aplicación de ${newTopicTitle || 'los conceptos'}`,
        difficulty: 'medio',
        statement: `A partir de los apuntes introducidos sobre "${newTopicTitle || 'este tema'}", resuelve y justifica la aplicación práctica de los conceptos explicados en el Punto 1.`,
        hints: ['Revisa la definición inicial y aplica las propiedades explicadas.'],
        solution: {
          finalAnswer: 'Solución justificada según los apuntes introducidos.',
          stepByStep: [
            '1. Identificar los datos iniciales y las hipótesis dadas en el enunciado.',
            '2. Aplicar la definición o fórmula fundamental descrita en la teoría.',
            '3. Concluir verificando la consistencia dimensional y matemática del resultado.'
          ],
          theoreticalNote: 'Generado automáticamente a partir de los apuntes subidos por el alumno.'
        }
      });

      if (topicMode === 'new') {
        const createdTopic: Topic = {
          id: `topic-custom-${Date.now()}`,
          number: newTopicNumber || (currentSubject.topics.length + 1),
          title: newTopicTitle || `Tema ${newTopicNumber}: Apuntes Incorporados`,
          subtitle: newTopicSubtitle || 'Tema personalizado añadido por el estudiante',
          description: `Unidad creada a partir de los apuntes y documentos cargados en la web. Incluye ${generatedSubtopics.length} puntos explicados y ejercicios generados.`,
          subtopics: generatedSubtopics,
          exercises: generatedExercises,
          examQuestions: [
            {
              id: `q-custom-${Date.now()}-1`,
              question: `Respecto a los contenidos de ${newTopicTitle || 'este tema'}, ¿cuál es la propiedad principal estudiada?`,
              options: [
                'La definición y condiciones establecidas en los apuntes',
                'Ninguna de las propiedades es aplicable',
                'Solo es válida en casos triviales',
                'Requiere suposiciones adicionales no contempladas'
              ],
              correctIndex: 0,
              explanation: 'Justificado directamente por la teoría introducida en este tema.',
              points: 2
            }
          ],
          practicalExamProblems: []
        };

        onSaveNewTopic(selectedCourseId, selectedSemesterId, currentSubject.id, createdTopic);
      } else {
        onAddSubtopicsToExistingTopic(
          selectedCourseId,
          selectedSemesterId,
          currentSubject.id,
          selectedTopicId,
          generatedSubtopics,
          generatedExercises
        );
      }

      setIsProcessing(false);
      setSuccessMessage('¡Apuntes y tema guardados con éxito! Ya puedes explorar sus mapas mentales, resúmenes y ejercicios.');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1800);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Subir Apuntes / Crear Nuevo Tema
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Guarda material propio en cualquier asignatura del Grado (generando mapas, resúmenes y ejercicios).
            </p>
          </div>
        </div>

        {successMessage ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
              {successMessage}
            </h3>
          </div>
        ) : (
          <div className="space-y-5 text-xs sm:text-sm">
            
            {/* 1. Selector de Curso y Semestre */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  1. Curso:
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => {
                    const cId = e.target.value as CourseId;
                    setSelectedCourseId(cId);
                    const c = courses.find(item => item.id === cId);
                    if (c && c.semesters[0]?.subjects[0]) {
                      setSelectedSubjectId(c.semesters[0].subjects[0].id);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  <option value="1">1.º Curso</option>
                  <option value="2">2.º Curso</option>
                  <option value="3">3.º Curso</option>
                  <option value="4">4.º Curso</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  2. Semestre:
                </label>
                <select
                  value={selectedSemesterId}
                  onChange={(e) => {
                    const sId = e.target.value as SemesterId;
                    setSelectedSemesterId(sId);
                    const s = currentCourse.semesters.find(item => item.id === sId);
                    if (s && s.subjects[0]) {
                      setSelectedSubjectId(s.subjects[0].id);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  <option value="1">1.º Semestre</option>
                  <option value="2">2.º Semestre</option>
                </select>
              </div>
            </div>

            {/* 2. Asignatura */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                3. Asignatura:
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
              >
                {currentSemester.subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.shortName}) - Cód. {s.code}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Modo de Tema: Nuevo tema o Añadir a tema existente */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                4. Destino de los apuntes:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTopicMode('new')}
                  className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                    topicMode === 'new'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <p className="flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-indigo-600" />
                    <span>Crear un nuevo Tema</span>
                  </p>
                  <p className="text-[11px] font-normal text-slate-500 mt-1">
                    Crea una nueva unidad didáctica completa.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setTopicMode('existing')}
                  disabled={!currentSubject || currentSubject.topics.length === 0}
                  className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                    topicMode === 'existing'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 disabled:opacity-50'
                  }`}
                >
                  <p className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Añadir a Tema Existente</span>
                  </p>
                  <p className="text-[11px] font-normal text-slate-500 mt-1">
                    Incorpora nuevos puntos a un tema actual.
                  </p>
                </button>
              </div>
            </div>

            {/* If New Topic, ask for Title and Number */}
            {topicMode === 'new' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Número de Tema:
                  </label>
                  <input
                    type="number"
                    value={newTopicNumber}
                    onChange={(e) => setNewTopicNumber(parseInt(e.target.value) || 1)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Título del Tema:
                  </label>
                  <input
                    type="text"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    placeholder="Ej. Grafos y Algoritmos de Dijkstra"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Selecciona el tema al que añadir los apuntes:
                </label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  {currentSubject.topics.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Input Method Toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  5. Contenido de los apuntes:
                </label>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setInputMethod('text')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      inputMethod === 'text'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Pegar texto / HTML
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMethod('file')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      inputMethod === 'file'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Subir archivo
                  </button>
                </div>
              </div>

              {inputMethod === 'file' ? (
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50 dark:bg-slate-800/30">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {uploadedFileName ? `Archivo seleccionado: ${uploadedFileName}` : 'Selecciona o arrastra tu archivo (.txt, .md, .html, .c)'}
                  </p>
                  <input
                    type="file"
                    accept=".txt,.md,.html,.c,.pdf,.json"
                    onChange={handleFileUpload}
                    className="mt-3 text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:font-semibold cursor-pointer"
                  />
                </div>
              ) : (
                <textarea
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                  placeholder="Pega aquí el contenido de tus apuntes, texto de diapositivas o código HTML..."
                  rows={6}
                  className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcessAndSave}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isProcessing ? 'Generando resúmenes y mapas...' : 'Guardar y Generar Tema'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
