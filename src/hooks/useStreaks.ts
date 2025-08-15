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
  const [lastRefresh, setLastRefresh] = useState(Date.now());

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
        setLastRefresh(Date.now());
      } else if (response.status === 401) {
        // Usuario no autenticado, no es un error crítico
        setStats(null);
      } else {
        // Log error details but don't throw
        console.warn(`Failed to fetch streak stats: ${response.status} ${response.statusText}`);
        setStats(null);
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

  // Auto-refresh cuando se detectan cambios en el localStorage (señal de lección completada)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lessonCompleted') {
        // Esperar un poco para que se procese en el backend
        setTimeout(() => {
          fetchStats();
        }, 1000);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Función para marcar que se completó una lección (trigger manual)
  const triggerRefresh = () => {
    localStorage.setItem('lessonCompleted', Date.now().toString());
    setTimeout(() => {
      fetchStats();
    }, 500);
  };

  return {
    stats,
    loading,
    error,
    lastRefresh,
    refetch: fetchStats,
    triggerRefresh
  };
};

// Utilidades para mostrar badges
export const getBadgeEmoji = (level: StreakBadgeLevel): string => {
  const emojiMap: { [key in StreakBadgeLevel]: string } = {
    PRINCIPIANTE: 'seedling',
    ESTUDIANTE: 'book',
    DEDICADO: 'target',
    EN_LLAMAS: 'flame',
    IMPARABLE: 'bolt',
    MAESTRO: 'crown',
    LEYENDA: 'rocket'
  };
  return emojiMap[level] || 'trophy';
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
  if (streak >= 52) return 'rocket'; // 1 año
  if (streak >= 24) return 'crown'; // 6 meses
  if (streak >= 12) return 'bolt'; // 3 meses
  if (streak >= 8) return 'flame';  // 2 meses
  if (streak >= 4) return 'target';  // 1 mes
  if (streak >= 2) return 'book';  // 2 semanas
  if (streak >= 1) return 'seedling';  // 1 semana
  return 'moon'; // Sin racha
};