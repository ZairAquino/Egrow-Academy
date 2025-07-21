import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserStats {
  totalEnrolled: number;
  completedCourses: number;
  certificates: number;
  totalHoursLearned: number;
}

export function useUserStats() {
  const { user, status } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserStats = async () => {
      if (status !== 'authenticated' || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/courses/user-courses', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          const apiStats = data.stats;
          
          // Transformar las estadísticas de la API al formato esperado
          setStats({
            totalEnrolled: apiStats.total || 0,
            completedCourses: apiStats.completed || 0,
            certificates: apiStats.certificates || 0,
            totalHoursLearned: apiStats.total * 2 // Estimación: 2 horas por curso
          });
        } else {
          setError('Error al cargar estadísticas');
        }
      } catch (error) {
        console.error('Error loading user stats:', error);
        setError('Error de conexión');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserStats();
  }, [user, status]);

  return {
    stats,
    isLoading,
    error
  };
} 