/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NavState, CourseId, SemesterId, Subject, Topic, SubTopic, Exercise, Course } from './types';
import { allCourses as defaultCourses } from './data/allCourses';
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
import { UploadCustomNotesModal } from './components/UploadCustomNotesModal';
import { AITutorChat } from './components/AITutorChat';
import { useSwipeGesture } from './hooks/useSwipeGesture';

export default function App() {
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
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Dynamic courses state with custom uploaded notes and topics
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('etsisi_custom_courses');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return defaultCourses;
  });

  // Save custom courses whenever modified
  useEffect(() => {
    try {
      localStorage.setItem('etsisi_custom_courses', JSON.stringify(courses));
    } catch {
      // ignore
    }
  }, [courses]);

  // Navigation stack state
  const [navHistory, setNavHistory] = useState<NavState[]>([
    {
      view: 'welcome',
      courseId: null,
      semesterId: null,
      subjectId: null,
      topicId: null,
      subtopicId: null,
      exerciseId: null
    }
  ]);

  const currentNav = navHistory[navHistory.length - 1];

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

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

  // Save progress to localStorage
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

  // Push new navigation state
  const navigateTo = useCallback((nextState: Partial<NavState>) => {
    setNavHistory((prev) => {
      const current = prev[prev.length - 1];
      const updated: NavState = {
        ...current,
        ...nextState
      };
      return [...prev, updated];
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Back navigation (button or swipe)
  const handleBack = useCallback(() => {
    setNavHistory((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, prev.length - 1);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Return directly to the main welcome screen ("Ingeniería de computadores")
  const handleGoHome = useCallback(() => {
    setNavHistory([
      {
        view: 'welcome',
        courseId: null,
        semesterId: null,
        subjectId: null,
        topicId: null,
        subtopicId: null,
        exerciseId: null
      }
    ]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Touch swipe gesture for iPhone and iPad
  useSwipeGesture({
    onSwipeBack: handleBack,
    enabled: currentNav.view !== 'welcome' && currentNav.view !== 'courses'
  });

  // Find active subject, topic, subtopic and exercise
  let currentSubject: Subject | null = null;
  if (currentNav.subjectId) {
    for (const c of courses) {
      for (const sem of c.semesters) {
        const found = sem.subjects.find((s) => s.id === currentNav.subjectId);
        if (found) {
          currentSubject = found;
          break;
        }
      }
      if (currentSubject) break;
    }
  }

  const currentTopic = currentSubject?.topics.find((t) => t.id === currentNav.topicId) || null;
  const currentSubtopic = currentTopic?.subtopics.find((st) => st.id === currentNav.subtopicId) || null;
  const currentExercise = currentTopic?.exercises.find((e) => e.id === currentNav.exerciseId) || null;

  // Next exercise in topic for sequential flow
  let nextExercise: Exercise | null = null;
  if (currentTopic && currentExercise) {
    const idx = currentTopic.exercises.findIndex((e) => e.id === currentExercise.id);
    if (idx !== -1 && idx < currentTopic.exercises.length - 1) {
      nextExercise = currentTopic.exercises[idx + 1];
    }
  }

  // Timer callbacks
  const handleSaveExerciseTime = useCallback((exerciseId: string, seconds: number) => {
    setExerciseTimes((prev) => ({ ...prev, [exerciseId]: seconds }));
  }, []);

  const handleCompleteExercise = useCallback((exerciseId: string, seconds: number) => {
    setExerciseTimes((prev) => ({ ...prev, [exerciseId]: seconds }));
    setCompletedExercises((prev) => ({ ...prev, [exerciseId]: true }));
  }, []);

  // Handler for adding a new topic from user uploaded notes
  const handleSaveNewTopic = useCallback((
    courseId: CourseId,
    semesterId: SemesterId,
    subjectId: string,
    newTopic: Topic
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
                  topics: [...subj.topics, newTopic]
                };
              })
            };
          })
        };
      });
    });

    // Navigate to the newly created topic immediately!
    navigateTo({
      view: 'topic_menu',
      courseId,
      semesterId,
      subjectId,
      topicId: newTopic.id
    });
  }, [navigateTo]);

  // Handler for adding subtopics to an existing topic
  const handleAddSubtopicsToExistingTopic = useCallback((
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
                  topics: subj.topics.map((top) => {
                    if (top.id !== topicId) return top;
                    return {
                      ...top,
                      subtopics: [...top.subtopics, ...newSubtopics],
                      exercises: [...top.exercises, ...newExercises]
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
  }, [navigateTo]);

  // Flatten all subjects for analytics view
  const allFlattenedSubjects = useMemo(() => {
    const list: Subject[] = [];
    courses.forEach((c) => {
      c.semesters.forEach((s) => {
        s.subjects.forEach((subj) => {
          if (subj.topics.length > 0) {
            list.push(subj);
          }
        });
      });
    });
    return list;
  }, [courses]);

  // RENDER BASED ON CURRENT VIEW
  if (currentNav.view === 'welcome') {
    return (
      <WelcomeScreen
        onContinue={() => {
          navigateTo({
            view: 'courses',
            courseId: '1',
            semesterId: '1'
          });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Universal Header with theme toggle & principal menu */}
      <Header
        nav={currentNav}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onBack={handleBack}
        onGoHome={handleGoHome}
        onOpenAnalytics={() => navigateTo({ view: 'analytics' })}
        onOpenUploadNotes={() => setIsUploadModalOpen(true)}
        subjectTitle={currentSubject?.name}
        topicTitle={currentTopic?.title}
        exerciseTitle={currentExercise?.title}
      />

      {/* Main Content Router */}
      <main className="flex-1 pb-16">
        {currentNav.view === 'courses' && (
          <CourseSelector
            courses={courses}
            selectedCourseId={currentNav.courseId}
            selectedSemesterId={currentNav.semesterId}
            onSelectSubject={(cId, sId, subject) => {
              navigateTo({
                view: 'subject',
                courseId: cId,
                semesterId: sId,
                subjectId: subject.id,
                topicId: null
              });
            }}
          />
        )}

        {currentNav.view === 'subject' && currentSubject && (
          <SubjectView
            subject={currentSubject}
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
                exercises: 'exercises_list',
                exam: 'exam_simulation'
              };
              navigateTo({
                view: viewMap[action],
                topicId: topic.id
              });
            }}
          />
        )}

        {currentNav.view === 'topic_menu' && currentSubject && currentTopic && (
          <TopicMenu
            subject={currentSubject}
            topic={currentTopic}
            onOpenMindMap={() => navigateTo({ view: 'mind_map' })}
            onOpenSummary={() => navigateTo({ view: 'summary' })}
            onOpenExplanation={(st) => navigateTo({ view: 'explanation', subtopicId: st ? st.id : null })}
            onOpenExercises={() => navigateTo({ view: 'exercises_list' })}
            onOpenExam={() => navigateTo({ view: 'exam_simulation' })}
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

        {currentNav.view === 'exam_simulation' && currentSubject && currentTopic && (
          <ExamSimulationView
            subject={currentSubject}
            topic={currentTopic}
            onExit={() => navigateTo({ view: 'topic_menu' })}
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
      </main>

      {/* Upload Custom Notes & Topics Modal */}
      <UploadCustomNotesModal
        courses={courses}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSaveNewTopic={handleSaveNewTopic}
        onAddSubtopicsToExistingTopic={handleAddSubtopicsToExistingTopic}
      />

      {/* Floating AI Tutor Chat (Gemini 3.8 Flash multi-turn) */}
      <AITutorChat
        currentSubject={currentSubject}
        currentTopic={currentTopic}
      />
    </div>
  );
}
