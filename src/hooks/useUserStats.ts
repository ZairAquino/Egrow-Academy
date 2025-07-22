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
  const [stats, setStats] = useState<UserStats | null>({
    totalEnrolled: 0,
    completedCourses: 0,
    certificates: 0,
    totalHoursLearned: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Debounce para evitar llamadas excesivas
    const timeoutId = setTimeout(async () => {
      const loadUserStats = async () => {
        if (status !== 'authenticated' || !user) {
          setIsLoading(false);
          setStats({
            totalEnrolled: 0,
            completedCourses: 0,
            certificates: 0,
            totalHoursLearned: 0
          });
          return;
        }

        // Evitar llamadas si ya tenemos stats y el usuario no ha cambiado
        if (stats && stats.totalEnrolled > 0 && user) {
          setIsLoading(false);
          return;
        }

      try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('/api/courses/user-courses', {
          headers,
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          
          // Validar que data existe y tiene la estructura esperada
          if (!data) {
            setStats({
              totalEnrolled: 0,
              completedCourses: 0,
              certificates: 0,
              totalHoursLearned: 0
            });
            return;
          }
          
          // Calcular estadísticas basadas en los cursos del usuario
          const totalEnrolled = data.total || 0;
          const courses = data.courses || [];
          const completedCourses = courses.filter((course: any) => 
            course?.progress?.progressPercentage === 100
          ).length || 0;
          
          // Transformar las estadísticas al formato esperado
          setStats({
            totalEnrolled: totalEnrolled,
            completedCourses: completedCourses,
            certificates: completedCourses, // Un certificado por curso completado
            totalHoursLearned: totalEnrolled * 2 // Estimación: 2 horas por curso
          });
        } else {
          setError('Error al cargar estadísticas');
        }
      } catch (error) {
        console.error('Error loading user stats:', error);
        setError('Error de conexión');
        // Establecer stats por defecto en caso de error
        setStats({
          totalEnrolled: 0,
          completedCourses: 0,
          certificates: 0,
          totalHoursLearned: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserStats();
    }, 500); // 500ms de debounce

    return () => clearTimeout(timeoutId);
  }, [user, status, stats]);

  return {
    stats,
    isLoading,
    error
  };
} 