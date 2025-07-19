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
    status: 'NOT_STARTED',
    totalTimeSpent: 0,
    totalSessions: 0,
    averageSessionTime: 0,
    longestSession: 0,
    startedAt: new Date().toISOString(),
    lastAccessed: new Date().toISOString(),
    lessonProgress: [],
    totalLessons: 10
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProgress = useCallback(async () => {
    console.log('🔍 [DEBUG] loadProgress llamado con isEnrolled:', isEnrolled);
    
    if (!isEnrolled) {
      console.log('🔍 [DEBUG] No está inscrito, no cargando progreso');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔍 [DEBUG] Haciendo fetch a la API...');
      const response = await fetch(`/api/courses/progress?courseId=${courseId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 [DEBUG] Datos recibidos de la API:', data);
        setProgress(data);
      } else {
        // Fallback a localStorage si la API falla
        const localStorageKey = `course-progress-${courseId}`;
        const savedProgress = localStorage.getItem(localStorageKey);
        
        if (savedProgress) {
          const data = JSON.parse(savedProgress);
          setProgress(data);
        } else {
          // Si no hay progreso guardado, usar valores por defecto
          setProgress({
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
          });
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
    currentLesson: number, 
    completedLessons: number[], 
    lessonNumber?: number,
    lessonTitle?: string,
    action?: 'access' | 'complete',
    timeSpent?: number
  ) => {
    if (!isEnrolled) return;

    try {
      const response = await fetch('/api/courses/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          currentLesson,
          completedLessons,
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
        // Fallback a localStorage si la API falla
        const localStorageKey = `course-progress-${courseId}`;
        const progressData = {
          currentLesson,
          completedLessons,
          progressPercentage: Math.round((completedLessons.length / 10) * 100),
          status: completedLessons.length === 0 ? 'NOT_STARTED' : 
                  completedLessons.length === 10 ? 'COMPLETED' : 'IN_PROGRESS',
          totalTimeSpent: 0,
          totalSessions: 0,
          averageSessionTime: 0,
          longestSession: 0,
          startedAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString(),
          lessonProgress: [],
          totalLessons: 10
        };
        
        localStorage.setItem(localStorageKey, JSON.stringify(progressData));
        setProgress(progressData);
      }
    } catch (error) {
      console.error('Error guardando progreso:', error);
      setError('Error al guardar el progreso');
    }
  }, [courseId, isEnrolled]);

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
    console.log('🔍 [DEBUG] setCurrentLesson llamado con lessonIndex:', lessonIndex);
    setProgress(prev => {
      console.log('🔍 [DEBUG] Estado anterior:', prev.currentLesson, 'Nuevo estado:', lessonIndex);
      return {
        ...prev,
        currentLesson: lessonIndex
      };
    });
  }, []);

  const progressPercentage = progress.progressPercentage;

  useEffect(() => {
    console.log('🔍 [DEBUG] useEffect ejecutado con courseId:', courseId, 'isEnrolled:', isEnrolled);
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