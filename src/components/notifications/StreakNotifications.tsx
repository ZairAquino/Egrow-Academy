'use client';

import { useState, useEffect } from 'react';
import { StreakBadgeLevel } from '@prisma/client';
import { getBadgeEmoji, getBadgeName } from '@/hooks/useStreaks';

interface StreakNotification {
  id: string;
  type: 'goal_completed' | 'streak_milestone' | 'new_badge' | 'motivation' | 'reminder';
  title: string;
  message: string;
  emoji: string;
  duration?: number;
  actionText?: string;
  onAction?: () => void;
}

interface StreakNotificationsProps {
  className?: string;
}

// Almacén global de notificaciones de rachas
let notificationQueue: StreakNotification[] = [];
let notificationListeners: ((notifications: StreakNotification[]) => void)[] = [];

export const addStreakNotification = (notification: Omit<StreakNotification, 'id'>) => {
  const newNotification: StreakNotification = {
    ...notification,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    duration: notification.duration || 5000
  };
  
  notificationQueue.push(newNotification);
  notificationListeners.forEach(listener => listener([...notificationQueue]));
  
  // Auto-remover después de la duración especificada
  if (newNotification.duration) {
    setTimeout(() => {
      removeStreakNotification(newNotification.id);
    }, newNotification.duration);
  }
};

export const removeStreakNotification = (id: string) => {
  notificationQueue = notificationQueue.filter(n => n.id !== id);
  notificationListeners.forEach(listener => listener([...notificationQueue]));
};

// Funciones de utilidad para crear notificaciones específicas
export const showGoalCompletedNotification = (weekNumber: number, points: number) => {
  addStreakNotification({
    type: 'goal_completed',
    title: '🎉 ¡Meta Semanal Completada!',
    message: `¡Excelente! Has completado tu meta de 5 lecciones esta semana y ganaste ${points} puntos.`,
    emoji: '🏆',
    duration: 8000,
    actionText: 'Ver Progreso'
  });
};

export const showStreakMilestoneNotification = (streak: number) => {
  const milestones = {
    1: { emoji: '🌱', message: '¡Primera racha semanal!' },
    4: { emoji: '🎯', message: '¡Un mes de constancia!' },
    8: { emoji: '🔥', message: '¡Dos meses en racha!' },
    12: { emoji: '⚡', message: '¡Tres meses increíbles!' },
    24: { emoji: '👑', message: '¡Medio año de dedicación!' },
    52: { emoji: '🚀', message: '¡Un año completo! ¡Eres una leyenda!' }
  };
  
  const milestone = milestones[streak as keyof typeof milestones];
  if (milestone) {
    addStreakNotification({
      type: 'streak_milestone',
      title: `${milestone.emoji} ¡${streak} Semanas en Racha!`,
      message: milestone.message,
      emoji: milestone.emoji,
      duration: 10000,
      actionText: 'Compartir Logro'
    });
  }
};

export const showNewBadgeNotification = (badge: StreakBadgeLevel, streak: number) => {
  addStreakNotification({
    type: 'new_badge',
    title: `${getBadgeEmoji(badge)} ¡Nuevo Badge Desbloqueado!`,
    message: `¡Felicidades! Has alcanzado el nivel "${getBadgeName(badge)}" con ${streak} semanas en racha.`,
    emoji: getBadgeEmoji(badge),
    duration: 10000,
    actionText: 'Ver Badges'
  });
};

export const showMotivationNotification = (lessonsCompleted: number) => {
  const motivationalMessages = [
    { lessons: 1, message: '¡Excelente inicio! 🌟 Cada lección cuenta hacia tu meta.', emoji: '🌟' },
    { lessons: 2, message: '¡Vas por buen camino! 🚀 Solo 3 lecciones más para completar la meta.', emoji: '🚀' },
    { lessons: 3, message: '¡Más de la mitad! 💪 Te faltan solo 2 lecciones para la meta semanal.', emoji: '💪' },
    { lessons: 4, message: '¡Casi lo logras! 🔥 Solo una lección más para completar tu racha.', emoji: '🔥' }
  ];
  
  const motivation = motivationalMessages.find(m => m.lessons === lessonsCompleted);
  if (motivation) {
    addStreakNotification({
      type: 'motivation',
      title: 'Progreso Semanal',
      message: motivation.message,
      emoji: motivation.emoji,
      duration: 4000
    });
  }
};

export const showWeeklyReminderNotification = (lessonsLeft: number, daysLeft: number) => {
  if (lessonsLeft > 0 && daysLeft <= 2) {
    addStreakNotification({
      type: 'reminder',
      title: '⏰ Recordatorio de Meta',
      message: `Te faltan ${lessonsLeft} lecciones para completar tu meta semanal. ¡Solo quedan ${daysLeft} días!`,
      emoji: '⏰',
      duration: 6000,
      actionText: 'Continuar Aprendiendo'
    });
  }
};

export default function StreakNotifications({ className = '' }: StreakNotificationsProps) {
  const [notifications, setNotifications] = useState<StreakNotification[]>([]);

  useEffect(() => {
    // Suscribirse a las notificaciones
    const handleNotifications = (newNotifications: StreakNotification[]) => {
      setNotifications(newNotifications);
    };
    
    notificationListeners.push(handleNotifications);
    setNotifications([...notificationQueue]);
    
    return () => {
      notificationListeners = notificationListeners.filter(listener => listener !== handleNotifications);
    };
  }, []);

  const handleClose = (id: string) => {
    removeStreakNotification(id);
  };

  const handleAction = (notification: StreakNotification) => {
    if (notification.onAction) {
      notification.onAction();
    }
    handleClose(notification.id);
  };

  if (notifications.length === 0) return null;

  return (
    <div className={`streak-notifications ${className}`}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`streak-notification streak-notification-${notification.type}`}
        >
          <div className="notification-header">
            <span className="notification-emoji">{notification.emoji}</span>
            <h3 className="notification-title">{notification.title}</h3>
            <button
              className="notification-close"
              onClick={() => handleClose(notification.id)}
              aria-label="Cerrar notificación"
            >
              ×
            </button>
          </div>
          
          <p className="notification-message">{notification.message}</p>
          
          {notification.actionText && (
            <div className="notification-actions">
              <button
                className="notification-action-btn"
                onClick={() => handleAction(notification)}
              >
                {notification.actionText}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}