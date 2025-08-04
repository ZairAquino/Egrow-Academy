import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseLessonVideoProps {
  lessonId: string;
  initialVideoUrl?: string;
}

interface UseLessonVideoReturn {
  videoUrl: string | null;
  isUpdating: boolean;
  error: string | null;
  updateVideo: (videoUrl: string) => Promise<void>;
  removeVideo: () => Promise<void>;
}

export function useLessonVideo({ lessonId, initialVideoUrl }: UseLessonVideoProps): UseLessonVideoReturn {
  const [videoUrl, setVideoUrl] = useState<string | null>(initialVideoUrl || null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const updateVideo = useCallback(async (newVideoUrl: string) => {
    if (!token) {
      setError('No tienes permisos para actualizar esta lección');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/lessons/${lessonId}/video`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ videoUrl: newVideoUrl })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el video');
      }

      const data = await response.json();
      setVideoUrl(data.lesson.videoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsUpdating(false);
    }
  }, [lessonId, token]);

  const removeVideo = useCallback(async () => {
    if (!token) {
      setError('No tienes permisos para eliminar el video de esta lección');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/lessons/${lessonId}/video`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el video');
      }

      setVideoUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsUpdating(false);
    }
  }, [lessonId, token]);

  return {
    videoUrl,
    isUpdating,
    error,
    updateVideo,
    removeVideo
  };
} 