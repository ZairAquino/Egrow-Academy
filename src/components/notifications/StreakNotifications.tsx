'use client';

import { useState, useEffect } from 'react';
import { StreakBadgeLevel } from '@prisma/client';
import { getBadgeEmoji, getBadgeName } from '@/hooks/useStreaks';
import { 
  IconTrophy, 
  IconSeedling, 
  IconTarget, 
  IconFlame, 
  IconBolt, 
  IconCrown, 
  IconRocket, 
  IconStar, 
  IconMuscle, 
  IconClock,
  IconBook,
  IconMoon
} from '@tabler/icons-react';

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
    title: '¡Meta Semanal Completada!',
    message: `¡Excelente! Has completado tu meta de 5 lecciones esta semana y ganaste ${points} puntos.`,
    emoji: 'trophy',
    duration: 8000,
    actionText: 'Ver Progreso'
  });
};

export const showStreakMilestoneNotification = (streak: number) => {
  const milestones = {
    1: { emoji: 'seedling', message: '¡Primera racha semanal!' },
    4: { emoji: 'target', message: '¡Un mes de constancia!' },
    8: { emoji: 'flame', message: '¡Dos meses en racha!' },
    12: { emoji: 'bolt', message: '¡Tres meses increíbles!' },
    24: { emoji: 'crown', message: '¡Medio año de dedicación!' },
    52: { emoji: 'rocket', message: '¡Un año completo! ¡Eres una leyenda!' }
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
    { lessons: 1, message: '¡Excelente inicio! Cada lección cuenta hacia tu meta.', emoji: 'star' },
    { lessons: 2, message: '¡Vas por buen camino! Solo 3 lecciones más para completar la meta.', emoji: 'rocket' },
    { lessons: 3, message: '¡Más de la mitad! Te faltan solo 2 lecciones para la meta semanal.', emoji: 'muscle' },
    { lessons: 4, message: '¡Casi lo logras! Solo una lección más para completar tu racha.', emoji: 'flame' }
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
      title: 'Recordatorio de Meta',
      message: `Te faltan ${lessonsLeft} lecciones para completar tu meta semanal. ¡Solo quedan ${daysLeft} días!`,
      emoji: 'clock',
      duration: 6000,
      actionText: 'Continuar Aprendiendo'
    });
  }
};

export default function StreakNotifications({ className = '' }: StreakNotificationsProps) {
  const [notifications, setNotifications] = useState<StreakNotification[]>([]);

  const renderIcon = (emojiString: string) => {
    switch (emojiString) {
      case 'trophy':
        return <IconTrophy size={24} color="#fbbf24" />;
      case 'seedling':
        return <IconSeedling size={24} color="#10b981" />;
      case 'target':
        return <IconTarget size={24} color="#3b82f6" />;
      case 'flame':
        return <IconFlame size={24} color="#ef4444" />;
      case 'bolt':
        return <IconBolt size={24} color="#f59e0b" />;
      case 'crown':
        return <IconCrown size={24} color="#8b5cf6" />;
      case 'rocket':
        return <IconRocket size={24} color="#06b6d4" />;
      case 'star':
        return <IconStar size={24} color="#fbbf24" />;
      case 'muscle':
        return <IconMuscle size={24} color="#ec4899" />;
      case 'clock':
        return <IconClock size={24} color="#6b7280" />;
      case 'book':
        return <IconBook size={24} color="#3b82f6" />;
      case 'moon':
        return <IconMoon size={24} color="#6b7280" />;
      default:
        return <span className="notification-emoji">{emojiString}</span>;
    }
  };

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
            <span className="notification-emoji">{renderIcon(notification.emoji)}</span>
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