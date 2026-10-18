/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  NavState,
  CourseId,
  SemesterId,
  Subject,
  Topic,
  SubTopic,
  Exercise,
  Course,
  UserProfile,
  ExamEvent,
  UploadedDocument
} from './types';
import { allCourses as defaultCourses } from './data/allCourses';
import { auth, db, testConnection, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { updateStudyStreak } from './utils/gamification';

import { WelcomeScreen } from './components/WelcomeScreen';
import { Header } from './components/Header';
import { CourseSelector } from './components/CourseSelector';
import { SubjectView } from './components/SubjectView';
import { TopicMenu } from './components/TopicMenu';
import { MindMapView } from './components/MindMapView';
import { SummaryView } from './components/SummaryView';
import { DetailedExplanationView } from './components/DetailedExplanationView';
import { ExercisesListView } from './components/ExercisesListView';
import { ExerciseSolverView } from './components/ExerciseSolverView';
import { ExamSimulationView } from './components/ExamSimulationView';
import { StudyAnalyticsView } from './components/StudyAnalyticsView';
import { FlashcardsView } from './components/FlashcardsView';
import { PomodoroStudyView } from './components/PomodoroStudyView';
import { SubjectGradesView } from './components/SubjectGradesView';
import { UserProfileSettingsView } from './components/UserProfileSettingsView';
import { CustomMultiTopicExamView } from './components/CustomMultiTopicExamView';
import { AITutorDedicatedView } from './components/AITutorDedicatedView';
import { UploadCustomNotesModal } from './components/UploadCustomNotesModal';
import { AuthModal } from './components/AuthModal';
import { AITutorChat } from './components/AITutorChat';
import { ExamCalendarView } from './components/ExamCalendarView';
import { StudyPlannerView } from './components/StudyPlannerView';
import { DocumentViewerWithAITutor } from './components/DocumentViewerWithAITutor';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { useSwipeGesture } from './hooks/useSwipeGesture';

// Helper to parse NavState from current URL query parameters or fallback
const getInitialNav = (): NavState => {
  try {
    const params = new URLSearchParams(window.location.search);
    const view = (params.get('view') as NavState['view']) || null;
    if (view) {
      return {
        view,
        courseId: (params.get('course') as CourseId) || null,
        semesterId: (params.get('sem') as SemesterId) || null,
        subjectId: params.get('subj') || null,
        topicId: params.get('topic') || null,
        subtopicId: params.get('subtopic') || null,
        exerciseId: params.get('ex') || null,
        documentId: params.get('doc') || null
      };
    }

    const saved = localStorage.getItem('etsisi_current_nav');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.view) return parsed;
    }
  } catch {
    // fallback
  }

  return {
    view: 'welcome',
    courseId: null,
    semesterId: null,
    subjectId: null,
    topicId: null,
    subtopicId: null,
    exerciseId: null,
    documentId: null
  };
};

// Helper to serialize NavState to URL search string
const getNavUrl = (nav: NavState): string => {
  if (nav.view === 'welcome') return window.location.pathname;

  const params = new URLSearchParams();
  params.set('view', nav.view);
  if (nav.courseId) params.set('course', nav.courseId);
  if (nav.semesterId) params.set('sem', nav.semesterId);
  if (nav.subjectId) params.set('subj', nav.subjectId);
  if (nav.topicId) params.set('topic', nav.topicId);
  if (nav.subtopicId) params.set('subtopic', nav.subtopicId);
  if (nav.exerciseId) params.set('ex', nav.exerciseId);
  if (nav.documentId) params.set('doc', nav.documentId);

  return `${window.location.pathname}?${params.toString()}`;
};

