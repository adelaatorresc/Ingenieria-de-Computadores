import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Course, CourseId, SemesterId, StudyRoom, StudyRoomNote, StudyRoomMessage, UserProfile } from '../types';
import {
  Users,
  Timer,
  BookOpen,
  MessageSquare,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  ThumbsUp,
  Share2,
  ChevronLeft,
  Flame,
  Send,
  Bot,
  Copy,
  Check,
  Tag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { db, auth } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

interface StudyGroupsViewProps {
  courses: Course[];
  currentUser: UserProfile | null;
  onBack: () => void;
  onOpenAITutor?: () => void;
}

// Initial rich curated ETSISI study rooms
const initialRooms: StudyRoom[] = [
  {
    id: 'room-fp-c-mastery',
    name: 'Mesa de Trabajo: Punteros, Memoria Dinámica y Matrices en C',
    subjectId: 'fp',
    subjectName: 'Fundamentos de Programación',
    courseId: '1',
    semesterId: '1',
    description: 'Sala enfocada en resolver dudas de memoria dinámica (malloc/free), arrays bidimensionales y paso por referencia con punteros dobles.',
    topicFocus: 'Tema 4 y 5: Punteros y Gestión Dinámica de Memoria',
    activeMembersCount: 4,
    createdBy: 'Delegado de Curso',
    createdAt: '2026-10-15',
    pomodoro: {
      isRunning: false,
      mode: 'work',
      timeLeftSeconds: 25 * 60,
      totalDurationSeconds: 25 * 60,
      lastUpdatedTimestamp: Date.now(),
      startedByName: 'Delegado de Curso'
    },
    notes: [
      {
        id: 'note-fp-1',
        authorId: 'user-delegado',
        authorName: 'Delegado de Curso',
        authorAvatarColor: 'blue',
        tag: 'Tip Examen',
        title: '¡Cuidado con la liberación de matrices dinámicas en C!',
        content: 'En los exámenes de laboratorio de la ETSISI siempre restan si haces free(matriz) del tirón. Primero debes hacer un bucle for liberando cada fila: `for(int i=0; i<filas; i++) free(matriz[i]);` y después `free(matriz);`. Y siempre igualar a NULL.',
        createdAt: '10:14',
        likes: 12
      },
      {
        id: 'note-fp-2',
        authorId: 'user-lucia',
        authorName: 'Lucía G.',
        authorAvatarColor: 'emerald',
        tag: 'Código C',
        title: 'Plantilla segura de reserva para matriz int**',
        content: '```c\nint** crear_matriz(int f, int c) {\n    int** m = (int**)malloc(f * sizeof(int*));\n    if (!m) return NULL;\n    for(int i = 0; i < f; i++) {\n        m[i] = (int*)malloc(c * sizeof(int));\n        if (!m[i]) { /* liberar anteriores */ return NULL; }\n    }\n    return m;\n}\n```',
        createdAt: '11:30',
        likes: 9
      }
    ],
    messages: [
      {
        id: 'msg-1',
        authorId: 'user-delegado',
        authorName: 'Delegado de Curso',
        text: '¡Bienvenidos a la sala de FP! Vamos a hacer bloques de 25 min seguidos sin distracciones.',
        timestamp: '10:00'
      },
      {
        id: 'msg-2',
        authorId: 'user-companera',
        authorName: 'Compañera ETSISI',
        text: 'He subido la plantilla de reserva de matrices para quien le toque práctica el jueves.',
        timestamp: '10:05'
      }
    ]
  },
  {
    id: 'room-fc-karnaugh',
    name: 'Laboratorio de Karnaugh y Circuitos MSI (74LS138, 74LS151)',
    subjectId: 'fc',
    subjectName: 'Fundamentos de Computadores',
    courseId: '1',
    semesterId: '1',
    description: 'Simplificación de funciones booleanas mediante mapas de Karnaugh de 4 y 5 variables y diseño óptimo con multiplexores y decodificadores.',
    topicFocus: 'Tema 3: Circuitos Combinacionales y Bloques MSI',
    activeMembersCount: 3,
    createdBy: 'Estudiante de Computadores',
    createdAt: '2026-10-16',
    pomodoro: {
      isRunning: true,
      mode: 'work',
      timeLeftSeconds: 18 * 60 + 20,
      totalDurationSeconds: 25 * 60,
      lastUpdatedTimestamp: Date.now(),
      startedByName: 'Estudiante de Computadores'
    },
    notes: [
      {
        id: 'note-fc-1',
        authorId: 'user-estudiante',
        authorName: 'Estudiante de Computadores',
        authorAvatarColor: 'purple',
        tag: 'Fórmula',
        title: 'Implementación universal con Multiplexor 74LS151 (8 a 1)',
        content: 'Para función de 4 variables F(A,B,C,D): conectar A, B, C a las entradas selectoras S2, S1, S0. La variable restante D (o su negado, 0, o 1) se conecta a las entradas de datos I0..I7 según la tabla de verdad desglosada por pares.',
        createdAt: '09:45',
        likes: 15
      }
    ],
    messages: [
      {
        id: 'msg-fc-1',
        authorId: 'user-estudiante',
        authorName: 'Estudiante de Computadores',
        text: 'En marcha el pomodoro de FC. ¡A por los circuitos combinacionales!',
        timestamp: '09:30'
      }
    ]
  },
  {
    id: 'room-am-extremes',
    name: 'Cálculo de Extremos, Hessiano y Derivación en R²',
    subjectId: 'am',
    subjectName: 'Análisis Matemático',
    courseId: '1',
    semesterId: '1',
    description: 'Estudio de puntos críticos mediante gradiente nulo, clasificación con el determinante Hessiano y multiplicadores de Lagrange para extremos condicionados.',
    topicFocus: 'Tema 1: Diferenciación y Extremos de Varias Variables',
    activeMembersCount: 5,
    createdBy: 'Elena V.',
    createdAt: '2026-10-14',
    pomodoro: {
      isRunning: false,
      mode: 'work',
      timeLeftSeconds: 25 * 60,
      totalDurationSeconds: 25 * 60,
      lastUpdatedTimestamp: Date.now(),
      startedByName: 'Elena'
    },
    notes: [
      {
        id: 'note-am-1',
        authorId: 'user-elena',
        authorName: 'Elena V.',
        authorAvatarColor: 'rose',
        tag: 'Fórmula',
        title: 'Criterio del Hessiano en R² (2 variables)',
        content: 'Matriz Hessiana H = [[A, B], [B, C]] donde A = f_xx, B = f_xy, C = f_yy. Determinante det(H) = AC - B².\n1. det(H) > 0 y A > 0 => Mínimo local estricto.\n2. det(H) > 0 y A < 0 => Máximo local estricto.\n3. det(H) < 0 => Punto de silla.\n4. det(H) = 0 => Caso dudoso.',
        createdAt: '08:20',
        likes: 21
      }
    ],
    messages: [
      {
        id: 'msg-am-1',
        authorId: 'user-elena',
        authorName: 'Elena V.',
        text: 'Si tenéis dudas con algún Hessiano o con Lagrange, dejadlo en los apuntes o por el chat.',
        timestamp: '08:15'
      }
    ]
  },
  {
    id: 'room-alg-linear',
    name: 'Álgebra Lineal: Diagonalización y Espacios Vectoriales (2.º Semestre)',
    subjectId: 'alg',
    subjectName: 'Álgebra',
    courseId: '1',
    semesterId: '2',
    description: 'Grupo de estudio anticipado para el segundo semestre: autovalores, autovectores, polinomio característico y matrices semejantes.',
    topicFocus: 'Tema 2: Diagonalización de Endomorfismos',
    activeMembersCount: 3,
    createdBy: 'Estudiante de Álgebra',
    createdAt: '2026-10-16',
    pomodoro: {
      isRunning: false,
      mode: 'work',
      timeLeftSeconds: 25 * 60,
      totalDurationSeconds: 25 * 60,
      lastUpdatedTimestamp: Date.now(),
      startedByName: 'Estudiante de Álgebra'
    },
    notes: [
      {
        id: 'note-alg-1',
        authorId: 'user-algebra',
        authorName: 'Estudiante de Álgebra',
        authorAvatarColor: 'cyan',
        tag: 'Tip Examen',
        title: 'Condición necesaria y suficiente de diagonalización',
        content: 'Una matriz A de orden n es diagonalizable sii: 1) Todas las raíces del polinomio característico p(λ) pertenecen al cuerpo R. 2) Para cada autovalor, la multiplicidad geométrica d(λ) = dim(Ker(A - λI)) coincide con la multiplicidad algebraica m(λ).',
        createdAt: '12:00',
        likes: 14
      }
    ],
    messages: [
      {
        id: 'msg-alg-1',
        authorId: 'user-algebra',
        authorName: 'Estudiante de Álgebra',
        text: 'Iniciamos grupo de Álgebra de segundo semestre para no dejarla al final.',
        timestamp: '11:55'
      }
    ]
  }
];

export const StudyGroupsView: React.FC<StudyGroupsViewProps> = ({
  courses,
  currentUser,
  onBack,
  onOpenAITutor
}) => {
  // Rooms state with local storage fallback
  const [rooms, setRooms] = useState<StudyRoom[]>(() => {
    try {
      const saved = localStorage.getItem('etsisi_study_rooms');
      return saved ? JSON.parse(saved) : initialRooms;
    } catch {
      return initialRooms;
    }
  });

  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<'all' | '1' | '2'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'pomodoro' | 'notes' | 'chat'>('pomodoro');

  // New room modal
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [newRoomSubjectId, setNewRoomSubjectId] = useState<string>('fp');
  const [newRoomCourseId, setNewRoomCourseId] = useState<CourseId>('1');
  const [newRoomSemesterId, setNewRoomSemesterId] = useState<SemesterId>('1');
  const [newRoomTopic, setNewRoomTopic] = useState<string>('');
  const [newRoomDescription, setNewRoomDescription] = useState<string>('');

  // New note modal
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteTag, setNoteTag] = useState<StudyRoomNote['tag']>('Tip Examen');

  // Chat message
  const [chatInput, setChatInput] = useState<string>('');
  const [isAiConsulting, setIsAiConsulting] = useState<boolean>(false);
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // Sound alert
  const audioContextRef = useRef<AudioContext | null>(null);

  const playChime = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // AudioContext may require user interaction
    }
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('etsisi_study_rooms', JSON.stringify(rooms));
    } catch {
      // ignore
    }
  }, [rooms]);

  // Active room object
  const activeRoom = useMemo(() => {
    return rooms.find((r) => r.id === activeRoomId) || null;
  }, [rooms, activeRoomId]);

  // Firestore synchronization for active room
  useEffect(() => {
    if (!activeRoomId || !db) return;

    try {
      const roomDocRef = doc(db, 'studyGroups', activeRoomId);
      const unsubscribe = onSnapshot(
        roomDocRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as Partial<StudyRoom>;
            setRooms((prev) =>
              prev.map((r) => (r.id === activeRoomId ? { ...r, ...data } : r))
            );
          }
        },
        () => {
          // Fall back gracefully if offline or permission denied
        }
      );
      return () => unsubscribe();
    } catch {
      // ignore
    }
  }, [activeRoomId]);

  // Timer interval for active room's Pomodoro
  useEffect(() => {
    if (!activeRoom || !activeRoom.pomodoro.isRunning) return;

    const interval = setInterval(() => {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id !== activeRoom.id || !r.pomodoro.isRunning) return r;

          if (r.pomodoro.timeLeftSeconds <= 1) {
            playChime();
            const nextMode = r.pomodoro.mode === 'work' ? 'short_break' : 'work';
            const nextDuration = nextMode === 'work' ? 25 * 60 : 5 * 60;
            return {
              ...r,
              pomodoro: {
                ...r.pomodoro,
                isRunning: false,
                mode: nextMode,
                timeLeftSeconds: nextDuration,
                totalDurationSeconds: nextDuration,
                lastUpdatedTimestamp: Date.now()
              }
            };
          }

          return {
            ...r,
            pomodoro: {
              ...r.pomodoro,
              timeLeftSeconds: r.pomodoro.timeLeftSeconds - 1,
              lastUpdatedTimestamp: Date.now()
            }
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRoom?.id, activeRoom?.pomodoro.isRunning]);

  // All subjects list from courses
  const allSubjects = useMemo(() => {
    const list: { id: string; name: string; courseId: CourseId; semesterId: SemesterId }[] = [];
    courses.forEach((c) => {
      c.semesters.forEach((sem) => {
        sem.subjects.forEach((subj) => {
          list.push({
            id: subj.id,
            name: subj.name,
            courseId: c.id,
            semesterId: sem.id
          });
        });
      });
    });
    return list;
  }, [courses]);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      if (selectedSubjectFilter !== 'all' && r.subjectId !== selectedSubjectFilter) {
        return false;
      }
      if (selectedSemesterFilter !== 'all' && r.semesterId !== selectedSemesterFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.subjectName.toLowerCase().includes(q) ||
          r.topicFocus.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [rooms, selectedSubjectFilter, selectedSemesterFilter, searchQuery]);

  // Pomodoro Actions
  const handleToggleTimer = () => {
    if (!activeRoom) return;
    const nextRunning = !activeRoom.pomodoro.isRunning;
    const authorName = currentUser?.name || 'Estudiante';

    updateRoomPomodoro({
      ...activeRoom.pomodoro,
      isRunning: nextRunning,
      startedByName: authorName,
      lastUpdatedTimestamp: Date.now()
    });
  };

  const handleResetTimer = () => {
    if (!activeRoom) return;
    const duration = activeRoom.pomodoro.totalDurationSeconds;
    updateRoomPomodoro({
      ...activeRoom.pomodoro,
      isRunning: false,
      timeLeftSeconds: duration,
      lastUpdatedTimestamp: Date.now()
    });
  };

  const handleSwitchMode = (mode: 'work' | 'short_break' | 'long_break') => {
    if (!activeRoom) return;
    const duration =
      mode === 'work' ? 25 * 60 : mode === 'short_break' ? 5 * 60 : 15 * 60;
    updateRoomPomodoro({
      ...activeRoom.pomodoro,
      mode,
      isRunning: false,
      timeLeftSeconds: duration,
      totalDurationSeconds: duration,
      lastUpdatedTimestamp: Date.now()
    });
  };

  const updateRoomPomodoro = (pomodoroState: StudyRoom['pomodoro']) => {
    if (!activeRoom) return;
    setRooms((prev) =>
      prev.map((r) => (r.id === activeRoom.id ? { ...r, pomodoro: pomodoroState } : r))
    );

    // Save to Firestore if available
    try {
      if (db && auth.currentUser) {
        const roomDocRef = doc(db, 'studyGroups', activeRoom.id);
        setDoc(roomDocRef, { pomodoro: pomodoroState }, { merge: true }).catch(() => {});
      }
    } catch {
      // ignore
    }
  };

  // Add Shared Note
  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoom || !noteTitle.trim() || !noteContent.trim()) return;

    const newNote: StudyRoomNote = {
      id: `note-${Date.now()}`,
      authorId: currentUser?.id || `user-${Date.now()}`,
      authorName: currentUser?.name || 'Compañero ETSISI',
      authorAvatarColor: currentUser?.avatarColor || 'indigo',
      tag: noteTag,
      title: noteTitle.trim(),
      content: noteContent.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      likes: 1
    };

    const updatedNotes = [newNote, ...activeRoom.notes];
    setRooms((prev) =>
      prev.map((r) => (r.id === activeRoom.id ? { ...r, notes: updatedNotes } : r))
    );

    setIsAddingNote(false);
    setNoteTitle('');
    setNoteContent('');

    try {
      if (db && auth.currentUser) {
        const roomDocRef = doc(db, 'studyGroups', activeRoom.id);
        setDoc(roomDocRef, { notes: updatedNotes }, { merge: true }).catch(() => {});
      }
    } catch {
      // ignore
    }
  };

  // Upvote note
  const handleLikeNote = (noteId: string) => {
    if (!activeRoom) return;
    const updatedNotes = activeRoom.notes.map((n) =>
      n.id === noteId ? { ...n, likes: n.likes + 1 } : n
    );
    setRooms((prev) =>
      prev.map((r) => (r.id === activeRoom.id ? { ...r, notes: updatedNotes } : r))
    );

    try {
      if (db && auth.currentUser) {
        const roomDocRef = doc(db, 'studyGroups', activeRoom.id);
        setDoc(roomDocRef, { notes: updatedNotes }, { merge: true }).catch(() => {});
      }
    } catch {
      // ignore
    }
  };

  // Copy note content
  const handleCopyNote = (note: StudyRoomNote) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  // Send message in room chat
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeRoom || !chatInput.trim()) return;

    const userText = chatInput.trim();
    const userMsg: StudyRoomMessage = {
      id: `msg-${Date.now()}`,
      authorId: currentUser?.id || `user-${Date.now()}`,
      authorName: currentUser?.name || 'Estudiante',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...activeRoom.messages, userMsg];
    setRooms((prev) =>
      prev.map((r) => (r.id === activeRoom.id ? { ...r, messages: updatedMessages } : r))
    );
    setChatInput('');

    // Check if user is asking the AI Tutor directly inside the room
    if (
      userText.toLowerCase().includes('@tutor') ||
      userText.toLowerCase().includes('@ia') ||
      userText.startsWith('/ai') ||
      userText.startsWith('/tutor')
    ) {
      setIsAiConsulting(true);
      try {
        const prompt = userText
          .replace(/@tutor/gi, '')
          .replace(/@ia/gi, '')
          .replace(/\/ai/gi, '')
          .replace(/\/tutor/gi, '')
          .trim();

        const res = await fetch('/api/ai-tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: `[CONSULTA EN SALA DE ESTUDIO GRUPAL: "${activeRoom.name}" de la asignatura "${activeRoom.subjectName}"]: ${prompt}`,
            topicTitle: activeRoom.topicFocus,
            subtopicTitle: activeRoom.subjectName
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.answer) {
            const aiMsg: StudyRoomMessage = {
              id: `ai-msg-${Date.now()}`,
              authorId: 'ai-tutor',
              authorName: 'Tutor IA (ETSISI)',
              text: data.answer,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isAiResponse: true
            };
            setRooms((prev) =>
              prev.map((r) =>
                r.id === activeRoom.id
                  ? { ...r, messages: [...r.messages, aiMsg] }
                  : r
              )
            );
          }
        }
      } catch {
        // ignore
      } finally {
        setIsAiConsulting(false);
      }
    }
  };

  // Create New Room
  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const subjectObj = allSubjects.find((s) => s.id === newRoomSubjectId);

    const newRoom: StudyRoom = {
      id: `room-${Date.now()}`,
      name: newRoomName.trim(),
      subjectId: newRoomSubjectId,
      subjectName: subjectObj?.name || 'Asignatura',
      courseId: newRoomCourseId,
      semesterId: newRoomSemesterId,
      description: newRoomDescription.trim() || 'Sala virtual de estudio colaborativo y Pomodoro.',
      topicFocus: newRoomTopic.trim() || 'Temario oficial',
      activeMembersCount: 1,
      createdBy: currentUser?.name || 'Estudiante',
      createdAt: new Date().toISOString().split('T')[0],
      pomodoro: {
        isRunning: false,
        mode: 'work',
        timeLeftSeconds: 25 * 60,
        totalDurationSeconds: 25 * 60,
        lastUpdatedTimestamp: Date.now(),
        startedByName: currentUser?.name || 'Estudiante'
      },
      notes: [],
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          authorId: 'system',
          authorName: 'Sistema ETSISI',
          text: `¡Sala creada! Comparte apuntes, sincroniza el Pomodoro y pregunta al @Tutor IA en cualquier momento.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setRooms((prev) => [newRoom, ...prev]);
    setActiveRoomId(newRoom.id);
    setIsCreatingRoom(false);
    setNewRoomName('');
    setNewRoomTopic('');
    setNewRoomDescription('');

    try {
      if (db && auth.currentUser) {
        const roomDocRef = doc(db, 'studyGroups', newRoom.id);
        setDoc(roomDocRef, newRoom).catch(() => {});
      }
    } catch {
      // ignore
    }
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // RENDER: ACTIVE ROOM INTERIOR
  // ==========================================
  if (activeRoom) {
    const pomodoro = activeRoom.pomodoro;
    const progressPercent =
      ((pomodoro.totalDurationSeconds - pomodoro.timeLeftSeconds) /
        pomodoro.totalDurationSeconds) *
      100;

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Top bar with back to rooms list */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div>
            <button
              onClick={() => setActiveRoomId(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-1 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Volver a todas las Salas de Estudio</span>
            </button>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {activeRoom.subjectName}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                {activeRoom.semesterId}.º Semestre
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {activeRoom.courseId}.º Curso
              </span>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold ml-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{activeRoom.activeMembersCount} en la sala</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {activeRoom.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enfoque: <strong className="text-slate-700 dark:text-slate-300">{activeRoom.topicFocus}</strong>
            </p>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('pomodoro')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pomodoro'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Timer className="w-4 h-4" />
              <span>Pomodoro ({formatTime(pomodoro.timeLeftSeconds)})</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Apuntes ({activeRoom.notes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Debate ({activeRoom.messages.length})</span>
            </button>
          </div>
        </div>

        {/* ==================== TAB 1: POMODORO ==================== */}
        {activeTab === 'pomodoro' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Synchronized Timer Card */}
            <div className="lg:col-span-2 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center flex flex-col items-center justify-center">
              {/* Mode Selectors */}
              <div className="flex items-center gap-2 mb-8 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800">
                <button
                  onClick={() => handleSwitchMode('work')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    pomodoro.mode === 'work'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span>Estudio (25 min)</span>
                </button>
                <button
                  onClick={() => handleSwitchMode('short_break')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    pomodoro.mode === 'short_break'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Coffee className="w-4 h-4" />
                  <span>Descanso corto (5 min)</span>
                </button>
                <button
                  onClick={() => handleSwitchMode('long_break')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    pomodoro.mode === 'long_break'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Coffee className="w-4 h-4" />
                  <span>Descanso largo (15 min)</span>
                </button>
              </div>

              {/* Countdown Display */}
              <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    className="text-slate-100 dark:text-slate-800 stroke-current"
                    strokeWidth="7"
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                  />
                  <circle
                    className={`stroke-current transition-all duration-1000 ${
                      pomodoro.mode === 'work'
                        ? 'text-indigo-600'
                        : pomodoro.mode === 'short_break'
                        ? 'text-emerald-500'
                        : 'text-cyan-500'
                    }`}
                    strokeWidth="7"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * progressPercent) / 100}
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                    {formatTime(pomodoro.timeLeftSeconds)}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wider flex items-center gap-1">
                    {pomodoro.isRunning ? (
                      <>
                        <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        <span>Sincronizado en vivo</span>
                      </>
                    ) : (
                      <span>En pausa</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleToggleTimer}
                  className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg transition-all cursor-pointer ${
                    pomodoro.isRunning
                      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30 scale-105'
                  }`}
                >
                  {pomodoro.isRunning ? (
                    <>
                      <Pause className="w-5 h-5" />
                      <span>Pausar sesión grupal</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>Iniciar Pomodoro sincronizado</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleResetTimer}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Reiniciar contador"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-5">
                Cualquier cambio de inicio o pausa se sincroniza en tiempo real para todos los compañeros en la sala.
              </p>
            </div>

            {/* Sidebar: Active Members & Rules */}
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span>Estudiantes en esta sala</span>
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px]">
                        TÚ
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {currentUser?.name || 'Estudiante'} (Tú)
                      </span>
                    </div>
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{currentUser?.currentStreak || 1}d</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px]">
                        CE
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Compañero ETSISI
                      </span>
                    </div>
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>4d</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[11px]">
                        LG
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Lucía G.
                      </span>
                    </div>
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>7d</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Study Guidelines */}
              <div className="p-5 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Método Pomodoro Oficial</span>
                </h4>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                  <li>• 25 min de concentración profunda sin mirar el móvil.</li>
                  <li>• 5 min de descanso obligatorio para estirar y descansar la vista.</li>
                  <li>• Al completar 4 bloques, tomar un descanso largo de 15 a 30 min.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: APUNTES COMPARTIDOS ==================== */}
        {activeTab === 'notes' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Pizarra de Apuntes y Tips de Examen
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comparte teoremas clave, trucos de cátedra y código C que han caído en parciales
                </p>
              </div>

              <button
                onClick={() => setIsAddingNote(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Subir apunte / tip</span>
              </button>
            </div>

            {/* Note creation modal */}
            {isAddingNote && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    Compartir apunte en {activeRoom.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Escribe tu nota, consejo de examen o fragmento de código
                  </p>

                  <form onSubmit={handleCreateNote} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Categoría
                      </label>
                      <select
                        value={noteTag}
                        onChange={(e) => setNoteTag(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium"
                      >
                        <option value="Tip Examen">Tip Examen</option>
                        <option value="Fórmula">Fórmula</option>
                        <option value="Código C">Código C</option>
                        <option value="Resumen">Resumen</option>
                        <option value="Duda Resuelta">Duda Resuelta</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Título de la nota
                      </label>
                      <input
                        type="text"
                        required
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        placeholder="Ej. Criterio de parada en Newton-Raphson"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Contenido o explicación
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Escribe la explicación, pasos matemáticos o código..."
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingNote(false)}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 cursor-pointer"
                      >
                        Publicar para el grupo
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeRoom.notes.map((note) => (
                <div
                  key={note.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                        {note.tag}
                      </span>
                      <span className="text-[11px] text-slate-400">{note.createdAt}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      {note.title}
                    </h4>

                    <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4">
                      {note.content}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[9px]">
                        {note.authorName.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {note.authorName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyNote(note)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                        title="Copiar contenido"
                      >
                        {copiedNoteId === note.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleLikeNote(note.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{note.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: DEBATE Y CHAT CON TUTOR IA ==================== */}
        {activeTab === 'chat' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[580px]">
            {/* Chat header */}
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>Canal de Discusión en Directo</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Escribe dudas para el grupo o menciona <strong className="text-indigo-600 dark:text-indigo-400">@tutor</strong> para que la IA responda a todos.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChatInput('@tutor ¿Cómo se resuelve este ejercicio paso a paso? ')}
                  className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Preguntar al Tutor IA</span>
                </button>
              </div>
            </div>

            {/* Messages scroll */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {activeRoom.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.isAiResponse
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 p-3.5 rounded-2xl ml-0 sm:ml-4'
                      : 'p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      {msg.isAiResponse && <Bot className="w-4 h-4 text-indigo-600" />}
                      <span>{msg.authorName}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              ))}
              {isAiConsulting && (
                <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>El Tutor IA de la ETSISI está redactando la explicación para la sala...</span>
                </div>
              )}
            </div>

            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Escribe un mensaje o escribe @tutor para que responda la IA..."
                className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // RENDER: ROOMS LIST / DIRECTORY
  // ==========================================
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-1 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Volver al menú principal</span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Grupos de Estudio Virtuales (ETSISI)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Únete a salas virtuales por asignatura, comparte apuntes y sincroniza sesiones Pomodoro en directo
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCreatingRoom(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Crear nueva sala</span>
        </button>
      </div>

      {/* Filters and search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Buscar sala o tema
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ej. Karnaugh, Matrices, RSA, C..."
            className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Asignatura
          </label>
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium cursor-pointer"
          >
            <option value="all">Todas las asignaturas</option>
            <option value="fp">Fundamentos de Programación</option>
            <option value="fc">Fundamentos de Computadores</option>
            <option value="am">Análisis Matemático</option>
            <option value="lymd">Lógica y Matemática Discreta</option>
            <option value="alg">Álgebra (2.º Semestre)</option>
            <option value="ec">Estructura de Computadores (2.º Semestre)</option>
            <option value="edat">Estructura de Datos (2.º Semestre)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Semestre
          </label>
          <div className="flex gap-1.5">
            <button
              onClick={() => setSelectedSemesterFilter('all')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedSemesterFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedSemesterFilter('1')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedSemesterFilter === '1'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              1.º Sem
            </button>
            <button
              onClick={() => setSelectedSemesterFilter('2')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedSemesterFilter === '2'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              2.º Sem
            </button>
          </div>
        </div>
      </div>

      {/* Create Room Modal */}
      {isCreatingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Crear Sala de Estudio Virtual
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Crea un espacio para estudiar con tus compañeros de clase con Pomodoro y notas compartidas
            </p>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la sala
                </label>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Ej. Mesa de Estudio: Punteros y Recursividad en C"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Curso
                  </label>
                  <select
                    value={newRoomCourseId}
                    onChange={(e) => setNewRoomCourseId(e.target.value as CourseId)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium"
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
                    value={newRoomSemesterId}
                    onChange={(e) => setNewRoomSemesterId(e.target.value as SemesterId)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium"
                  >
                    <option value="1">1.er Semestre</option>
                    <option value="2">2.º Semestre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Asignatura
                </label>
                <select
                  value={newRoomSubjectId}
                  onChange={(e) => setNewRoomSubjectId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium"
                >
                  {allSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.courseId}.º Curso • {s.semesterId}.º Semestre)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tema o enfoque de la sesión
                </label>
                <input
                  type="text"
                  required
                  value={newRoomTopic}
                  onChange={(e) => setNewRoomTopic(e.target.value)}
                  placeholder="Ej. Tema 4: Punteros y paso por referencia"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={newRoomDescription}
                  onChange={(e) => setNewRoomDescription(e.target.value)}
                  placeholder="Explica qué temas o problemas se van a trabajar en la sala..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingRoom(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Crear sala
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRooms.map((room) => {
          const isPomodoroActive = room.pomodoro.isRunning;

          return (
            <div
              key={room.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {room.subjectName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                      {room.semesterId}.º Semestre
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {room.courseId}.º Curso
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{room.activeMembersCount} alumnos</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                  {room.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                  {room.description}
                </p>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs mb-4">
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Enfoque:</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 truncate max-w-[220px]">
                      {room.topicFocus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5 text-amber-500" />
                      <span>Pomodoro: {formatTime(room.pomodoro.timeLeftSeconds)}</span>
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        isPomodoroActive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isPomodoroActive ? '🟢 En sesión' : '🟡 Sala en pausa'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{room.notes.length} apuntes</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{room.messages.length} mensajes</span>
                  </span>
                </div>

                <button
                  onClick={() => setActiveRoomId(room.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>Entrar a la sala</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
