import React from 'react';
import { GraduationCap, ArrowRight, BookOpen, Clock, Cpu, Award } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  return (
    <div
      onClick={onContinue}
      className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col justify-between p-6 sm:p-12 cursor-pointer select-none overflow-hidden transition-all duration-300"
    >
      {/* Decorative ambient background grid & glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(56,189,248,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Top University Branding */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider text-indigo-300 uppercase">
              Universidad Politécnica de Madrid · ETSISI
            </p>
            <p className="text-sm font-medium text-slate-300">
              Campus Sur · Grado Universitario Oficial
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 border border-white/10 px-3 py-1.5 rounded-lg bg-white/5">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Plan de Estudios Completo 2026-2027</span>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 max-w-4xl my-auto py-12">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 mb-6 backdrop-blur-sm">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span>Plataforma Académica Integral</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
          Ingeniería de computadores
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-10">
          Entorno interactivo oficial basado única y exclusivamente en los apuntes, transparencias y colecciones de problemas de los profesores de la ETSISI-UPM.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-3xl">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-indigo-400 mb-2">🧠</div>
            <h3 className="text-sm font-semibold text-white">Mapas Mentales</h3>
            <p className="text-xs text-slate-400 mt-1">Estructura visual de cada tema</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-emerald-400 mb-2">📝</div>
            <h3 className="text-sm font-semibold text-white">Resúmenes Clave</h3>
            <p className="text-xs text-slate-400 mt-1">Fórmulas, tablas y teoremas</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-amber-400 mb-2">⏱️</div>
            <h3 className="text-sm font-semibold text-white">Ejercicios Guiados</h3>
            <p className="text-xs text-slate-400 mt-1">Cronometrados y paso a paso</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-rose-400 mb-2">🎯</div>
            <h3 className="text-sm font-semibold text-white">Simulacro 2h</h3>
            <p className="text-xs text-slate-400 mt-1">Exámenes reales con límite</p>
          </div>
        </div>

        {/* Pulse action button */}
        <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg shadow-xl shadow-indigo-600/30 transition-all duration-300 transform group hover:scale-[1.02]">
          <span>Pulse en cualquier lado para continuar</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </div>
      </main>

      {/* Footer Instructions */}
      <footer className="relative z-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            AM · FC · LyMD · FP · TSO
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            Acceso a los 4 cursos
          </span>
        </div>
        <p className="text-slate-400 text-center sm:text-right">
          Diseñado para escritorio, tablet iPad y móvil con navegación táctil por deslizamiento
        </p>
      </footer>
    </div>
  );
};
