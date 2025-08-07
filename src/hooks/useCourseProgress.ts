import { useState, useEffect, useCallback, useRef } from 'react';

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
  completedLessons: string[];
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
  const getTotalLessons = (courseId: string) => {
    switch (courseId) {
      case 'asistentes-virtuales-ia': return 21;
      case 'vibe-coding-claude-cursor': return 6;
      case 'videos-profesionales-ia': return 21;
      case 'mockup-cero': return 8;
      case 'monetiza-ia': return 8;
      case 'guiones-videos-promocionales-ia': return 24; // Actualizado según la base de datos
      default: return 18;
    }
  };

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
    totalLessons: getTotalLessons(courseId)
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const progressRef = useRef(progress);
  
  // Actualizar la referencia cuando cambia el progreso
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const loadProgress = useCallback(async () => {
    if (!isEnrolled) {
      setIsLoading(false);
      return;
    }

    // Solo resetear valores por defecto si es la primera carga
    if (!hasLoadedOnce) {
      setProgress(prev => ({
        ...prev,
        currentLesson: 0,
        completedLessons: [],
        progressPercentage: 0,
        status: 'NOT_STARTED',
        totalLessons: getTotalLessons(courseId)
      }));
    }

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
        const totalLessons = getTotalLessons(courseId);
        const maxLessonIndex = totalLessons - 1;
        const safeCurrentLesson = Math.min(data.currentLesson || 0, maxLessonIndex);
        
        setProgress({
          ...data,
          currentLesson: safeCurrentLesson,
          totalLessons: totalLessons
        });
        setHasLoadedOnce(true);
      } else {
        // Fallback a localStorage si la API falla (solo en cliente)
        if (typeof window !== 'undefined') {
          const localStorageKey = `course-progress-${courseId}`;
          const savedProgress = localStorage.getItem(localStorageKey);
          
          if (savedProgress) {
            const data = JSON.parse(savedProgress);
            
            // Asegurar que currentLesson no exceda el número de lecciones disponibles
            const totalLessons = getTotalLessons(courseId);
            const maxLessonIndex = totalLessons - 1;
            const safeCurrentLesson = Math.min(data.currentLesson || 0, maxLessonIndex);
            
            setProgress({
              ...data,
              currentLesson: safeCurrentLesson,
              totalLessons: totalLessons
            });
            setHasLoadedOnce(true);
          } else {
            // Si no hay progreso guardado, usar valores por defecto
            const totalLessonsDefault = getTotalLessons(courseId);
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
              totalLessons: totalLessonsDefault
            };
            setProgress(defaultProgress);
            setHasLoadedOnce(true);
          }
        }
      }
    } catch (error) {
      console.error('Error cargando progreso:', error);
      setError('Error al cargar el progreso');
    } finally {
      setIsLoading(false);
    }
  }, [courseId, isEnrolled, hasLoadedOnce]);

  const saveProgress = useCallback(async (
    currentLesson?: number, 
    completedLessons?: string[], 
    lessonNumber?: number,
    lessonTitle?: string,
    action?: 'access' | 'complete',
    timeSpent?: number
  ) => {
    if (!isEnrolled) return;

    try {
      // Usar el estado actual si no se proporcionan parámetros
      const currentProgress = progressRef.current;
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
            progressPercentage: isNaN(currentProgress.totalLessons) || currentProgress.totalLessons === 0 
              ? 0 
              : Math.round((lessonsToSave.length / currentProgress.totalLessons) * 100),
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
  }, [courseId, isEnrolled]);

  const markLessonComplete = useCallback((lessonId: string) => {
    setProgress(prev => {
      const newCompletedLessons = prev.completedLessons.includes(lessonId) 
        ? prev.completedLessons 
        : [...prev.completedLessons, lessonId];
      
      return {
        ...prev,
        completedLessons: newCompletedLessons,
        progressPercentage: isNaN(prev.totalLessons) || prev.totalLessons === 0 
          ? 0 
          : Math.round((newCompletedLessons.length / prev.totalLessons) * 100),
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

  const progressPercentage = (() => {
    const value = progress.progressPercentage;
    if (typeof value === 'number' && !isNaN(value)) {
      return value;
    }
    return 0;
  })();

  useEffect(() => {
    if (!hasLoadedOnce) {
      if (isEnrolled) {
        loadProgress();
      } else {
        // Si no está inscrito, establecer isLoading en false inmediatamente
        setIsLoading(false);
        setHasLoadedOnce(true);
      }
    }
  }, [courseId, isEnrolled, hasLoadedOnce, loadProgress]);

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