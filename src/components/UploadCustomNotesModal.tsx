import React, { useState } from 'react';
import { Course, CourseId, SemesterId, Subject, Topic, SubTopic, Exercise, UploadedDocument } from '../types';
import {
  Upload,
  FileText,
  CheckCircle2,
  Sparkles,
  X,
  AlertCircle,
  Plus,
  BookOpen,
  Eye,
  Columns2,
  Trash2,
  FileQuestion,
  Download,
  ExternalLink
} from 'lucide-react';

interface UploadCustomNotesModalProps {
  courses: Course[];
  isOpen: boolean;
  onClose: () => void;
  onSaveNewTopic: (courseId: CourseId, semesterId: SemesterId, subjectId: string, newTopic: Topic) => void;
  onAddSubtopicsToExistingTopic: (courseId: CourseId, semesterId: SemesterId, subjectId: string, topicId: string, newSubtopics: SubTopic[], newExercises: Exercise[]) => void;
  uploadedDocuments?: UploadedDocument[];
  onSaveDocument?: (doc: UploadedDocument) => void;
  onDeleteDocument?: (docId: string) => void;
  onOpenDocument?: (doc: UploadedDocument) => void;
}

export const UploadCustomNotesModal: React.FC<UploadCustomNotesModalProps> = ({
  courses,
  isOpen,
  onClose,
  onSaveNewTopic,
  onAddSubtopicsToExistingTopic,
  uploadedDocuments = [],
  onSaveDocument,
  onDeleteDocument,
  onOpenDocument
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'my_docs'>('upload');

  const [selectedCourseId, setSelectedCourseId] = useState<CourseId>('1');
  const [selectedSemesterId, setSelectedSemesterId] = useState<SemesterId>('1');

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const currentSemester =
    currentCourse.semesters.find((s) => s.id === selectedSemesterId) || currentCourse.semesters[0];

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    currentSemester.subjects[0]?.id || ''
  );
  const currentSubject =
    currentSemester.subjects.find((s) => s.id === selectedSubjectId) || currentSemester.subjects[0];

  const [topicMode, setTopicMode] = useState<'new' | 'existing'>('new');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(currentSubject?.topics[0]?.id || '');

  // New topic metadata
  const [newTopicNumber, setNewTopicNumber] = useState<number>(
    (currentSubject?.topics.length || 0) + 1
  );
  const [newTopicTitle, setNewTopicTitle] = useState<string>('');
  const [newTopicSubtitle, setNewTopicSubtitle] = useState<string>('');

  // Content input
  const [inputMethod, setInputMethod] = useState<'text' | 'file'>('file');
  const [pastedContent, setPastedContent] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileDataUrl, setUploadedFileDataUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    if (!newTopicTitle) {
      setNewTopicTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (isPdf || isImage) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setUploadedFileDataUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      // Text or markdown
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setPastedContent(text || '');
      };
      reader.readAsText(file);
    }
  };

  // Save document and/or generate topic
  const handleSaveDocumentAndTopic = async () => {
    const title = newTopicTitle.trim() || uploadedFile?.name || 'Apuntes de clase';

    setIsProcessing(true);

    const docId = `doc-${Date.now()}`;
    let newDoc: UploadedDocument | null = null;
    let serverFileUrl: string | undefined = undefined;

    // Save file to server endpoint so all devices (PC, tablet, mobile) can view it tal cual
    try {
      const isPdf = uploadedFile ? (uploadedFile.type === 'application/pdf' || uploadedFile.name.endsWith('.pdf')) : false;
      const isImg = uploadedFile ? uploadedFile.type.startsWith('image/') : false;
      const fileType = uploadedFile ? (isPdf ? 'pdf' : isImg ? 'image' : 'text') : 'markdown';

      const uploadPayload = {
        id: docId,
        name: title,
        fileType,
        courseId: selectedCourseId,
        semesterId: selectedSemesterId,
        subjectId: selectedSubjectId,
        base64Data: uploadedFileDataUrl || undefined,
        textContent: pastedContent || undefined,
        sizeBytes: uploadedFile ? uploadedFile.size : pastedContent.length
      };

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadPayload)
      });

      if (res.ok) {
        const resJson = await res.json();
        if (resJson.document?.fileUrl) {
          serverFileUrl = resJson.document.fileUrl;
        }
      }
    } catch (e) {
      console.warn('Could not save to server endpoint, fallback to client state:', e);
    }

    if (uploadedFile) {
      const isPdf = uploadedFile.type === 'application/pdf' || uploadedFile.name.endsWith('.pdf');
      const isImg = uploadedFile.type.startsWith('image/');
      newDoc = {
        id: docId,
        name: title,
        fileType: isPdf ? 'pdf' : isImg ? 'image' : 'text',
        fileUrl: serverFileUrl || `/api/documents/${docId}/file`,
        dataUrl: uploadedFileDataUrl && uploadedFileDataUrl.length < 500000 ? uploadedFileDataUrl : undefined,
        textContent: pastedContent || (isPdf ? undefined : 'Documento cargado'),
        courseId: selectedCourseId,
        semesterId: selectedSemesterId,
        subjectId: selectedSubjectId,
        uploadedAt: new Date().toISOString(),
        sizeBytes: uploadedFile.size
      };
    } else if (pastedContent.trim()) {
      newDoc = {
        id: docId,
        name: title,
        fileType: 'markdown',
        fileUrl: serverFileUrl || `/api/documents/${docId}/file`,
        textContent: pastedContent,
        courseId: selectedCourseId,
        semesterId: selectedSemesterId,
        subjectId: selectedSubjectId,
        uploadedAt: new Date().toISOString(),
        sizeBytes: pastedContent.length
      };
    }

    if (newDoc && onSaveDocument) {
      onSaveDocument(newDoc);
    }

      // 2. Synthesize topic structure for flashcards and exercises
      const rawText = pastedContent.trim() || `Contenido de ${title}`;
      const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
      const generatedSubtopics: SubTopic[] = [];
      const generatedExercises: Exercise[] = [];

      const paragraphs = rawText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

      if (paragraphs.length <= 1) {
        generatedSubtopics.push({
          id: `custom-sub-${Date.now()}-1`,
          title: `1. Contenido de ${title}`,
          summary: lines.slice(0, 3).join(' ').substring(0, 220) || `Estudio de ${title}`,
          explanation: rawText,
          keyFormulas: lines
            .filter((l) => l.includes('=') || l.includes('->') || l.includes('+'))
            .slice(0, 4),
          examTips: ['Revisar la definición rigurosa y las deducciones teóricas.']
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
            keyFormulas: pLines
              .filter((l) => l.includes('=') || l.includes('=>') || l.includes('->'))
              .slice(0, 3)
          });
        });
      }

      generatedExercises.push({
        id: `custom-ej-${Date.now()}-1`,
        title: `Ejercicio Práctico 1: Aplicación de ${title}`,
        difficulty: 'medio',
        statement: `A partir del documento "${title}", analiza los supuestos de partida y justifica la resolución formal del problema.`,
        hints: ['Revisa las propiedades descritas en los apuntes.'],
        solution: {
          finalAnswer: 'Solución justificada según el material de estudio.',
          stepByStep: [
            '1. Extraer los datos iniciales y teoremas aplicables.',
            '2. Realizar los cálculos algebraicos y simplificaciones paso a paso.',
            '3. Comprobar la validez del resultado final.'
          ],
          theoreticalNote: 'Generado a partir del documento subido por el alumno.'
        }
      });

      if (topicMode === 'new') {
        const newTopic: Topic = {
          id: `custom-topic-${Date.now()}`,
          number: newTopicNumber,
          title: `Tema ${newTopicNumber}: ${title}`,
          subtitle: newTopicSubtitle.trim() || `Material y resumen de ${title}`,
          description: newTopicSubtitle.trim() || `Material personalizado de ${title}`,
          subtopics: generatedSubtopics,
          summaryPoints: [
            `Definición y marco teórico de ${title}.`,
            'Procedimiento y fórmulas esenciales de evaluación.',
            'Criterios de corrección de la ETSISI.'
          ],
          mindMapNodes: [
            {
              id: 'node-root',
              label: title,
              type: 'root',
              children: generatedSubtopics.map((s, idx) => ({
                id: `node-sub-${idx}`,
                label: s.title,
                type: 'concept'
              }))
            }
          ],
          exercises: generatedExercises,
          examQuestions: [
            {
              id: `custom-q-${Date.now()}-1`,
              question: `¿Cuál es el principio fundamental demostrado en "${title}"?`,
              options: [
                'La deducción formal y sus condiciones de frontera.',
                'La aplicación directa sin verificar hipótesis previas.',
                'Un método exclusivamente empírico no aplicable en examen.',
                'Ninguna de las anteriores.'
              ],
              correctIndex: 0,
              explanation: 'En las evaluaciones oficiales de la ETSISI es obligatorio justificar las hipótesis previas.',
              points: 2.5
            }
          ],
          practicalExamProblems: generatedExercises
        };

        onSaveNewTopic(selectedCourseId, selectedSemesterId, selectedSubjectId, newTopic);
      } else {
        onAddSubtopicsToExistingTopic(
          selectedCourseId,
          selectedSemesterId,
          selectedSubjectId,
          selectedTopicId,
          generatedSubtopics,
          generatedExercises
        );
      }

      setIsProcessing(false);
      setSuccessMessage(`¡Documento guardado con éxito! Se ha indexado en ${currentSubject.name}.`);

      setTimeout(() => {
        onClose();
        if (newDoc && onOpenDocument) {
          onOpenDocument(newDoc);
        }
      }, 1200);
  };

  // Filter documents for current subject
  const currentSubjectDocs = uploadedDocuments.filter(
    (d) => d.courseId === selectedCourseId && d.subjectId === selectedSubjectId
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Gestor de Apuntes y Documentos Oficiales
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sube PDFs o texto, léelos en visor integrado y consúltalos con el Tutor IA en pantalla dividida.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Subir nuevo archivo / apunte
          </button>
          <button
            onClick={() => setActiveTab('my_docs')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'my_docs'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>Mis documentos ({uploadedDocuments.length})</span>
            {uploadedDocuments.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>

        {/* Tab: My Saved Documents */}
        {activeTab === 'my_docs' ? (
          <div className="space-y-4">
            {uploadedDocuments.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                <FileQuestion className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  No tienes documentos subidos todavía
                </p>
                <p className="text-[11px] text-slate-400 mt-1 mb-4">
                  Sube apuntes de tus profesores, PDFs de clase o problemas para consultarlos en pantalla dividida.
                </p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
                >
                  Subir primer apunte
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto p-1">
                {uploadedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 shadow-2xs hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {doc.fileType}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {doc.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {doc.courseId}º Curso ({doc.semesterId}º Semestre) · {Math.round(doc.sizeBytes / 1024)} KB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={doc.fileUrl || doc.dataUrl || `/api/documents/${doc.id}/file`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-semibold transition-colors"
                        title="Ver PDF o archivo tal cual en pestaña nueva"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Ver tal cual</span>
                      </a>

                      {onOpenDocument && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenDocument(doc);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                          title="Abrir en visor con Tutor IA en pantalla dividida"
                        >
                          <Columns2 className="w-3.5 h-3.5" />
                          <span>Pantalla dividida</span>
                        </button>
                      )}

                      {onDeleteDocument && (
                        <button
                          onClick={() => onDeleteDocument(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar documento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Tab: Upload New Document */
          <div className="space-y-4">
            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Select Destination Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Curso
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value as CourseId)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="1">1.º Curso</option>
                  <option value="2">2.º Curso</option>
                  <option value="3">3.º Curso</option>
                  <option value="4">4.º Curso</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Semestre
                </label>
                <select
                  value={selectedSemesterId}
                  onChange={(e) => setSelectedSemesterId(e.target.value as SemesterId)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="1">1.er Semestre</option>
                  <option value="2">2.º Semestre</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Asignatura
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold truncate"
                >
                  {currentSemester.subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.shortName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title / Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Título del documento o tema
              </label>
              <input
                type="text"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                placeholder="Ej. Apuntes Tema 4: Punteros y Memoria Dinámica"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>

            {/* Input Method Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInputMethod('file')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  inputMethod === 'file'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Subir archivo (PDF, Word, TXT, Imagen)
              </button>
              <button
                type="button"
                onClick={() => setInputMethod('text')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  inputMethod === 'text'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Pegar texto o Markdown
              </button>
            </div>

            {inputMethod === 'file' ? (
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-indigo-400 transition-colors">
                <FileText className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {uploadedFile ? uploadedFile.name : 'Selecciona o arrastra el archivo aquí'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Podrás verlo en el visor de documentos y consultarlo con la IA en pantalla dividida.
                </p>
                <label className="inline-flex items-center gap-1.5 px-4 py-2 mt-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer">
                  <span>Examinar equipo</span>
                  <input
                    type="file"
                    accept=".pdf,.txt,.md,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <textarea
                rows={5}
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                placeholder="Pega aquí el contenido de los apuntes, teoremas, fórmulas o enunciados de prácticas..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}

            {/* Action Save Button */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isProcessing || (!uploadedFile && !pastedContent.trim())}
                onClick={handleSaveDocumentAndTopic}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Guardando e indexando...</span>
                ) : (
                  <>
                    <Columns2 className="w-4 h-4" />
                    <span>Guardar y abrir en pantalla dividida</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
