import { useState, useEffect } from 'react';
import { StreakBadgeLevel } from '@prisma/client';

export interface StreakStats {
  currentWeekLessons: number;
  weekProgress: string;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  goalMet: boolean;
  badges: Array<{
    id: string;
    badgeLevel: StreakBadgeLevel;
    earnedAt: string;
    streakWhenEarned: number;
  }>;
  currentBadge: {
    id: string;
    badgeLevel: StreakBadgeLevel;
    earnedAt: string;
    streakWhenEarned: number;
  } | null;
  recoveryCost: number;
  canRecover: boolean;
}

export const useStreaks = () => {
  const [stats, setStats] = useState<StreakStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener token del localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      
      const response = await fetch('/api/streaks', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.ok) {
        const result = await response.json();
        setStats(result.data);
      } else if (response.status === 401) {
        // Usuario no autenticado, no es un error crítico
        setStats(null);
      } else {
        throw new Error('Failed to fetch streak stats');
      }
    } catch (err) {
      console.error('Error fetching streak stats:', err);
      setError('Error al cargar estadísticas de rachas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

// Utilidades para mostrar badges
export const getBadgeEmoji = (level: StreakBadgeLevel): string => {
  const emojiMap: { [key in StreakBadgeLevel]: string } = {
    PRINCIPIANTE: '🌱',
    ESTUDIANTE: '📚',
    DEDICADO: '🎯',
    EN_LLAMAS: '🔥',
    IMPARABLE: '⚡',
    MAESTRO: '👑',
    LEYENDA: '🚀'
  };
  return emojiMap[level] || '🏆';
};

export const getBadgeName = (level: StreakBadgeLevel): string => {
  const nameMap: { [key in StreakBadgeLevel]: string } = {
    PRINCIPIANTE: 'Principiante',
    ESTUDIANTE: 'Estudiante',
    DEDICADO: 'Dedicado',
    EN_LLAMAS: 'En Llamas',
    IMPARABLE: 'Imparable',
    MAESTRO: 'Maestro',
    LEYENDA: 'Leyenda'
  };
  return nameMap[level] || 'Badge';
};

export const getStreakEmoji = (streak: number): string => {
  if (streak >= 52) return '🚀'; // 1 año
  if (streak >= 24) return '👑'; // 6 meses
  if (streak >= 12) return '⚡'; // 3 meses
  if (streak >= 8) return '🔥';  // 2 meses
  if (streak >= 4) return '🎯';  // 1 mes
  if (streak >= 2) return '📚';  // 2 semanas
  if (streak >= 1) return '🌱';  // 1 semana
  return '💤'; // Sin racha
};