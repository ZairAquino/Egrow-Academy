import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface EnrollmentData {
  courseId: string;
  userId: string;
}

interface UseCourseEnrollmentReturn {
  enrollInCourse: (courseId: string) => Promise<boolean>;
  isEnrolled: (courseId: string) => boolean;
  isLoading: boolean;
  error: string | null;
}

export function useCourseEnrollment(): UseCourseEnrollmentReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const enrollInCourse = async (courseId: string): Promise<boolean> => {
    if (!user) {
      setError('Debes iniciar sesión para inscribirte al curso');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al inscribirse al curso');
      }

      const data = await response.json();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const isEnrolled = (courseId: string): boolean => {
    // Por ahora retornamos false, pero esto se puede mejorar
    // consultando las inscripciones del usuario desde el contexto
    return false;
  };

  return {
    enrollInCourse,
    isEnrolled,
    isLoading,
    error,
  };
} 