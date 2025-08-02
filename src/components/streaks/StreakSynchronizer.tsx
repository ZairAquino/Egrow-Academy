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
  const { stats, triggerRefresh } = useStreaks();
  const previousStatsRef = useRef(stats);

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

  // Interceptar llamadas a la API de progreso para disparar actualizaciones
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async function(...args) {
      const result = await originalFetch.apply(this, args);
      
      // Interceptar llamadas a la API de progreso
      const url = args[0] as string;
      if (typeof url === 'string' && url.includes('/api/courses/progress')) {
        const method = args[1]?.method;
        
        if (method === 'POST') {
          try {
            const requestBody = args[1]?.body;
            if (typeof requestBody === 'string') {
              const data = JSON.parse(requestBody);
              
              // Si se completó una lección
              if (data.action === 'complete') {
                console.log('🏆 [STREAKS] Lección completada detectada, actualizando rachas...');
                
                // Disparar actualización después de un breve delay
                setTimeout(() => {
                  triggerRefresh();
                  
                  // También disparar evento para otros componentes
                  window.dispatchEvent(new CustomEvent('lessonCompleted', {
                    detail: {
                      courseId: data.courseId,
                      lessonNumber: data.lessonNumber,
                      lessonTitle: data.lessonTitle
                    }
                  }));
                }, 800);
              }
            }
          } catch (error) {
            console.error('Error processing lesson completion:', error);
          }
        }
      }
      
      return result;
    };

    // Cleanup
    return () => {
      window.fetch = originalFetch;
    };
  }, [triggerRefresh]);

  // Escuchar eventos personalizados de lección completada
  useEffect(() => {
    const handleLessonCompleted = (event: CustomEvent) => {
      console.log('📚 [STREAKS] Evento de lección completada recibido:', event.detail);
      
      // Refrescar estadísticas
      setTimeout(() => {
        triggerRefresh();
      }, 1000);
    };

    window.addEventListener('lessonCompleted', handleLessonCompleted as EventListener);
    
    return () => {
      window.removeEventListener('lessonCompleted', handleLessonCompleted as EventListener);
    };
  }, [triggerRefresh]);

  // Este componente no renderiza nada visible
  return null;
}