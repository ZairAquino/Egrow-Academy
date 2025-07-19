import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserStats {
  totalEnrolled: number;
  completedCourses: number;
  inProgressCourses: number;
  freeCourses: number;
  premiumCourses: number;
  certificates: number;
  totalHoursLearned: number;
  averageProgress: number;
}

interface UseUserStatsReturn {
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  refreshStats: () => void;
}

export function useUserStats(): UseUserStatsReturn {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchStats = async () => {
    if (!user) {
      setStats(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Incluir cookies
      });

      if (!response.ok) {
        // Si hay error de autenticación o servidor, usar datos por defecto
        console.warn('Error obteniendo estadísticas, usando datos por defecto:', response.status);
        setStats({
          totalEnrolled: 1, // El curso de LLMs
          completedCourses: 0,
          inProgressCourses: 1,
          freeCourses: 1,
          premiumCourses: 0,
          certificates: 0,
          totalHoursLearned: 2,
          averageProgress: 0
        });
        return;
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.warn('Error en fetch de estadísticas, usando datos por defecto:', err);
      // Datos por defecto para desarrollo
      setStats({
        totalEnrolled: 1, // El curso de LLMs
        completedCourses: 0,
        inProgressCourses: 1,
        freeCourses: 1,
        premiumCourses: 0,
        certificates: 0,
        totalHoursLearned: 2,
        averageProgress: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const refreshStats = () => {
    fetchStats();
  };

  return {
    stats,
    isLoading,
    error,
    refreshStats,
  };
} 