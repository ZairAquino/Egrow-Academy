/**
 * Sistema de notificaciones y sincronización de rachas
 * Se encarga de detectar cambios en el progreso y mostrar notificaciones apropiadas
 */

import { 
  showGoalCompletedNotification, 
  showStreakMilestoneNotification, 
  showNewBadgeNotification, 
  showMotivationNotification 
} from '@/components/notifications/StreakNotifications';

// Tipos para el sistema de notificaciones
export interface StreakProgress {
  currentWeekLessons: number;
  totalPoints: number;
  currentStreak: number;
  goalMet: boolean;
  newBadgeEarned?: {
    level: string;
    streak: number;
  };
}

// Estado anterior para comparar cambios
let previousState: StreakProgress | null = null;

/**
 * Procesa las notificaciones basadas en el cambio de estado de rachas
 */
export function processStreakNotifications(
  newState: StreakProgress,
  lessonJustCompleted: boolean = false
) {
  // Si no hay estado anterior, guardar el actual y salir
  if (!previousState) {
    previousState = { ...newState };
    return;
  }

  // Detectar si se completó una nueva lección
  if (lessonJustCompleted && newState.currentWeekLessons > previousState.currentWeekLessons) {
    const lessonsCompleted = newState.currentWeekLessons;
    
    // Mostrar mensaje motivacional apropiado
    if (lessonsCompleted < 5) {
      showMotivationNotification(lessonsCompleted);
    }
  }

  // Detectar si se completó la meta semanal (de no completada a completada)
  if (!previousState.goalMet && newState.goalMet) {
    const pointsEarned = newState.totalPoints - previousState.totalPoints;
    showGoalCompletedNotification(1, pointsEarned);
  }

  // Detectar nuevo milestone de racha
  if (newState.currentStreak > previousState.currentStreak) {
    const streakCount = newState.currentStreak;
    
    // Solo mostrar notificaciones en milestones importantes
    const milestones = [1, 4, 8, 12, 24, 52];
    if (milestones.includes(streakCount)) {
      showStreakMilestoneNotification(streakCount);
    }
  }

  // Detectar nuevo badge
  if (newState.newBadgeEarned) {
    showNewBadgeNotification(
      newState.newBadgeEarned.level as any, 
      newState.newBadgeEarned.streak
    );
  }

  // Actualizar estado anterior
  previousState = { ...newState };
}

/**
 * Hook personalizado para manejar notificaciones de rachas
 */
export function useStreakNotifications() {
  
  const triggerLessonCompleted = async () => {
    try {
      // Obtener estadísticas actualizadas
      const response = await fetch('/api/streaks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const newState: StreakProgress = {
          currentWeekLessons: result.data.currentWeekLessons,
          totalPoints: result.data.totalPoints,
          currentStreak: result.data.currentStreak,
          goalMet: result.data.goalMet,
        };
        
        // Procesar notificaciones
        processStreakNotifications(newState, true);
        
        return newState;
      }
    } catch (error) {
      console.error('Error fetching streak stats for notifications:', error);
    }
    
    return null;
  };

  const resetState = () => {
    previousState = null;
  };

  return {
    triggerLessonCompleted,
    resetState
  };
}

/**
 * Inyectar el sistema de notificaciones en las funciones de progreso
 */
export function injectStreakNotifications() {
  // Escuchar eventos de lección completada
  if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;
    
    window.fetch = async function(...args) {
      const result = await originalFetch.apply(this, args);
      
      // Interceptar llamadas a la API de progreso de curso
      const url = args[0] as string;
      if (url.includes('/api/courses/progress') && args[1]?.method === 'POST') {
        try {
          const requestBody = args[1].body;
          if (typeof requestBody === 'string') {
            const data = JSON.parse(requestBody);
            
            // Si se completó una lección
            if (data.action === 'complete') {
              // Esperar un poco para que se procese en el backend
              setTimeout(async () => {
                const { triggerLessonCompleted } = useStreakNotifications();
                await triggerLessonCompleted();
              }, 500);
            }
          }
        } catch (error) {
          console.error('Error processing lesson completion for notifications:', error);
        }
      }
      
      return result;
    };
  }
}

/**
 * Función para refrescar manualmente las estadísticas y mostrar notificaciones si hay cambios
 */
export async function refreshAndNotify(): Promise<StreakProgress | null> {
  try {
    const response = await fetch('/api/streaks', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      const newState: StreakProgress = {
        currentWeekLessons: result.data.currentWeekLessons,
        totalPoints: result.data.totalPoints,
        currentStreak: result.data.currentStreak,
        goalMet: result.data.goalMet,
      };
      
      processStreakNotifications(newState, false);
      return newState;
    }
  } catch (error) {
    console.error('Error refreshing streak stats:', error);
  }
  
  return null;
}