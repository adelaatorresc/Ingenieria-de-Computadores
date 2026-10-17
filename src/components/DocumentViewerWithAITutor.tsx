import React, { useState } from 'react';
import { UploadedDocument, Course, Subject, Topic } from '../types';
import {
  FileText,
  Bot,
  Download,
  Columns2,
  Maximize2,
  ArrowLeft,
  Sparkles,
  Send,
  Loader2,
  Trash2,
  ZoomIn,
  ZoomOut,
  X,
  FileQuestion,
  HelpCircle
} from 'lucide-react';
import { FormattedMarkdownText } from './FormattedMarkdownText';

interface DocumentViewerWithAITutorProps {
  document: UploadedDocument;
  courses: Course[];
  onBack: () => void;
  onDeleteDocument?: (docId: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const DocumentViewerWithAITutor: React.FC<DocumentViewerWithAITutorProps> = ({
  document,
  courses,
  onBack,
  onDeleteDocument
}) => {
  const [splitMode, setSplitMode] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'doc-welcome',
      role: 'model',
      text: `Hola, soy tu Tutor de IA de la ETSISI. Tengo cargado el documento **"${document.name}"**. Puedes preguntarme cualquier duda conceptual, demostración de fórmulas o pasos de los ejercicios mientras lo consultas a la izquierda.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Find course & subject names
  const courseObj = courses.find((c) => c.id === document.courseId);
  const semesterObj = courseObj?.semesters.find((s) => s.id === document.semesterId);
  const subjectObj = semesterObj?.subjects.find((s) => s.id === document.subjectId);

  const handleSend = async (questionText?: string) => {
    const textToSend = (questionText || inputQuestion).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const docContext = document.textContent
        ? `Nombre del documento: ${document.name}\nContenido de los apuntes:\n${document.textContent.slice(0, 4000)}`
        : `Nombre del documento: ${document.name} (${document.fileType})`;

      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          topicTitle: subjectObj ? `${subjectObj.name} - ${document.name}` : document.name,
          documentContext: docContext,
          history: messages.map((m) => ({ role: m.role, text: m.text }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            role: 'model',
            text: data.answer || 'No se pudo generar respuesta.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('Respuesta del servidor no válida');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `model-err-${Date.now()}`,
          role: 'model',
          text: 'Ocurrió un error temporal al consultar con el Tutor IA. Revisa tu conexión o vuelve a intentar tu pregunta.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (document.dataUrl) {
      const a = window.document.createElement('a');
      a.href = document.dataUrl;
      a.download = document.name;
      a.click();
    } else if (document.textContent) {
      const blob = new Blob([document.textContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.name.endsWith('.md') ? document.name : `${document.name}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-5rem)] flex flex-col">
      {/* Top Bar Navigation & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
                {document.fileType.toUpperCase()}
              </span>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
                {document.name}
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {subjectObj?.name || 'Asignatura'} · {document.courseId}º Curso ({document.semesterId}º Semestre) ·{' '}
              {Math.round(document.sizeBytes / 1024)} KB
            </p>
          </div>
        </div>

        {/* View mode toggles */}
        <div className="flex items-center gap-2">
          {/* Zoom controls if text or image */}
          {document.fileType !== 'pdf' && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 80))}
                className="p-1 hover:text-indigo-600"
                title="Alejar"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-1">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
                className="p-1 hover:text-indigo-600"
                title="Acercar"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Split Screen Toggle */}
          <button
            onClick={() => setSplitMode(!splitMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              splitMode
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
            title="Dividir pantalla con el Tutor IA"
          >
            <Columns2 className="w-4 h-4 text-purple-200" />
            <span className="hidden sm:inline">
              {splitMode ? 'Pantalla Dividida (Activa)' : 'Dividir con Tutor IA'}
            </span>
          </button>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-2xs"
            title="Descargar documento original"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span className="hidden md:inline">Descargar</span>
          </button>

          {/* Delete document button */}
          {onDeleteDocument && (
            <button
              onClick={() => {
                if (confirm(`¿Eliminar este documento "${document.name}"?`)) {
                  onDeleteDocument(document.id);
                  onBack();
                }
              }}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-800 transition-colors"
              title="Eliminar documento"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace: 1 Col or 2 Col Split Screen */}
      <div
        className={`flex-1 min-h-0 mt-4 grid gap-4 ${
          splitMode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {/* Left Side: Document Viewer */}
        <div className="h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 overflow-hidden flex flex-col shadow-sm">
          {document.fileType === 'pdf' && document.dataUrl ? (
            <div className="w-full h-full relative">
              <iframe
                src={`${document.dataUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full border-0"
                title={document.name}
              />
            </div>
          ) : document.fileType === 'image' && document.dataUrl ? (
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950">
              <img
                src={document.dataUrl}
                alt={document.name}
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-transform duration-150"
              />
            </div>
          ) : (
            // Text or Markdown view
            <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
              <div
                style={{ fontSize: `${(zoomLevel / 100) * 0.875}rem` }}
                className="max-w-none leading-relaxed"
              >
                {document.textContent ? (
                  <FormattedMarkdownText content={document.textContent} />
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <FileQuestion className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                    <p className="font-semibold">Sin previsualización de texto plano</p>
                    <p className="text-xs mt-1">Usa el botón de descargar para abrir el archivo con tu visor nativo.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: AI Tutor Dock (when Split Mode is active) */}
        {splitMode && (
          <div className="h-full rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-white dark:bg-slate-900 flex flex-col overflow-hidden shadow-sm">
            {/* Tutor Header */}
            <div className="p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold leading-tight">Tutor IA en Pantalla Dividida</h3>
                  <p className="text-[10px] text-purple-200">Contexto: {document.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-purple-100">En línea</span>
              </div>
            </div>

            {/* Quick Context Prompts */}
            <div className="p-2 bg-purple-50/70 dark:bg-purple-950/40 border-b border-purple-100 dark:border-purple-900/40 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
              <button
                onClick={() => handleSend(`Explícame el resumen y las ideas centrales de estos apuntes de "${document.name}"`)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 hover:bg-purple-50 whitespace-nowrap font-medium transition-colors"
              >
                💡 Resumen clave
              </button>
              <button
                onClick={() => handleSend(`¿Cuáles son las fórmulas más importantes de este documento y cómo se deducen?`)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 hover:bg-purple-50 whitespace-nowrap font-medium transition-colors"
              >
                📐 Fórmulas clave
              </button>
              <button
                onClick={() => handleSend(`¿Qué preguntas típicas de examen de la ETSISI suelen poner sobre el contenido de este documento?`)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 hover:bg-purple-50 whitespace-nowrap font-medium transition-colors"
              >
                🎯 Preguntas de examen
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((m) => (
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

              {isLoading && (
                <div className="flex items-center gap-2 p-2 text-xs text-purple-600 dark:text-purple-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>El Tutor IA está analizando los apuntes para responderte...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Pregunta algo sobre este documento..."
                className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={!inputQuestion.trim() || isLoading}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white transition-colors"
                title="Enviar consulta al Tutor IA"
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
