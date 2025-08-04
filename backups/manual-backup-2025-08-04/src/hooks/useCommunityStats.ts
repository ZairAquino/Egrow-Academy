import { useState, useEffect } from 'react';

export interface CommunityStats {
  activeMembers: number;
  countriesCount: number;
  totalInteractions: number;
  premiumMembers: number;
  breakdown: {
    likes: number;
    comments: number;
    replies: number;
  };
}

export function useCommunityStats() {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/community/stats', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al cargar las estadísticas');
      }

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      } else {
        throw new Error(data.error || 'Error al cargar las estadísticas');
      }
    } catch (err) {
      console.error('Error al obtener estadísticas de la comunidad:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
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
} 