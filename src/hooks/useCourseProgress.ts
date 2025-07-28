import { useState, useEffect, useCallback } from 'react';

interface LessonProgress {
  id: string;
  lessonNumber: number;
  lessonTitle: string;
  isCompleted: boolean;
  completedAt?: string;
  timeSpent: number;
  firstAccessed: string;
  lastAccessed: string;
  accessCount: number;
  completionAttempts: number;
  userNotes?: string;
  lessonSpecificData?: any;
}

interface CourseProgress {
  currentLesson: number;
  completedLessons: number[];
  progressPercentage: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'ABANDONED';
  totalTimeSpent: number;
  totalSessions: number;
  averageSessionTime: number;
  longestSession: number;
  startedAt: string;
  lastAccessed: string;
  completedAt?: string;
  lessonProgress: LessonProgress[];
  courseSpecificData?: any;
  totalLessons: number;
}

export const useCourseProgress = (courseId: string, isEnrolled: boolean) => {
  const [progress, setProgress] = useState<CourseProgress>({
    currentLesson: 0,
    completedLessons: [],
    progressPercentage: 0,
    status: 'NOT_STARTED' as const,
    totalTimeSpent: 0,
    totalSessions: 0,
    averageSessionTime: 0,
    longestSession: 0,
    startedAt: '2024-01-01T00:00:00.000Z',
    lastAccessed: '2024-01-01T00:00:00.000Z',
    lessonProgress: [],
    totalLessons: 5
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProgress = useCallback(async () => {
    if (!isEnrolled) {
      setIsLoading(false);
      return;
    }

    // Asegurar que el progreso tenga valores válidos por defecto
    setProgress(prev => ({
      ...prev,
      currentLesson: 0,
      completedLessons: [],
      progressPercentage: 0,
      status: 'NOT_STARTED',
      totalLessons: 5
    }));

    try {
      // Obtener token del localStorage solo en el cliente
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      
      const response = await fetch(`/api/courses/progress?courseId=${courseId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Asegurar que currentLesson no exceda el número de lecciones disponibles
        const maxLessonIndex = 4; // 5 lecciones (índices 0-4)
        const safeCurrentLesson = Math.min(data.currentLesson || 0, maxLessonIndex);
        
        setProgress({
          ...data,
          currentLesson: safeCurrentLesson,
          totalLessons: 5
        });
      } else {
        // Fallback a localStorage si la API falla (solo en cliente)
        if (typeof window !== 'undefined') {
          const localStorageKey = `course-progress-${courseId}`;
          const savedProgress = localStorage.getItem(localStorageKey);
          
          if (savedProgress) {
            const data = JSON.parse(savedProgress);
            
            // Asegurar que currentLesson no exceda el número de lecciones disponibles
            const maxLessonIndex = 4; // 5 lecciones (índices 0-4)
            const safeCurrentLesson = Math.min(data.currentLesson || 0, maxLessonIndex);
            
            setProgress({
              ...data,
              currentLesson: safeCurrentLesson,
              totalLessons: 5
            });
          } else {
            // Si no hay progreso guardado, usar valores por defecto
            const defaultProgress: CourseProgress = {
              currentLesson: 0,
              completedLessons: [],
              progressPercentage: 0,
              status: 'NOT_STARTED',
              totalTimeSpent: 0,
              totalSessions: 0,
              averageSessionTime: 0,
              longestSession: 0,
              startedAt: new Date().toISOString(),
              lastAccessed: new Date().toISOString(),
              lessonProgress: [],
              totalLessons: 10
            };
            setProgress(defaultProgress);
          }
        }
      }
    } catch (error) {
      console.error('Error cargando progreso:', error);
      setError('Error al cargar el progreso');
    } finally {
      setIsLoading(false);
    }
  }, [courseId, isEnrolled]);

  const saveProgress = useCallback(async (
    currentLesson?: number, 
    completedLessons?: number[], 
    lessonNumber?: number,
    lessonTitle?: string,
    action?: 'access' | 'complete',
    timeSpent?: number
  ) => {
    if (!isEnrolled) return;

    try {
      // Usar el estado actual si no se proporcionan parámetros
      const currentProgress = progress;
      const lessonToSave = currentLesson ?? currentProgress.currentLesson;
      const lessonsToSave = completedLessons ?? currentProgress.completedLessons;
      
      // Obtener token del localStorage solo en el cliente
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      
      const response = await fetch('/api/courses/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          courseId,
          currentLesson: lessonToSave,
          completedLessons: lessonsToSave,
          lessonNumber,
          lessonTitle,
          action,
          timeSpent
        })
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(prev => ({
          ...prev,
          ...data.progress
        }));
      } else {
        // Fallback a localStorage si la API falla (solo en cliente)
        if (typeof window !== 'undefined') {
          const localStorageKey = `course-progress-${courseId}`;
          const progressData: CourseProgress = {
            currentLesson: lessonToSave,
            completedLessons: lessonsToSave,
            progressPercentage: Math.round((lessonsToSave.length / currentProgress.totalLessons) * 100),
            status: lessonsToSave.length === 0 ? 'NOT_STARTED' : 
                    lessonsToSave.length === currentProgress.totalLessons ? 'COMPLETED' : 'IN_PROGRESS',
            totalTimeSpent: currentProgress.totalTimeSpent,
            totalSessions: currentProgress.totalSessions,
            averageSessionTime: currentProgress.averageSessionTime,
            longestSession: currentProgress.longestSession,
            startedAt: currentProgress.startedAt,
            lastAccessed: new Date().toISOString(),
            lessonProgress: currentProgress.lessonProgress,
            totalLessons: currentProgress.totalLessons
          };
          
          localStorage.setItem(localStorageKey, JSON.stringify(progressData));
          setProgress(progressData);
        }
      }
    } catch (error) {
      console.error('Error guardando progreso:', error);
      setError('Error al guardar el progreso');
    }
  }, [courseId, isEnrolled, progress]);

  const markLessonComplete = useCallback((lessonId: number) => {
    setProgress(prev => {
      const newCompletedLessons = prev.completedLessons.includes(lessonId) 
        ? prev.completedLessons 
        : [...prev.completedLessons, lessonId];
      
      return {
        ...prev,
        completedLessons: newCompletedLessons,
        progressPercentage: Math.round((newCompletedLessons.length / prev.totalLessons) * 100),
        status: newCompletedLessons.length === 0 ? 'NOT_STARTED' : 
                newCompletedLessons.length === prev.totalLessons ? 'COMPLETED' : 'IN_PROGRESS'
      };
    });
  }, []);

  const setCurrentLesson = useCallback((lessonIndex: number) => {
    setProgress(prev => {
      return {
        ...prev,
        currentLesson: lessonIndex
      };
    });
  }, []);

  const progressPercentage = progress.progressPercentage;

  useEffect(() => {
    loadProgress();
  }, [courseId, isEnrolled]); // Removido loadProgress de las dependencias

  return {
    progress,
    isLoading,
    error,
    progressPercentage,
    saveProgress,
    markLessonComplete,
    setCurrentLesson,
    loadProgress
  };
}; 