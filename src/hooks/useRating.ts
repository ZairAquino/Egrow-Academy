import { useState, useEffect } from 'react';

interface RatingStats {
  totalRatings: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface Rating {
  id: string;
  rating: number;
  comment?: string;
  type: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

interface UseRatingReturn {
  ratings: Rating[];
  stats: RatingStats | null;
  loading: boolean;
  error: string | null;
  submitRating: (rating: number, comment?: string) => Promise<void>;
  fetchRatings: () => Promise<void>;
}

export const useRating = (
  type: 'COURSE_COMPLETION' | 'COMMUNITY_POST' | 'COURSE_COMMENT',
  courseId?: string,
  postId?: string
): UseRatingReturn => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRatings = async () => {
    if (!courseId && !postId) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        type,
        ...(courseId && { courseId }),
        ...(postId && { postId })
      });

      const response = await fetch(`/api/ratings?${params}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar valoraciones');
      }

      const data = await response.json();
      setRatings(data.ratings);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (rating: number, comment?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment,
          type,
          courseId,
          postId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar valoración');
      }

      // Recargar las valoraciones después de enviar una nueva
      await fetchRatings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [type, courseId, postId]);

  return {
    ratings,
    stats,
    loading,
    error,
    submitRating,
    fetchRatings
  };
}; 