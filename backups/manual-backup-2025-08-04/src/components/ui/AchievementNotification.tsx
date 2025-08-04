'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Star, Trophy, Target, BookOpen, Award } from 'lucide-react';

interface Achievement {
  id: string;
  type: 'lesson_completed' | 'course_completed' | 'streak' | 'milestone' | 'certificate' | 'first_course';
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  points?: number;
  badge?: string;
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const getAchievementIcon = (type: Achievement['type']) => {
  switch (type) {
    case 'lesson_completed':
      return <CheckCircle className="w-6 h-6" />;
    case 'course_completed':
      return <Trophy className="w-6 h-6" />;
    case 'streak':
      return <Star className="w-6 h-6" />;
    case 'milestone':
      return <Target className="w-6 h-6" />;
    case 'certificate':
      return <Award className="w-6 h-6" />;
    case 'first_course':
      return <BookOpen className="w-6 h-6" />;
    default:
      return <CheckCircle className="w-6 h-6" />;
  }
};

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

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-4 right-4 z-50 max-w-sm w-full"
        >
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header con color dinámico */}
            <div className={`${getAchievementColor(achievement.type)} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {achievement.icon}
                  <div>
                    <h3 className="font-bold text-lg">{achievement.title}</h3>
                    <p className="text-sm opacity-90">{achievement.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                  }}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido adicional */}
            {(achievement.points || achievement.badge) && (
              <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  {achievement.points && (
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">
                        +{achievement.points} puntos
                      </span>
                    </div>
                  )}
                  {achievement.badge && (
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {achievement.badge}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Barra de progreso para auto-close */}
            {autoClose && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook para gestionar logros
export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const addAchievement = (achievement: Omit<Achievement, 'id'>) => {
    const newAchievement: Achievement = {
      ...achievement,
      id: Date.now().toString(),
      icon: getAchievementIcon(achievement.type),
    };

    setAchievements(prev => [...prev, newAchievement]);

    // Reproducir sonido de logro (opcional)
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sounds/achievement.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignorar errores si el archivo no existe
      });
    }
  };

  const removeAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
  };

  return { achievements, addAchievement, removeAchievement };
}; 