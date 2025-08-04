'use client';

import { useEffect, useRef } from 'react';
import { useStreaks } from '@/hooks/useStreaks';
import { 
  showGoalCompletedNotification, 
  showStreakMilestoneNotification, 
  showNewBadgeNotification, 
  showMotivationNotification 
} from '@/components/notifications/StreakNotifications';

/**
 * Componente que sincroniza las rachas y muestra notificaciones automáticamente
 * Se debe incluir en el layout principal para funcionar en toda la aplicación
 */
export default function StreakSynchronizer() {
  const { stats, refetch } = useStreaks();
  const previousStatsRef = useRef(stats);
  const refetchRef = useRef(refetch);
  
  // Actualizar la ref cuando cambie refetch
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  useEffect(() => {
    const previousStats = previousStatsRef.current;
    
    if (!previousStats || !stats) {
      previousStatsRef.current = stats;
      return;
    }

    // Detectar si se completó una nueva lección
    if (stats.currentWeekLessons > previousStats.currentWeekLessons) {
      const lessonsCompleted = stats.currentWeekLessons;
      
      // Mostrar mensaje motivacional según el progreso
      if (lessonsCompleted === 1) {
        showMotivationNotification(1);
      } else if (lessonsCompleted === 2) {
        showMotivationNotification(2);
      } else if (lessonsCompleted === 3) {
        showMotivationNotification(3);
      } else if (lessonsCompleted === 4) {
        showMotivationNotification(4);
      }
    }

    // Detectar si se completó la meta semanal
    if (!previousStats.goalMet && stats.goalMet) {
      const pointsEarned = stats.totalPoints - previousStats.totalPoints;
      showGoalCompletedNotification(1, pointsEarned);
    }

    // Detectar nuevo milestone de racha
    if (stats.currentStreak > previousStats.currentStreak) {
      const streakCount = stats.currentStreak;
      
      // Milestones importantes para notificaciones
      const milestones = [1, 4, 8, 12, 24, 52];
      if (milestones.includes(streakCount)) {
        showStreakMilestoneNotification(streakCount);
      }
    }

    // Detectar nuevos badges (comparar cantidad de badges)
    if (stats.badges.length > previousStats.badges.length) {
      const newBadges = stats.badges.filter(badge => 
        !previousStats.badges.some(prevBadge => prevBadge.id === badge.id)
      );
      
      newBadges.forEach(badge => {
        showNewBadgeNotification(badge.badgeLevel, badge.streakWhenEarned);
      });
    }

    // Actualizar referencia
    previousStatsRef.current = stats;
  }, [stats]);

  // Configurar interceptor global para detectar lecciones completadas
  useEffect(() => {
    // Función global para notificar completación de lecciones
    const globalLessonCompletedHandler = () => {
      console.log('🏆 [STREAKS] Lección completada detectada, actualizando rachas...');
      setTimeout(() => {
        if (refetchRef.current) {
          refetchRef.current();
        }
      }, 1000);
    };

    // Hacer la función accesible globalmente
    (window as any).notifyLessonCompleted = globalLessonCompletedHandler;

    // Escuchar cambios en localStorage (signal de lección completada)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lessonCompleted') {
        globalLessonCompletedHandler();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      delete (window as any).notifyLessonCompleted;
    };
  }, []);

  // Escuchar eventos personalizados de lección completada
  useEffect(() => {
    const handleLessonCompleted = (event: CustomEvent) => {
      console.log('📚 [STREAKS] Evento de lección completada recibido:', event.detail);
      
      // Refrescar estadísticas
      setTimeout(() => {
        refetch();
      }, 1000);
    };

    window.addEventListener('lessonCompleted', handleLessonCompleted as EventListener);
    
    return () => {
      window.removeEventListener('lessonCompleted', handleLessonCompleted as EventListener);
    };
  }, [refetch]);

  // Este componente no renderiza nada visible
  return null;
}