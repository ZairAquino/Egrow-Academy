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
          if (!data || !data.courses) {
            setStats({
              totalEnrolled: 0,
              completedCourses: 0,
              certificates: 0,
              totalHoursLearned: 0
            });
            return;
          }
          
          const courses = data.courses || [];
          
          // Calcular estadísticas reales basadas en los datos de la BD
          const totalEnrolled = courses.length;
          const completedCourses = courses.filter((course: any) => 
            course?.progressPercentage === 100 || course?.status === 'COMPLETED'
          ).length;
          
          // Calcular horas totales basadas en los cursos inscritos
          const totalHoursLearned = courses.reduce((total: number, course: any) => {
            const courseHours = course.course?.durationHours || 0;
            const progressPercentage = course.progressPercentage || 0;
            // Solo contar las horas completadas
            return total + (courseHours * progressPercentage / 100);
          }, 0);
          
          // Un certificado por curso completado
          const certificates = completedCourses;
          
          console.log('📊 [USER-STATS] Calculando estadísticas:', {
            totalEnrolled,
            completedCourses,
            totalHoursLearned: Math.round(totalHoursLearned),
            certificates
          });
          
          setStats({
            totalEnrolled,
            completedCourses,
            certificates,
            totalHoursLearned: Math.round(totalHoursLearned)
          });
        } else {
          console.error('❌ [USER-STATS] Error en respuesta:', response.status);
          setError('Error al cargar estadísticas');
          setStats({
            totalEnrolled: 0,
            completedCourses: 0,
            certificates: 0,
            totalHoursLearned: 0
          });
        }
      } catch (error) {
        console.error('❌ [USER-STATS] Error loading user stats:', error);
        setError('Error de conexión');
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

    // Cargar stats inmediatamente cuando el usuario cambie
    loadUserStats();
  }, [user, status]); // Dependencias: user y status

  return {
    stats,
    isLoading,
    error
  };
} 