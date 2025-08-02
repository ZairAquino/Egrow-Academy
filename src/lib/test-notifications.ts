/**
 * Funciones de prueba para las notificaciones de rachas
 * Estas funciones pueden ser llamadas desde la consola del navegador para probar las notificaciones
 */

import { 
  showGoalCompletedNotification, 
  showStreakMilestoneNotification, 
  showNewBadgeNotification, 
  showMotivationNotification,
  showWeeklyReminderNotification
} from '@/components/notifications/StreakNotifications';

// Hacer las funciones accesibles globalmente para pruebas
declare global {
  interface Window {
    testStreakNotifications: {
      motivation: (lessons: number) => void;
      goalCompleted: (points: number) => void;
      milestone: (streak: number) => void;
      newBadge: (level: string, streak: number) => void;
      reminder: (lessonsLeft: number, daysLeft: number) => void;
      testAll: () => void;
    };
  }
}

export function initializeTestNotifications() {
  if (typeof window !== 'undefined') {
    window.testStreakNotifications = {
      
      // Probar notificación motivacional
      motivation: (lessons: number = 2) => {
        console.log(`🧪 Probando notificación motivacional para ${lessons} lecciones`);
        showMotivationNotification(lessons);
      },

      // Probar notificación de meta completada
      goalCompleted: (points: number = 10) => {
        console.log(`🧪 Probando notificación de meta completada con ${points} puntos`);
        showGoalCompletedNotification(1, points);
      },

      // Probar notificación de milestone de racha
      milestone: (streak: number = 4) => {
        console.log(`🧪 Probando notificación de milestone para ${streak} semanas`);
        showStreakMilestoneNotification(streak);
      },

      // Probar notificación de nuevo badge
      newBadge: (level: string = 'DEDICADO', streak: number = 4) => {
        console.log(`🧪 Probando notificación de nuevo badge: ${level}`);
        showNewBadgeNotification(level as any, streak);
      },

      // Probar notificación de recordatorio
      reminder: (lessonsLeft: number = 2, daysLeft: number = 1) => {
        console.log(`🧪 Probando recordatorio: ${lessonsLeft} lecciones, ${daysLeft} días`);
        showWeeklyReminderNotification(lessonsLeft, daysLeft);
      },

      // Probar todas las notificaciones en secuencia
      testAll: () => {
        console.log('🧪 Probando todas las notificaciones de rachas...');
        
        // Secuencia de pruebas con delays
        setTimeout(() => {
          showMotivationNotification(1);
        }, 500);

        setTimeout(() => {
          showMotivationNotification(3);
        }, 2000);

        setTimeout(() => {
          showGoalCompletedNotification(1, 10);
        }, 4000);

        setTimeout(() => {
          showStreakMilestoneNotification(1);
        }, 6000);

        setTimeout(() => {
          showNewBadgeNotification('PRINCIPIANTE' as any, 1);
        }, 8000);

        setTimeout(() => {
          showStreakMilestoneNotification(4);
        }, 10000);

        setTimeout(() => {
          showNewBadgeNotification('DEDICADO' as any, 4);
        }, 12000);

        setTimeout(() => {
          showWeeklyReminderNotification(2, 1);
        }, 14000);

        console.log('✅ Todas las notificaciones programadas. Observa la esquina superior derecha.');
      }
    };

    console.log('🎯 Funciones de prueba de notificaciones cargadas!');
    console.log('Usa en la consola:');
    console.log('• testStreakNotifications.motivation(2) - Probar motivación');
    console.log('• testStreakNotifications.goalCompleted(10) - Probar meta completada');
    console.log('• testStreakNotifications.milestone(4) - Probar milestone');
    console.log('• testStreakNotifications.newBadge("DEDICADO", 4) - Probar nuevo badge');
    console.log('• testStreakNotifications.reminder(2, 1) - Probar recordatorio');
    console.log('• testStreakNotifications.testAll() - Probar todas en secuencia');
  }
}

// Inicializar automáticamente en desarrollo
if (process.env.NODE_ENV === 'development') {
  initializeTestNotifications();
}