export default function App() {
  // Test Firestore connection on boot
  useEffect(() => {
    testConnection();
  }, []);

  // Dark mode state with persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('etsisi_dark_mode');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('etsisi_dark_mode', JSON.stringify(darkMode));
    } catch {
      // ignore
    }
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // User Profile Account state - persistent in Firebase Firestore & localStorage
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('etsisi_current_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('etsisi_current_user');
      return !saved;
    } catch {
      return true;
    }
  });

  // Dynamic courses state with custom uploaded notes and topics
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('etsisi_custom_courses');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultCourses;
  });

  useEffect(() => {
    try {
      localStorage.setItem('etsisi_custom_courses', JSON.stringify(courses));
    } catch {
      // ignore
    }
  }, [courses]);

  // Persistent timers and completion states per exercise
  const [exerciseTimes, setExerciseTimes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('etsisi_exercise_times');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('etsisi_exercise_completed');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persistent student exams (defaults to EMPTY array, no invented fake exams!)
  const [exams, setExams] = useState<ExamEvent[]>(() => {
    try {
      const saved = localStorage.getItem('etsisi_exams_calendar');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistent student uploaded documents / PDFs
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>(() => {
    try {
      const saved = localStorage.getItem('etsisi_uploaded_documents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep local storage synchronized
  useEffect(() => {
    try {
      localStorage.setItem('etsisi_exercise_times', JSON.stringify(exerciseTimes));
    } catch {
      // ignore
    }
  }, [exerciseTimes]);

  useEffect(() => {
    try {
      localStorage.setItem('etsisi_exercise_completed', JSON.stringify(completedExercises));
    } catch {
      // ignore
    }
  }, [completedExercises]);

  useEffect(() => {
    try {
      localStorage.setItem('etsisi_exams_calendar', JSON.stringify(exams));
    } catch {
      // ignore
    }
  }, [exams]);

  useEffect(() => {
    try {
      localStorage.setItem('etsisi_uploaded_documents', JSON.stringify(uploadedDocuments));
    } catch {
      // ignore
    }
  }, [uploadedDocuments]);

  // Sync to Firestore debounced whenever data changes
  const syncTimeoutRef = useRef<any>(null);
  const syncStudyDataToFirestore = useCallback(
    (
      times: Record<string, number>,
      completed: Record<string, boolean>,
      examList: ExamEvent[],
      docList: UploadedDocument[]
    ) => {
      if (!currentUser?.id) return;
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

      syncTimeoutRef.current = setTimeout(async () => {
        // Sanitize documents to prevent exceeding Firestore 1MB document limit
        const sanitizedDocList = docList.map((d) => ({
          id: d.id,
          name: d.name,
          fileType: d.fileType,
          fileUrl: d.fileUrl || `/api/documents/${d.id}/file`,
          courseId: d.courseId,
          semesterId: d.semesterId,
          subjectId: d.subjectId,
          topicId: d.topicId || null,
          uploadedAt: d.uploadedAt,
          sizeBytes: d.sizeBytes
        }));

        // 1. Dual-sync: Backup to server storage (persists across devices & handles files)
        try {
          fetch('/api/sync-study-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: currentUser.id,
              exerciseTimes: times,
              completedExercises: completed,
              exams: examList,
              uploadedDocuments: sanitizedDocList
            })
          }).catch(() => {});
        } catch {
          // ignore
        }

        // 2. Dual-sync: Real-time Firebase Firestore
        try {
          const studyDocRef = doc(db, 'users', currentUser.id, 'studyData', 'main');
          await setDoc(
            studyDocRef,
            {
              userId: currentUser.id,
              exerciseTimes: times,
              completedExercises: completed,
              exams: examList,
              uploadedDocuments: sanitizedDocList,
              lastUpdated: new Date().toISOString()
            },
            { merge: true }
          );
        } catch (err) {
          console.warn('Firestore write warning:', err);
        }
      }, 500);
    },
    [currentUser?.id]
  );

  // Real Firebase Auth listener + Cross-device Firestore real-time listener + Server sync
  useEffect(() => {
    let unsubsSnapshot: (() => void) | null = null;

    // Fetch server-stored documents on start
    fetch('/api/documents')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.documents) && data.documents.length > 0) {
          setUploadedDocuments((prev) => {
            const merged = [...prev];
            data.documents.forEach((sd: UploadedDocument) => {
              const idx = merged.findIndex((m) => m.id === sd.id);
              if (idx === -1) {
                merged.push(sd);
              } else {
                merged[idx] = { ...merged[idx], ...sd };
              }
            });
            return merged;
          });
        }
      })
      .catch(() => {});

    const unsubscribeAuth = onAuthStateChanged(auth, async (fireUser) => {
      if (unsubsSnapshot) {
        unsubsSnapshot();
        unsubsSnapshot = null;
      }

      if (fireUser) {
        try {
          // Dual sync: pull from server backup cache
          fetch(`/api/sync-study-data/${fireUser.uid}`)
            .then((r) => r.json())
            .then((serverData) => {
              if (serverData.exerciseTimes) {
                setExerciseTimes((prev) => ({ ...prev, ...serverData.exerciseTimes }));
              }
              if (serverData.completedExercises) {
                setCompletedExercises((prev) => ({ ...prev, ...serverData.completedExercises }));
              }
              if (Array.isArray(serverData.exams) && serverData.exams.length > 0) {
                setExams(serverData.exams);
              }
              if (Array.isArray(serverData.uploadedDocuments) && serverData.uploadedDocuments.length > 0) {
                setUploadedDocuments((prev) => {
                  const merged = [...prev];
                  serverData.uploadedDocuments.forEach((sd: UploadedDocument) => {
                    if (!merged.some((m) => m.id === sd.id)) merged.push(sd);
                  });
                  return merged;
                });
              }
            })
            .catch(() => {});

          const userDocRef = doc(db, 'users', fireUser.uid);
          const snap = await getDoc(userDocRef);
          let profile: UserProfile;

          if (snap.exists()) {
            profile = snap.data() as UserProfile;
            profile.id = fireUser.uid;
          } else {
            profile = {
              id: fireUser.uid,
              name: fireUser.displayName || fireUser.email?.split('@')[0] || 'Estudiante ETSISI',
              email: fireUser.email || '',
              studentId: 'bo' + Math.floor(1000 + Math.random() * 9000),
              selectedCourseId: '1',
              avatarColor: '#4f46e5',
              createdAt: new Date().toISOString(),
              isRegistered: true,
              currentStreak: 1,
              longestStreak: 1,
              lastActiveDate: new Date().toISOString().split('T')[0]
            };
            await setDoc(userDocRef, profile);
          }

          // Check & update study streak
          const streakUpdate = updateStudyStreak(
            profile.lastActiveDate,
            profile.currentStreak || 1,
            profile.longestStreak || 1
          );

          if (streakUpdate.updated) {
            profile.currentStreak = streakUpdate.newStreak;
            profile.longestStreak = streakUpdate.newLongestStreak;
            profile.lastActiveDate = streakUpdate.todayStr;

            await setDoc(
              userDocRef,
              {
                currentStreak: streakUpdate.newStreak,
                longestStreak: streakUpdate.newLongestStreak,
                lastActiveDate: streakUpdate.todayStr
              },
              { merge: true }
            );
          }

          setCurrentUser(profile);
          localStorage.setItem('etsisi_current_user', JSON.stringify(profile));

          // Set up real-time cross-device sync on studyData/main
          const studyDocRef = doc(db, 'users', fireUser.uid, 'studyData', 'main');
          unsubsSnapshot = onSnapshot(studyDocRef, (studySnap) => {
            if (studySnap.exists()) {
              const data = studySnap.data();
              if (data.exerciseTimes) {
                setExerciseTimes((prev) => ({ ...prev, ...data.exerciseTimes }));
              }
              if (data.completedExercises) {
                setCompletedExercises((prev) => ({ ...prev, ...data.completedExercises }));
              }
              if (Array.isArray(data.exams)) {
                setExams(data.exams);
              }
              if (Array.isArray(data.uploadedDocuments)) {
                setUploadedDocuments((prev) => {
                  const merged = [...prev];
                  data.uploadedDocuments.forEach((sd: UploadedDocument) => {
                    const idx = merged.findIndex((m) => m.id === sd.id);
                    if (idx === -1) {
                      merged.push(sd);
                    } else {
                      merged[idx] = { ...merged[idx], ...sd };
                    }
                  });
                  return merged;
                });
              }
            }
          });
        } catch (err) {
          console.error('Error synchronizing profile from Firebase:', err);
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubsSnapshot) unsubsSnapshot();
    };
  }, []);

  const handleUpdateUser = useCallback(async (updated: UserProfile) => {
    setCurrentUser(updated);
    try {
      localStorage.setItem('etsisi_current_user', JSON.stringify(updated));
      if (updated.id) {
        await setDoc(doc(db, 'users', updated.id), updated, { merge: true });
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem('etsisi_current_user');
    } catch {
      // ignore
    }
    setIsAuthModalOpen(true);
  }, []);

  // Update exams and sync across devices
  const handleUpdateExams = useCallback(
    (updatedExams: ExamEvent[]) => {
      setExams(updatedExams);
      syncStudyDataToFirestore(exerciseTimes, completedExercises, updatedExams, uploadedDocuments);
    },
    [exerciseTimes, completedExercises, uploadedDocuments, syncStudyDataToFirestore]
  );

  // Save new or updated document and sync
  const handleSaveDocument = useCallback(
    (newDoc: UploadedDocument) => {
      setUploadedDocuments((prev) => {
        const existingIdx = prev.findIndex((d) => d.id === newDoc.id);
        let updated: UploadedDocument[];
        if (existingIdx >= 0) {
          updated = [...prev];
          updated[existingIdx] = newDoc;
        } else {
          updated = [newDoc, ...prev];
        }
        syncStudyDataToFirestore(exerciseTimes, completedExercises, exams, updated);
        return updated;
      });
    },
    [exerciseTimes, completedExercises, exams, syncStudyDataToFirestore]
  );

  // Delete document and sync
  const handleDeleteDocument = useCallback(
    (docId: string) => {
      setUploadedDocuments((prev) => {
        const updated = prev.filter((d) => d.id !== docId);
        syncStudyDataToFirestore(exerciseTimes, completedExercises, exams, updated);
        return updated;
      });
    },
    [exerciseTimes, completedExercises, exams, syncStudyDataToFirestore]
  );

  // -------------------------------------------------------------
  // True Web Navigation & URL State Synchronization
  // -------------------------------------------------------------
  const [currentNav, setCurrentNav] = useState<NavState>(getInitialNav);

  // Push new navigation state and update URL query params
  const navigateTo = useCallback((nextState: Partial<NavState>) => {
    setCurrentNav((prev) => {
      const updated: NavState = {
        ...prev,
        ...nextState
      };
      try {
        const nextUrl = getNavUrl(updated);
        window.history.pushState(updated, '', nextUrl);
        localStorage.setItem('etsisi_current_nav', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Back navigation: native browser history back with fallbacks
  // Back navigation: deterministic semantic hierarchy
  const handleBack = useCallback(() => {
    if (currentNav.view === 'document_viewer') {
      navigateTo({ view: 'subject', documentId: null });
    } else if (currentNav.view === 'exercise_solver') {
      navigateTo({ view: 'exercises_list', exerciseId: null });
    } else if (
      currentNav.view === 'exercises_list' ||
      currentNav.view === 'explanation' ||
      currentNav.view === 'summary' ||
      currentNav.view === 'mind_map' ||
      currentNav.view === 'flashcards' ||
      currentNav.view === 'exam_simulation'
    ) {
      navigateTo({ view: 'topic_menu' });
    } else if (currentNav.view === 'topic_menu') {
      navigateTo({ view: 'subject' });
    } else if (currentNav.view === 'subject') {
      navigateTo({ view: 'courses', subjectId: null, topicId: null });
    } else if (currentNav.view === 'study_planner') {
      navigateTo({ view: 'exam_calendar' });
    } else if (
      currentNav.view === 'exam_calendar' ||
      currentNav.view === 'grades' ||
      currentNav.view === 'analytics' ||
      currentNav.view === 'custom_exam' ||
      currentNav.view === 'ai_tutor_page' ||
      currentNav.view === 'profile' ||
      currentNav.view === 'pomodoro'
    ) {
      navigateTo({ view: 'courses' });
    } else if (currentNav.view === 'courses') {
      navigateTo({ view: 'welcome' });
    } else {
      navigateTo({ view: 'welcome' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentNav.view, navigateTo]);

  // Sync with browser popstate, gaming mouse back button, and keyboard shortcuts
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentNav(event.state);
        try {
          localStorage.setItem('etsisi_current_nav', JSON.stringify(event.state));
        } catch {
          // ignore
        }
      } else {
        const parsed = getInitialNav();
        setCurrentNav(parsed);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 3) {
        e.preventDefault();
        handleBack();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      if ((e.altKey && e.key === 'ArrowLeft') || (!isInput && e.key === 'Backspace')) {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleBack]);

  // Return directly to the main welcome screen ("Ingeniería de computadores")
  const handleGoHome = useCallback(() => {
    navigateTo({
      view: 'welcome',
      courseId: null,
      semesterId: null,
      subjectId: null,
      topicId: null,
      subtopicId: null,
      exerciseId: null,
      documentId: null
    });
  }, [navigateTo]);

  // Current entity lookups
  const currentCourse = useMemo(() => {
    if (!currentNav.courseId) return null;
    return courses.find((c) => c.id === currentNav.courseId) || null;
  }, [courses, currentNav.courseId]);

  const currentSemester = useMemo(() => {
    if (!currentCourse || !currentNav.semesterId) return null;
    return currentCourse.semesters.find((s) => s.id === currentNav.semesterId) || null;
  }, [currentCourse, currentNav.semesterId]);

  const currentSubject = useMemo(() => {
    if (!currentNav.subjectId) return null;
    for (const c of courses) {
      for (const sem of c.semesters) {
        const found = sem.subjects.find((s) => s.id === currentNav.subjectId);
        if (found) return found;
      }
    }
    return null;
  }, [courses, currentNav.subjectId]);

  const currentTopic = useMemo(() => {
    if (!currentSubject || !currentNav.topicId) return null;
    return currentSubject.topics.find((t) => t.id === currentNav.topicId) || null;
  }, [currentSubject, currentNav.topicId]);

  const currentSubtopic = useMemo(() => {
    if (!currentTopic || !currentNav.subtopicId) return null;
    return currentTopic.subtopics.find((s) => s.id === currentNav.subtopicId) || null;
  }, [currentTopic, currentNav.subtopicId]);

  const currentExercise = useMemo(() => {
    if (!currentTopic || !currentNav.exerciseId) return null;
    return currentTopic.exercises.find((e) => e.id === currentNav.exerciseId) || null;
  }, [currentTopic, currentNav.exerciseId]);

  // Current uploaded document being viewed
  const currentDoc = useMemo(() => {
    if (!currentNav.documentId) return null;
    return uploadedDocuments.find((d) => d.id === currentNav.documentId) || null;
  }, [uploadedDocuments, currentNav.documentId]);

  // Next exercise for continuity
  const nextExercise = useMemo(() => {
    if (!currentTopic || !currentExercise) return null;
    const idx = currentTopic.exercises.findIndex((e) => e.id === currentExercise.id);
    if (idx >= 0 && idx < currentTopic.exercises.length - 1) {
      return currentTopic.exercises[idx + 1];
    }
    return null;
  }, [currentTopic, currentExercise]);

  // Flattened list of all subjects
  const allFlattenedSubjects = useMemo(() => {
    const list: Subject[] = [];
    courses.forEach((c) => {
      c.semesters.forEach((sem) => {
        sem.subjects.forEach((subj) => {
          list.push(subj);
        });
      });
    });
    return list;
  }, [courses]);

  // Total study time and counts
  const totalStudySeconds = useMemo(() => {
    return Object.values(exerciseTimes).reduce((acc, curr) => acc + curr, 0);
  }, [exerciseTimes]);

  const completedCount = useMemo(() => {
    return Object.values(completedExercises).filter(Boolean).length;
  }, [completedExercises]);

  const inProgressCount = useMemo(() => {
    return Object.keys(exerciseTimes).length - completedCount;
  }, [exerciseTimes, completedCount]);

  // Handlers for saving times and completion
  const handleSaveExerciseTime = useCallback(
    (exerciseId: string, seconds: number) => {
      setExerciseTimes((prev) => {
        const updated = { ...prev, [exerciseId]: seconds };
        syncStudyDataToFirestore(updated, completedExercises, exams, uploadedDocuments);
        return updated;
      });
    },
    [completedExercises, exams, uploadedDocuments, syncStudyDataToFirestore]
  );

  const handleCompleteExercise = useCallback(
    (exerciseId: string, seconds: number) => {
      setExerciseTimes((prevTimes) => {
        const updatedTimes = { ...prevTimes, [exerciseId]: seconds };
        setCompletedExercises((prevCompleted) => {
          const updatedCompleted = { ...prevCompleted, [exerciseId]: true };
          syncStudyDataToFirestore(updatedTimes, updatedCompleted, exams, uploadedDocuments);
          return updatedCompleted;
        });
        return updatedTimes;
      });
    },
    [exams, uploadedDocuments, syncStudyDataToFirestore]
  );

  // Upload custom notes modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const handleSaveNewTopic = useCallback(
    (courseId: CourseId, semesterId: SemesterId, subjectId: string, newTopic: Topic) => {
      setCourses((prevCourses) => {
        return prevCourses.map((c) => {
          if (c.id !== courseId) return c;
          return {
            ...c,
            semesters: c.semesters.map((sem) => {
              if (sem.id !== semesterId) return sem;
              return {
                ...sem,
                subjects: sem.subjects.map((subj) => {
                  if (subj.id !== subjectId) return subj;
                  return {
                    ...subj,
                    topics: [...subj.topics, newTopic]
                  };
                })
              };
            })
          };
        });
      });

      navigateTo({
        view: 'topic_menu',
        courseId,
        semesterId,
        subjectId,
        topicId: newTopic.id
      });
    },
    [navigateTo]
  );

  const handleAddSubtopicsToExistingTopic = useCallback(
    (
      courseId: CourseId,
      semesterId: SemesterId,
      subjectId: string,
      topicId: string,
      newSubtopics: SubTopic[],
      newExercises: Exercise[]
    ) => {
      setCourses((prevCourses) => {
        return prevCourses.map((c) => {
          if (c.id !== courseId) return c;
          return {
            ...c,
            semesters: c.semesters.map((sem) => {
              if (sem.id !== semesterId) return sem;
              return {
                ...sem,
                subjects: sem.subjects.map((subj) => {
                  if (subj.id !== subjectId) return subj;
                  return {
                    ...subj,
                    topics: subj.topics.map((t) => {
                      if (t.id !== topicId) return t;
                      return {
                        ...t,
                        subtopics: [...t.subtopics, ...newSubtopics],
                        exercises: [...t.exercises, ...newExercises],
                        practicalExamProblems: [...t.practicalExamProblems, ...newExercises]
                      };
                    })
                  };
                })
              };
            })
          };
        });
      });

      navigateTo({
        view: 'topic_menu',
        courseId,
        semesterId,
        subjectId,
        topicId
      });
    },
    [navigateTo]
  );

  // Swipe navigation gesture for iPad and mobile
  const swipeContainerRef = useRef<HTMLDivElement>(null);
  useSwipeGesture({
    onSwipeBack: () => {
      if (currentNav.view !== 'welcome' && currentNav.view !== 'courses') {
        handleBack();
      }
    }
  });

  return (
    <div
      ref={swipeContainerRef}
      className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans antialiased selection:bg-indigo-500 selection:text-white"
    >
      {/* Universal Top Header */}
      {currentNav.view !== 'welcome' && (
        <Header
          nav={currentNav}
          onBack={handleBack}
          onGoHome={handleGoHome}
          onSelectCourse={(courseId) =>
            navigateTo({
              view: 'courses',
              courseId,
              semesterId: null,
              subjectId: null,
              topicId: null
            })
          }
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onOpenAnalytics={() => navigateTo({ view: 'analytics' })}
          onOpenUploadNotes={() => setIsUploadModalOpen(true)}
          onOpenPomodoro={() => navigateTo({ view: 'pomodoro' })}
          onOpenGrades={() => navigateTo({ view: 'grades' })}
          onOpenCustomExam={() => navigateTo({ view: 'custom_exam' })}
          onOpenAITutor={() => navigateTo({ view: 'ai_tutor_page' })}
          onOpenProfile={() => navigateTo({ view: 'profile' })}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenCalendar={() => navigateTo({ view: 'exam_calendar' })}
          onOpenStudyPlanner={() => navigateTo({ view: 'study_planner' })}
          onOpenStudyGroups={() => navigateTo({ view: 'study_groups' })}
          user={currentUser}
          subjectTitle={currentSubject?.name}
          topicTitle={currentTopic?.title}
          exerciseTitle={currentExercise?.title}
        />
      )}

      {/* Main Content View Switcher */}
      <main className="flex-1 min-h-0">
        {currentNav.view === 'welcome' && (
          <WelcomeScreen onContinue={() => navigateTo({ view: 'courses' })} />
        )}

        {currentNav.view === 'courses' && (
          <CourseSelector
            courses={courses}
            selectedCourseId={currentNav.courseId}
            selectedSemesterId={currentNav.semesterId}
            onSelectSubject={(courseId, semesterId, subject) => {
              navigateTo({
                view: 'subject',
                courseId,
                semesterId,
                subjectId: subject.id,
                topicId: null
              });
            }}
          />
        )}

        {currentNav.view === 'subject' && currentSubject && (
          <SubjectView
            subject={currentSubject}
            courses={courses}
            uploadedDocuments={uploadedDocuments}
            onGoToCourses={() =>
              navigateTo({
                view: 'courses',
                courseId: currentNav.courseId,
                semesterId: null,
                subjectId: null,
                topicId: null
              })
            }
            onSelectSubject={(courseId, semesterId, subject) => {
              navigateTo({
                view: 'subject',
                courseId,
                semesterId,
                subjectId: subject.id,
                topicId: null
              });
            }}
            onSelectTopic={(topic) => {
              navigateTo({
                view: 'topic_menu',
                topicId: topic.id
              });
            }}
            onDirectAction={(topic, action) => {
              const viewMap: Record<string, NavState['view']> = {
                mindmap: 'mind_map',
                summary: 'summary',
                explanation: 'explanation',
                flashcards: 'flashcards',
                exercises: 'exercises_list',
                exam: 'exam_simulation'
              };
              navigateTo({
                view: viewMap[action] || 'topic_menu',
                topicId: topic.id
              });
            }}
            onOpenStudyGroups={() => navigateTo({ view: 'study_groups' })}
            onOpenAITutor={() => navigateTo({ view: 'ai_tutor_page' })}
            onOpenDocument={(doc) =>
              navigateTo({ view: 'document_viewer', documentId: doc.id })
            }
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
          />
        )}

        {currentNav.view === 'topic_menu' && currentSubject && currentTopic && (
          <TopicMenu
            subject={currentSubject}
            topic={currentTopic}
            onBackToSubject={() => navigateTo({ view: 'subject', topicId: null })}
            onGoToCourses={() =>
              navigateTo({
                view: 'courses',
                courseId: currentNav.courseId,
                semesterId: null,
                subjectId: null,
                topicId: null
              })
            }
            onOpenMindMap={() => navigateTo({ view: 'mind_map' })}
            onOpenSummary={() => navigateTo({ view: 'summary' })}
            onOpenExplanation={(st) =>
              navigateTo({ view: 'explanation', subtopicId: st ? st.id : null })
            }
            onOpenExercises={() => navigateTo({ view: 'exercises_list' })}
            onOpenExam={() => navigateTo({ view: 'exam_simulation' })}
            onOpenFlashcards={() => navigateTo({ view: 'flashcards' })}
          />
        )}

        {currentNav.view === 'mind_map' && currentTopic && (
          <MindMapView
            topic={currentTopic}
            onGoToExplanation={(subtopic) => {
              navigateTo({
                view: 'explanation',
                subtopicId: subtopic.id
              });
            }}
          />
        )}

        {currentNav.view === 'summary' && currentTopic && (
          <SummaryView
            topic={currentTopic}
            onGoToExercises={() => navigateTo({ view: 'exercises_list' })}
            onGoToExam={() => navigateTo({ view: 'exam_simulation' })}
          />
        )}

        {currentNav.view === 'explanation' && currentTopic && (
          <DetailedExplanationView
            topic={currentTopic}
            initialSubtopic={currentSubtopic}
            onGoToExercises={() => navigateTo({ view: 'exercises_list' })}
            onBackToTopicMenu={() => navigateTo({ view: 'topic_menu' })}
            onOpenAITutorWithTopic={(t) =>
              navigateTo({ view: 'ai_tutor_page', topicId: t.id })
            }
          />
        )}

        {currentNav.view === 'flashcards' && currentTopic && (
          <FlashcardsView
            topic={currentTopic}
            onBack={() => navigateTo({ view: 'topic_menu' })}
          />
        )}

        {currentNav.view === 'exercises_list' && currentSubject && currentTopic && (
          <ExercisesListView
            subject={currentSubject}
            topic={currentTopic}
            onSelectExercise={(exercise) => {
              navigateTo({
                view: 'exercise_solver',
                exerciseId: exercise.id
              });
            }}
            savedTimes={exerciseTimes}
            completedExercises={completedExercises}
          />
        )}

        {currentNav.view === 'exercise_solver' && currentExercise && (
          <ExerciseSolverView
            exercise={currentExercise}
            nextExercise={nextExercise}
            initialTime={exerciseTimes[currentExercise.id] || 0}
            initialCompleted={!!completedExercises[currentExercise.id]}
            onSaveTime={handleSaveExerciseTime}
            onCompleteExercise={handleCompleteExercise}
            onBackToExercises={() => navigateTo({ view: 'exercises_list', exerciseId: null })}
            onGoToNextExercise={(next) => {
              navigateTo({
                view: 'exercise_solver',
                exerciseId: next.id
              });
            }}
          />
        )}

        {currentNav.view === 'document_viewer' && currentDoc && (
          <DocumentViewerWithAITutor
            document={currentDoc}
            courses={courses}
            onBack={handleBack}
            onDeleteDocument={handleDeleteDocument}
          />
        )}

        {currentNav.view === 'exam_simulation' && currentSubject && currentTopic && (
          <ExamSimulationView
            subject={currentSubject}
            topic={currentTopic}
            onExit={() => navigateTo({ view: 'topic_menu' })}
          />
        )}

        {currentNav.view === 'pomodoro' && (
          <PomodoroStudyView
            onBack={handleBack}
            onRecordStudyTime={(sec) => {
              // Time recorded
            }}
          />
        )}

        {currentNav.view === 'grades' && (
          <SubjectGradesView
            courses={courses}
            userId={currentUser?.id || 'guest'}
            onBack={handleBack}
          />
        )}

        {currentNav.view === 'profile' && (
          <UserProfileSettingsView
            user={
              currentUser || {
                id: 'guest',
                name: 'Estudiante ETSISI',
                email: 'alumno@alumnos.upm.es',
                studentId: 'bo0000',
                selectedCourseId: '1',
                avatarColor: '#4f46e5',
                createdAt: new Date().toISOString(),
                isRegistered: false,
                currentStreak: 1,
                longestStreak: 1
              }
            }
            totalSeconds={totalStudySeconds}
            completedExercisesCount={completedCount}
            inProgressCount={inProgressCount}
            examCount={exams.length}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
            onBack={handleBack}
          />
        )}

        {currentNav.view === 'custom_exam' && (
          <CustomMultiTopicExamView
            subjects={allFlattenedSubjects}
            onBack={handleBack}
          />
        )}

        {currentNav.view === 'ai_tutor_page' && (
          <AITutorDedicatedView
            subjects={allFlattenedSubjects}
            initialSubject={currentSubject}
            initialTopic={currentTopic}
            onBack={handleBack}
          />
        )}

        {currentNav.view === 'analytics' && (
          <StudyAnalyticsView
            subjects={allFlattenedSubjects}
            savedTimes={exerciseTimes}
            completedExercises={completedExercises}
            onSelectExercise={(subj, top, ex) => {
              navigateTo({
                view: 'exercise_solver',
                subjectId: subj.id,
                topicId: top.id,
                exerciseId: ex.id
              });
            }}
            onBack={handleBack}
          />
        )}

        {currentNav.view === 'exam_calendar' && (
          <ExamCalendarView
            courses={courses}
            exams={exams}
            onUpdateExams={handleUpdateExams}
            onBack={handleBack}
            onGoToStudyPlanner={(exam) => {
              navigateTo({
                view: 'study_planner',
                subjectId: exam.subjectId
              });
            }}
          />
        )}

        {currentNav.view === 'study_planner' && (
          <StudyPlannerView
            courses={courses}
            onBack={handleBack}
            onSelectTopicForStudy={(subjectId, topicId) => {
              navigateTo({
                view: 'topic_menu',
                subjectId,
                topicId
              });
            }}
          />
        )}

        {currentNav.view === 'study_groups' && (
          <StudyGroupsView
            courses={courses}
            currentUser={currentUser}
            onBack={handleBack}
            onOpenAITutor={() => navigateTo({ view: 'ai_tutor_page' })}
          />
        )}
      </main>

      {/* Upload Custom Notes & Documents Modal */}
      <UploadCustomNotesModal
        courses={courses}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSaveNewTopic={handleSaveNewTopic}
        onAddSubtopicsToExistingTopic={handleAddSubtopicsToExistingTopic}
        uploadedDocuments={uploadedDocuments}
        onSaveDocument={handleSaveDocument}
        onDeleteDocument={handleDeleteDocument}
        onOpenDocument={(doc) => {
          setIsUploadModalOpen(false);
          navigateTo({ view: 'document_viewer', documentId: doc.id });
        }}
      />

      {/* Student Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        currentUser={currentUser}
        onLogin={(profile) => {
          handleUpdateUser(profile);
          setIsAuthModalOpen(false);
        }}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Floating AI Tutor Chatbot Drawer */}
      <AITutorChat
        currentSubject={currentSubject}
        currentTopic={currentTopic}
      />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />
    </div>
  );
}
