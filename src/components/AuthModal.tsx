import React, { useState } from 'react';
import { UserProfile, CourseId } from '../types';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Sparkles,
  Loader2
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  currentUser: UserProfile | null;
  onLogin: (profile: UserProfile) => void;
  onClose: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot_password';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  currentUser,
  onLogin,
  onClose
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [courseId, setCourseId] = useState<CourseId>('1');
  const [studentId, setStudentId] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Map Firebase errors to clear Spanish descriptions
  const translateAuthError = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/user-not-found':
        return 'No existe ninguna cuenta con este correo electrónico. Por favor, regístrate primero.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Contraseña o credenciales incorrectas. Verifica tus datos o restablece tu contraseña.';
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta con este correo. Prueba a iniciar sesión o recupera tu contraseña.';
      case 'auth/invalid-email':
        return 'El formato del correo electrónico no es válido.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/popup-closed-by-user':
        return 'Se canceló el inicio de sesión con Google.';
      case 'auth/network-request-failed':
        return 'Error de conexión. Comprueba tu conexión a internet.';
      default:
        return err?.message || 'Ha ocurrido un error al procesar tu solicitud.';
    }
  };

  // Helper to load or create profile in Firestore
  const syncUserProfile = async (
    uid: string,
    userEmail: string,
    displayName?: string,
    initialCourse: CourseId = '1',
    initialStudentId?: string
  ): Promise<UserProfile> => {
    const userDocRef = doc(db, 'users', uid);
    let profileData: UserProfile;

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        profileData = snap.data() as UserProfile;
        // Ensure id is synced
        profileData.id = uid;
      } else {
        // Create initial profile
        profileData = {
          id: uid,
          name: displayName || userEmail.split('@')[0],
          email: userEmail,
          studentId: initialStudentId || 'bo' + Math.floor(1000 + Math.random() * 9000),
          selectedCourseId: initialCourse,
          avatarColor: '#4f46e5',
          createdAt: new Date().toISOString(),
          isRegistered: true,
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: new Date().toISOString().split('T')[0],
          level: 1,
          xp: 100,
          unlockedBadgeIds: ['badge-first-step']
        };
        await setDoc(userDocRef, profileData);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${uid}`);
      profileData = {
        id: uid,
        name: displayName || userEmail.split('@')[0],
        email: userEmail,
        selectedCourseId: initialCourse,
        createdAt: new Date().toISOString(),
        isRegistered: true
      };
    }

    return profileData;
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password) {
          setErrorMessage('Introduce tu correo y contraseña.');
          setIsLoading(false);
          return;
        }

        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const profile = await syncUserProfile(cred.user.uid, cred.user.email || email.trim());
        onLogin(profile);
        onClose();
      } else if (mode === 'register') {
        if (!name.trim()) {
          setErrorMessage('Introduce tu nombre y apellidos.');
          setIsLoading(false);
          return;
        }
        if (!email.trim()) {
          setErrorMessage('Introduce un correo electrónico válido.');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Las contraseñas no coinciden.');
          setIsLoading(false);
          return;
        }

        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (cred.user) {
          await updateProfile(cred.user, { displayName: name.trim() });
        }

        const profile = await syncUserProfile(
          cred.user.uid,
          cred.user.email || email.trim(),
          name.trim(),
          courseId,
          studentId.trim()
        );

        onLogin(profile);
        onClose();
      } else if (mode === 'forgot_password') {
        if (!email.trim()) {
          setErrorMessage('Introduce el correo electrónico de tu cuenta.');
          setIsLoading(false);
          return;
        }

        await sendPasswordResetEmail(auth, email.trim());
        setSuccessMessage(
          `Te hemos enviado un correo de recuperación a ${email.trim()}. Revisa tu bandeja de entrada o spam para restablecer tu contraseña.`
        );
      }
    } catch (err: any) {
      setErrorMessage(translateAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const profile = await syncUserProfile(
        cred.user.uid,
        cred.user.email || '',
        cred.user.displayName || undefined,
        '1'
      );
      onLogin(profile);
      onClose();
    } catch (err: any) {
      setErrorMessage(translateAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative transition-colors duration-200">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-indigo-600/30">
            <GraduationCap className="w-8 h-8" />
          </div>
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            ETSISI · UPM Plan 61CI
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {mode === 'login' && 'Iniciar Sesión'}
            {mode === 'register' && 'Crear Cuenta Real'}
            {mode === 'forgot_password' && 'Recuperar Contraseña'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'login' &&
              'Accede a tu cuenta para sincronizar tu progreso, racha y notas entre todos tus dispositivos.'}
            {mode === 'register' &&
              'Regístrate con tu correo y contraseña para tener tu progreso guardado en la nube.'}
            {mode === 'forgot_password' &&
              'Introduce tu email para enviarte un enlace de restablecimiento de contraseña.'}
          </p>
        </div>

        {/* Tab Switcher (Login vs Register) */}
        {mode !== 'forgot_password' && (
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              Crear Cuenta
            </button>
          </div>
        )}

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-800 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-2.5 text-emerald-800 dark:text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Google One-Click Button */}
        {mode !== 'forgot_password' && (
          <div className="mb-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continuar con Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-400">
                  o con tu correo
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailPasswordSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nombre y Apellidos
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre y apellidos"
                  className="w-full p-2.5 pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@alumnos.upm.es"
                className="w-full p-2.5 pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {mode !== 'forgot_password' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Contraseña
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot_password');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full p-2.5 pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    className="w-full p-2.5 pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Curso UPM
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value as CourseId)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="1">1.º Curso</option>
                    <option value="2">2.º Curso</option>
                    <option value="3">3.º Curso</option>
                    <option value="4">4.º Curso</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Matrícula / ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="boXXXX"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : mode === 'login' ? (
              <>
                <span>Iniciar Sesión</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : mode === 'register' ? (
              <>
                <span>Registrar Mi Cuenta</span>
                <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Enviar Correo de Recuperación</span>
                <KeyRound className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to Login link when in Forgot Password mode */}
        {mode === 'forgot_password' && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              ← Volver a Iniciar Sesión
            </button>
          </div>
        )}

        {/* Close Button if user is already logged in or wants to cancel */}
        {currentUser && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
