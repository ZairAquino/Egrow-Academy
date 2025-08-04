'use client';

import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface TrackingData {
  action: 'view_course' | 'enroll_course' | 'complete_lesson' | 'search' | 'download_resource' | 'view_resource' | 'rate_course' | 'share_course' | 'click_recommendation';
  targetId?: string;
  targetType?: 'course' | 'lesson' | 'resource' | 'search_query';
  metadata?: Record<string, any>;
}

export const useBehaviorTracking = () => {
  const { user } = useAuth();
  const router = useRouter();

  const trackBehavior = useCallback(async (data: TrackingData) => {
    if (!user?.id) return;

    try {
      await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...data,
        }),
      });
    } catch (error) {
      console.error('Error tracking behavior:', error);
    }
  }, [user?.id]);

  // Tracking automático de navegación
  useEffect(() => {
    if (!user?.id) return;

    const handleRouteChange = (url: string) => {
      // Detectar tipo de página y trackear
      if (url.includes('/curso/')) {
        const courseSlug = url.split('/curso/')[1];
        trackBehavior({
          action: 'view_course',
          targetId: courseSlug,
          targetType: 'course',
          metadata: { url, timestamp: new Date().toISOString() },
        });
      } else if (url.includes('/resources/')) {
        const resourceSlug = url.split('/resources/')[1];
        trackBehavior({
          action: 'view_resource',
          targetId: resourceSlug,
          targetType: 'resource',
          metadata: { url, timestamp: new Date().toISOString() },
        });
      }
    };

    // Trackear página actual al cargar
    handleRouteChange(window.location.pathname);

    // Escuchar cambios de ruta
    router.events?.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events?.off('routeChangeComplete', handleRouteChange);
    };
  }, [user?.id, router, trackBehavior]);

  return { trackBehavior };
}; 