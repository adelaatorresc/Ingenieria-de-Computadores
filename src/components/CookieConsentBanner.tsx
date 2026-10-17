import React, { useState, useEffect } from 'react';
import { CookieConsent } from '../types';
import { ShieldCheck, Cookie, Info, Check, X, Settings2 } from 'lucide-react';

interface CookieConsentBannerProps {
  onConsentSaved?: (consent: CookieConsent) => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onConsentSaved }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Preference state
  const [allowPreferences, setAllowPreferences] = useState<boolean>(true);
  const [allowAnalytics, setAllowAnalytics] = useState<boolean>(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('etsisi_cookie_consent');
      if (!saved) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (functional: boolean, preferences: boolean, analytics: boolean) => {
    const consent: CookieConsent = {
      accepted: true,
      functional: true, // always required for session and timers
      preferences,
      analytics,
      timestamp: new Date().toISOString()
    };

    try {
      localStorage.setItem('etsisi_cookie_consent', JSON.stringify(consent));
    } catch {
      // ignore
    }

    setIsVisible(false);
    setIsModalOpen(false);
    if (onConsentSaved) onConsentSaved(consent);
  };

  const handleAcceptAll = () => {
    saveConsent(true, true, true);
  };

  const handleRejectNonEssential = () => {
    saveConsent(true, false, false);
  };

  const handleSaveCustom = () => {
    saveConsent(true, allowPreferences, allowAnalytics);
  };

  if (!isVisible && !isModalOpen) return null;

  return (
    <>
      {/* Bottom Sticky Banner */}
      {isVisible && !isModalOpen && (
        <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm">
                <p className="font-bold text-white flex items-center gap-2">
                  <span>Gestión de Cookies y Almacenamiento Local (ETSISI Plan 61CI)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    Transparencia Real
                  </span>
                </p>
                <p className="text-slate-300 mt-1 leading-relaxed max-w-3xl">
                  Utilizamos almacenamiento local (LocalStorage) exclusivamente para guardar tu sesión de estudiante, los tiempos del cronómetro por ejercicio, tus notas ponderadas, el progreso de flashcards y los recordatorios reales de estudio. No utilizamos cookies de rastreo publicitario invasivo de terceros.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Settings2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Configurar</span>
              </button>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-3.5 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
              >
                Solo necesarias
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Aceptar todas</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Política y Configuración de Cookies
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ETSISI - Universidad Politécnica de Madrid
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-xs sm:text-sm">
              {/* Category 1: Strictly Necessary */}
              <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      1. Cookies Técnicas y de Sesión (Estrictamente Necesarias)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                      Siempre activas
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Permiten mantener tu sesión activa con tu nombre y matrícula (`etsisi_current_user`), registrar qué ejercicios has completado y guardar los segundos del cronómetro de cada problema para no perder tu progreso si sales o recargas.
                </p>
              </div>

              {/* Category 2: Preferences */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="font-bold text-slate-900 dark:text-white">
                    2. Cookies de Preferencias y Personalización
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowPreferences}
                      onChange={(e) => setAllowPreferences(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Recuerdan tu elección entre Modo Claro y Modo Oscuro (`etsisi_dark_mode`), la configuración de tus intervalos Pomodoro y tus filtros de asignaturas preferidos.
                </p>
              </div>

              {/* Category 3: Analytics */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="font-bold text-slate-900 dark:text-white">
                    3. Almacenamiento de Rendimiento y Análisis de Estudio
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowAnalytics}
                      onChange={(e) => setAllowAnalytics(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Calculan estadísticas locales de tu tiempo invertido por tema y generan los gráficos en Recharts para que puedas planificar mejor tus semanas de examen.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Rechazar opcionales
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Guardar selección
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
