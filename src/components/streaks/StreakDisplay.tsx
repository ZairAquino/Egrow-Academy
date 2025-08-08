'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface StreakStats {
  currentWeekLessons: number;
  weekProgress: string;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  goalMet: boolean;
  badges: Array<{
    id: string;
    badgeLevel: string;
    earnedAt: string;
    streakWhenEarned: number;
  }>;
  currentBadge: {
    id: string;
    badgeLevel: string;
    earnedAt: string;
    streakWhenEarned: number;
  } | null;
  recoveryCost: number;
  canRecover: boolean;
}

interface BadgeCustomization {
  preferredBadgeStyle: 'emoji' | 'text' | 'colorful';
  badgeColor: string;
  showBadgeInNavbar: boolean;
  preferredEmojis: {
    [key: string]: string;
  };
}

interface StreakDisplayProps {
  compact?: boolean;
}

export default function StreakDisplay({ compact = false }: StreakDisplayProps) {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState<StreakStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [badgeCustomization, setBadgeCustomization] = useState<BadgeCustomization | null>(null);


  const fetchBadgeCustomization = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await fetch('/api/profile/badge-customization', {
        credentials: 'include', // Incluir cookies automáticamente
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.badgeCustomization) {
          setBadgeCustomization(data.badgeCustomization);
          console.log('✅ [STREAKS] Badge customization loaded:', data.badgeCustomization);
        }
      }
    } catch (err) {
      console.warn('⚠️ [STREAKS] Error fetching badge customization:', err);
    }
  };

  const fetchStreakStats = async () => {
    console.log('📊 [STREAKS] fetchStreakStats llamado - isAuthenticated:', isAuthenticated, 'user:', !!user);
    
    if (!isAuthenticated) {
      console.log('❌ [STREAKS] No autenticado, saliendo...');
      return;
    }
    
    try {
      console.log('🔄 [STREAKS] Iniciando fetch...');
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/streaks', {
        credentials: 'include', // Incluir cookies automáticamente
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('📡 [STREAKS] Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ [STREAKS] Datos recibidos:', data);
        setStats(data.data);
        setLastUpdate(new Date());
        console.log('✅ [STREAKS] Estadísticas actualizadas:', data.data);
      } else if (response.status === 401) {
        console.warn('⚠️ [STREAKS] Unauthorized, checking auth status...');
        // Don't show error immediately, give auth context a chance to refresh
        setTimeout(() => {
          if (!isAuthenticated) {
            setError('Sesión expirada');
          }
        }, 2000);
      } else {
        console.error('❌ [STREAKS] Error fetching stats:', response.status);
        setError('Error al cargar estadísticas');
      }
    } catch (err) {
      console.error('❌ [STREAKS] Error:', err);
      setError('Error de conexión');
    } finally {
      console.log('🏁 [STREAKS] Fetch completado, setLoading(false)');
      setLoading(false);
    }
  };

  // Cargar estadísticas y preferencias al montar el componente
  useEffect(() => {
    console.log('🔍 [STREAKS] useEffect disparado - isAuthenticated:', isAuthenticated, 'user:', !!user);
    if (isAuthenticated && user) {
      console.log('🚀 [STREAKS] Iniciando carga de estadísticas...');
      setError(null); // Clear any previous errors
      fetchStreakStats();
      fetchBadgeCustomization();
    } else {
      console.log('⚠️ [STREAKS] No autenticado o sin usuario - saltando carga');
    }
  }, [isAuthenticated, user]);

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      fetchStreakStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Escuchar eventos de lección completada
  useEffect(() => {
    const handleLessonCompleted = () => {
      console.log('🏆 [STREAKS] Lección completada detectada, actualizando...');
      setTimeout(() => {
        fetchStreakStats();
      }, 2000); // Esperar 2 segundos para que se procese en el backend
    };

    // Múltiples métodos para detectar lección completada
    window.addEventListener('lessonCompleted', handleLessonCompleted);
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lessonCompleted') {
        handleLessonCompleted();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Función global para trigger manual
    (window as any).refreshStreaks = () => {
      fetchStreakStats();
      fetchBadgeCustomization();
    };

    return () => {
      window.removeEventListener('lessonCompleted', handleLessonCompleted);
      window.removeEventListener('storage', handleStorageChange);
      delete (window as any).refreshStreaks;
    };
  }, []);

  console.log('🖥️ [STREAKS] Renderizando - isAuthenticated:', isAuthenticated, 'loading:', loading, 'error:', error, 'stats:', !!stats);

  if (!isAuthenticated) {
    console.log('❌ [STREAKS] No autenticado, no renderizando');
    return null;
  }

  if (loading && !stats) {
    console.log('⏳ [STREAKS] Mostrando loading...');
    return (
      <div className="streak-display-loading">
        <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
      </div>
    );
  }

  if (error) {
    console.log('❌ [STREAKS] Mostrando error:', error);
    return (
      <div className="streak-display-error">
        <button 
          onClick={fetchStreakStats}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Error: {error} - Reintentar
        </button>
      </div>
    );
  }

  if (!stats) {
    console.log('📭 [STREAKS] Mostrando "Cargando rachas..." - loading:', loading, 'error:', error);
    return (
      <div className="streak-display-empty">
        <div className="text-gray-500 text-sm">Cargando rachas...</div>
      </div>
    );
  }

  console.log('✅ [STREAKS] Mostrando componente completo con stats:', stats);

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 52) return '🚀'; // 1 año
    if (streak >= 24) return '👑'; // 6 meses
    if (streak >= 12) return '⚡'; // 3 meses
    if (streak >= 8) return '🔥';  // 2 meses
    if (streak >= 4) return '🎯';  // 1 mes
    if (streak >= 2) return '📚';  // 2 semanas
    if (streak >= 1) return '🌱';  // 1 semana
    return '💤'; // Sin racha
  };

  const getBadgeEmoji = (level: string): string => {
    // Use user's custom emojis if available
    if (badgeCustomization?.preferredEmojis?.[level]) {
      return badgeCustomization.preferredEmojis[level];
    }
    
    // Fall back to default emojis
    const emojiMap: { [key: string]: string } = {
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

  return (
    <div className={`streak-display bg-white rounded-lg shadow-md border border-gray-200 ${compact ? 'p-2' : 'p-4'}`}>
      <div className={`flex items-center justify-between ${compact ? 'mb-2' : 'mb-3'}`}>
        <h3 className={`${compact ? 'text-sm' : 'text-lg'} font-semibold text-gray-800 flex items-center`}>
          <span className="mr-2">🏆</span>
          {compact ? 'Rachas' : 'Sistema de Rachas'}
        </h3>
        <button 
          onClick={() => {
            fetchStreakStats();
            fetchBadgeCustomization();
          }}
          className="text-blue-500 hover:text-blue-700 text-sm"
          title="Actualizar"
        >
          🔄
        </button>
      </div>

      {/* Progreso Semanal */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progreso Semanal</span>
          <span className="text-sm text-gray-500">{stats.weekProgress}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              stats.goalMet ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min((stats.currentWeekLessons / 5) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>5 lecciones</span>
        </div>
      </div>

      {/* Racha Actual */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Racha Actual</span>
          <span className="text-lg font-bold text-blue-600 flex items-center">
            {getStreakEmoji(stats.currentStreak)} {stats.currentStreak} {stats.currentStreak === 1 ? 'semana' : 'semanas'}
          </span>
        </div>
        {stats.currentStreak > 0 && (
          <div className="text-xs text-green-600 mt-1">
            ¡Excelente! Mantén tu racha
          </div>
        )}
      </div>

      {/* Badge Actual */}
      {stats.currentBadge && (
        <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{getBadgeEmoji(stats.currentBadge.badgeLevel)}</span>
            <div>
              <div className="font-medium text-gray-800">{stats.currentBadge.badgeLevel}</div>
              <div className="text-xs text-gray-500">
                Ganado con {stats.currentBadge.streakWhenEarned} semanas
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Puntos */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Puntos Totales</span>
          <span className="text-lg font-bold text-purple-600">⭐ {stats.totalPoints}</span>
        </div>
      </div>

      {/* Información de Debug */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
          <div>Debug Info:</div>
          <div>• Última actualización: {lastUpdate?.toLocaleTimeString()}</div>
          <div>• Lecciones esta semana: {stats.currentWeekLessons}</div>
          <div>• Racha más larga: {stats.longestStreak}</div>
          <div>• Meta cumplida: {stats.goalMet ? 'Sí' : 'No'}</div>
        </div>
      )}

      {/* Botón de recuperación si es necesario */}
      {stats.canRecover && (
        <button className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white text-sm py-2 px-4 rounded transition-colors">
          🔄 Recuperar Racha ({stats.recoveryCost} puntos)
        </button>
      )}
    </div>
  );
}