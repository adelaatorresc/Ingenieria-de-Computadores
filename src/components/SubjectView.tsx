import React from 'react';
import { Subject, Topic, UploadedDocument } from '../types';
import {
  BookOpen,
  HelpCircle,
  FileText,
  Compass,
  ListChecks,
  Timer,
  ArrowRight,
  Sparkles,
  Users,
  Bot,
  Columns2,
  Upload,
  Eye
} from 'lucide-react';

interface SubjectViewProps {
  subject: Subject;
  uploadedDocuments?: UploadedDocument[];
  onSelectTopic: (topic: Topic) => void;
  onDirectAction: (topic: Topic, action: 'mindmap' | 'summary' | 'explanation' | 'flashcards' | 'exercises' | 'exam') => void;
  onOpenStudyGroups?: () => void;
  onOpenAITutor?: () => void;
  onOpenDocument?: (doc: UploadedDocument) => void;
  onOpenUploadModal?: () => void;
}

export const SubjectView: React.FC<SubjectViewProps> = ({
  subject,
  uploadedDocuments = [],
  onSelectTopic,
  onDirectAction,
  onOpenStudyGroups,
  onOpenAITutor,
  onOpenDocument,
  onOpenUploadModal
}) => {
  // Find documents belonging to this subject
  const subjectDocs = uploadedDocuments.filter((d) => d.subjectId === subject.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Subject Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/10 text-indigo-200 backdrop-blur-sm">
              Código {subject.code}
            </span>
            <span className="text-xs text-slate-300">
              {subject.ects} Créditos ECTS
            </span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-emerald-300 flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Material de apuntes oficial ETSISI
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {subject.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed mb-4">
            {subject.description}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            {onOpenStudyGroups && (
              <button
                onClick={onOpenStudyGroups}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-sm transition-all cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-indigo-300" />
                <span>Salas de estudio grupales</span>
              </button>
            )}
            {onOpenAITutor && (
              <button
                onClick={onOpenAITutor}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/25 hover:bg-purple-500/40 border border-purple-400/30 text-white text-xs font-bold backdrop-blur-sm transition-all cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-purple-300" />
                <span>Consultar al Tutor IA de {subject.shortName || subject.name}</span>
              </button>
            )}
            {onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/40 border border-emerald-400/30 text-white text-xs font-bold backdrop-blur-sm transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-300" />
                <span>Subir apuntes o PDF</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Uploaded Documents Section if any exist */}
      {subjectDocs.length > 0 && (
        <div className="mb-8 p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Documentos y Apuntes Subidos ({subjectDocs.length})
              </h2>
            </div>
            {onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Subir más</span>
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Haz clic en cualquier documento para abrirlo en el visor integrado con el Tutor IA en pantalla dividida.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subjectDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenDocument && onOpenDocument(doc)}
                className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                    {doc.fileType}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {Math.round(doc.sizeBytes / 1024)} KB · Guardado
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-bold shrink-0">
                  <Columns2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Pantalla dividida</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Temario del Semestre ({subject.topics.length} {subject.topics.length === 1 ? 'Tema' : 'Temas'})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pulsa en cualquier tema para abrir su menú de estudio interactivo.
          </p>
        </div>
      </div>

      {/* Topics Cards */}
      {subject.topics.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <BookOpen className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Temario para {subject.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto mt-1 mb-6">
            Puedes unirte a una sala de estudio en vivo con tus compañeros de clase, resolver dudas con el Tutor IA de la ETSISI, o subir los apuntes y PDFs de tu profesor para esta asignatura.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Subir apuntes o PDF de {subject.shortName || subject.name}</span>
              </button>
            )}
            {onOpenStudyGroups && (
              <button
                onClick={onOpenStudyGroups}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Salas de Estudio de {subject.shortName || subject.name}</span>
              </button>
            )}
            {onOpenAITutor && (
              <button
                onClick={onOpenAITutor}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Preguntar al Tutor IA</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {subject.topics.map((topic) => {
            const isTSO = subject.id === 'tso';
            const numExercises = topic.exercises.length;

            return (
              <div
                key={topic.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700/80 shadow-sm hover:shadow-md transition-all p-5 sm:p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
                      Unidad {topic.number}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                      {topic.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {topic.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectTopic(topic)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Ver menú de opciones</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Action Badges / Shortcut buttons */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                  <button
                    onClick={() => onDirectAction(topic, 'mindmap')}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="truncate">Mapa Mental</span>
                  </button>

                  <button
                    onClick={() => onDirectAction(topic, 'summary')}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate">Resumen</span>
                  </button>

                  <button
                    onClick={() => onDirectAction(topic, 'explanation')}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="truncate">Lección ({topic.subtopics.length})</span>
                  </button>

                  <button
                    onClick={() => onDirectAction(topic, 'flashcards')}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                    <span className="truncate">Flashcards</span>
                  </button>

                  <button
                    onClick={() => onDirectAction(topic, 'exercises')}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                  >
                    <ListChecks className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate">Ejercicios ({numExercises})</span>
                  </button>

                  <button
                    onClick={() => onDirectAction(topic, 'exam')}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                  >
                    <Timer className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="truncate">Simulacro 2h</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
