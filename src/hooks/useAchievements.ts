import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAchievements as useAchievementNotifications } from '@/components/ui/AchievementNotification';

interface Achievement {
  id: string;
  userId: string;
  type: 'lesson_completed' | 'course_completed' | 'streak' | 'milestone' | 'certificate' | 'first_course';
  title: string;
  description: string;
  points: number;
  badge?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

interface ProgressData {
  userId: string;
  courseId?: string;
  lessonsCompleted: number;
  totalLessons: number;
  percentage: number;
  streak: number;
  totalPoints: number;
  achievements: Achievement[];
}

export const useAchievements = () => {
  const { user } = useAuth();
  const { addAchievement } = useAchievementNotifications();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar logros y progreso
  const loadAchievements = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await fetch('/api/achievements?includeProgress=true');
      const data = await response.json();

      if (response.ok) {
        setAchievements(data.achievements || []);
        setProgress(data.progress || null);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Registrar acción del usuario
  const recordAction = useCallback(async (action: string, metadata?: Record<string, any>) => {
    if (!user?.id) return;

    try {
      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, metadata }),
      });

      const data = await response.json();

      if (response.ok && data.achievements?.length > 0) {
        // Mostrar notificaciones de logros
        data.achievements.forEach((achievement: Achievement) => {
          addAchievement({
            type: achievement.type,
            title: achievement.title,
            description: achievement.description,
            color: getAchievementColor(achievement.type),
            points: achievement.points,
            badge: achievement.badge,
          });
        });

        // Recargar logros
        await loadAchievements();
      }

      return data;
    } catch (error) {
      console.error('Error recording action:', error);
      return null;
    }
  }, [user?.id, addAchievement, loadAchievements]);

  // Completar lección
  const completeLesson = useCallback(async (lessonId: string, courseId?: string) => {
    return await recordAction('complete_lesson', {
      lessonId,
      courseId,
      timestamp: new Date().toISOString(),
    });
  }, [recordAction]);

  // Completar curso
  const completeCourse = useCallback(async (courseId: string) => {
    return await recordAction('complete_course', {
      courseId,
      timestamp: new Date().toISOString(),
    });
  }, [recordAction]);

  // Registrar actividad diaria
  const recordDailyActivity = useCallback(async () => {
    return await recordAction('daily_activity', {
      timestamp: new Date().toISOString(),
    });
  }, [recordAction]);

  // Cargar datos al montar el componente
  useEffect(() => {
    if (user?.id) {
      loadAchievements();
    }
  }, [user?.id, loadAchievements]);

  return {
    achievements,
    progress,
    loading,
    recordAction,
    completeLesson,
    completeCourse,
    recordDailyActivity,
    loadAchievements,
  };
};

// Función auxiliar para obtener color del logro
const getAchievementColor = (type: Achievement['type']) => {
  switch (type) {
    case 'lesson_completed':
      return 'bg-green-500';
    case 'course_completed':
      return 'bg-yellow-500';
    case 'streak':
      return 'bg-blue-500';
    case 'milestone':
      return 'bg-purple-500';
    case 'certificate':
      return 'bg-orange-500';
    case 'first_course':
      return 'bg-pink-500';
    default:
      return 'bg-green-500';
  }
}; 