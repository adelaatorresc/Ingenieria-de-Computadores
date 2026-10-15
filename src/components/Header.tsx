import React, { useState } from 'react';
import {
  ArrowLeft,
  Menu,
  Home,
  X,
  BookOpen,
  GraduationCap,
  Sun,
  Moon,
  BarChart3,
  Upload,
  Sparkles
} from 'lucide-react';
import { NavState } from '../types';

interface HeaderProps {
  nav: NavState;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
  onGoHome: () => void;
  onOpenAnalytics: () => void;
  onOpenUploadNotes: () => void;
  subjectTitle?: string;
  topicTitle?: string;
  exerciseTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  nav,
  darkMode,
  onToggleDarkMode,
  onBack,
  onGoHome,
  onOpenAnalytics,
  onOpenUploadNotes,
  subjectTitle,
  topicTitle,
  exerciseTitle
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const canGoBack = nav.view !== 'welcome' && nav.view !== 'courses';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Zone 1: Back Button & Wordmark / Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            {canGoBack && (
              <button
                onClick={onBack}
                aria-label="Volver atrás"
                className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={onGoHome}
              className="flex items-center gap-2.5 text-left group shrink-0"
              title="Volver a la portada de inicio"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-indigo-700 transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 leading-none">
                  ETSISI · UPM 61CI
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Ingeniería de Computadores
                </p>
              </div>
            </button>

            {/* Context breadcrumb trail */}
            {subjectTitle && (
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate pl-3 border-l border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                  {subjectTitle}
                </span>
                {topicTitle && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">/</span>
                    <span className="truncate max-w-[180px]" title={topicTitle}>
                      {topicTitle.split(':')[0]}
                    </span>
                  </>
                )}
                {exerciseTitle && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">/</span>
                    <span className="truncate max-w-[150px] text-indigo-600 dark:text-indigo-400 font-medium">
                      {exerciseTitle.split(':')[0]}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Zone 2: Navigation Info / Indicator */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              {nav.courseId ? `${nav.courseId}º Curso` : 'Plan 61CI'}
              {nav.semesterId ? ` · ${nav.semesterId}º Semestre` : ''}
            </span>
          </div>

          {/* Zone 3: Actions - Theme toggle, Analytics, Upload Notes, Menu button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label="Cambiar tema claro/oscuro"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Quick Analytics Button */}
            <button
              onClick={onOpenAnalytics}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                nav.view === 'analytics'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
              title="Ver análisis de tiempos y estudio"
            >
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span>Análisis</span>
            </button>

            {/* Subir Apuntes Button */}
            <button
              onClick={onOpenUploadNotes}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all"
              title="Subir apuntes o crear nuevo tema"
            >
              <Upload className="w-4 h-4 text-emerald-500" />
              <span>Subir apuntes</span>
            </button>

            {/* Hamburger Menu Button ("Volver al menú principal") */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-xs sm:text-sm transition-colors shadow-xs"
              aria-label="Abrir menú principal"
            >
              <Menu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="whitespace-nowrap hidden sm:inline">Volver al menú principal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Menu Modal */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Menú Principal</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">ETSISI - UPM (Plan 61CI)</p>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {/* Return to Welcome Screen ("Ingeniería de computadores") */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onGoHome();
                  }}
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Pantalla de Inicio</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      "Ingeniería de computadores" (Pulse en cualquier lado)
                    </p>
                  </div>
                </button>

                {/* Open Study Analytics */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenAnalytics();
                  }}
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Análisis de Estudio</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Tiempos por ejercicio, tema y gráficos
                    </p>
                  </div>
                </button>

                {/* Upload Custom Notes */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenUploadNotes();
                  }}
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Subir Apuntes / Nuevo Tema</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Añade temas con resumen y mapa mental
                    </p>
                  </div>
                </button>

                {/* Dark/Light mode in menu */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Modo {darkMode ? 'Oscuro' : 'Claro'}
                  </span>
                  <button
                    onClick={onToggleDarkMode}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                    Ayuda de Navegación
                  </p>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-400">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      📱 Gesto táctil para iPhone e iPad:
                    </p>
                    <p>
                      Desliza suavemente desde el borde izquierdo hacia la derecha para volver a la pantalla anterior sin tocar botones.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
              ETSISI - Universidad Politécnica de Madrid · 2026-2027
            </div>
          </div>
        </div>
      )}
    </>
  );
};
