'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { trackPromotionEvent, trackPromotionFunnel } from '@/lib/analytics';

interface Promotion {
  id: string;
  type: 'PREMIUM_SUBSCRIPTION' | 'NEW_COURSE' | 'SPECIAL_OFFER';
  title: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl?: string;
}

interface PromotionInteraction {
  action: 'impression' | 'click' | 'close' | 'conversion';
  sessionId?: string;
  pageUrl?: string;
  referrer?: string;
  userAgent?: string;
}

export function usePromotions() {
  const [activePromotion, setActivePromotion] = useState<Promotion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Manejar el caso cuando no hay contexto de autenticación
  let user = null;
  try {
    const authContext = useAuth();
    user = authContext.user;
  } catch (error) {
    // Si no hay AuthProvider, continuar sin usuario
    console.log('No AuthProvider found, continuing without user context');
  }

  // Generar sessionId único
  const sessionId = typeof window !== 'undefined' 
    ? sessionStorage.getItem('promotion_session_id') || 
      (() => {
        const id = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('promotion_session_id', id);
        return id;
      })()
    : null;

  // Verificar si el usuario ya cerró el banner en esta sesión
  const hasClosedBanner = typeof window !== 'undefined' 
    ? sessionStorage.getItem('banner_closed') === 'true'
    : false;

  // Verificar si el banner ya apareció hoy
  const hasShownToday = typeof window !== 'undefined' 
    ? (() => {
        const today = new Date().toDateString();
        const lastShown = sessionStorage.getItem('banner_last_shown');
        return lastShown === today;
      })()
    : false;

  // Verificar si el usuario es nuevo (primer acceso)
  const isNewUser = typeof window !== 'undefined' 
    ? !sessionStorage.getItem('banner_has_shown')
    : false;

  useEffect(() => {
    const fetchActivePromotion = async () => {
      try {
        const response = await fetch('/api/promotions/active');
        if (response.ok) {
          const data = await response.json();
          
          // Filtrar promociones según el usuario
          let filteredPromotions = data.promotions;
          
          if (user?.membershipLevel === 'PREMIUM') {
            // Usuarios premium solo ven promociones de nuevos cursos
            filteredPromotions = filteredPromotions.filter(
              (p: Promotion) => p.type === 'NEW_COURSE'
            );
          } else {
            // Usuarios no premium ven todas las promociones
            filteredPromotions = filteredPromotions.filter(
              (p: Promotion) => p.type === 'PREMIUM_SUBSCRIPTION' || p.type === 'NEW_COURSE'
            );
          }

          // Ordenar por prioridad (mayor primero)
          filteredPromotions.sort((a: Promotion, b: Promotion) => 
            (b as any).priority - (a as any).priority
          );

          // Mostrar banner si:
          // 1. Hay promociones disponibles
          // 2. No se cerró en esta sesión O es un usuario nuevo O no se mostró hoy
          if (filteredPromotions.length > 0 && 
              (!hasClosedBanner || isNewUser || !hasShownToday)) {
            setActivePromotion(filteredPromotions[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching promotions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivePromotion();
  }, [user, hasClosedBanner, hasShownToday, isNewUser]);

  const trackInteraction = async (promotionId: string, interaction: PromotionInteraction) => {
    try {
      // Tracking interno
      await fetch('/api/promotions/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promotionId,
          userId: user?.id,
          action: interaction.action,
          sessionId,
          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
          referrer: typeof window !== 'undefined' ? document.referrer : undefined,
          userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
        }),
      });

      // Tracking de GA4
      if (activePromotion) {
        const gaData = {
          promotion_id: promotionId,
          promotion_title: activePromotion.title,
          promotion_type: activePromotion.type,
          cta_text: activePromotion.ctaText,
          cta_url: activePromotion.ctaUrl,
          session_id: sessionId,
          user_id: user?.id,
          page_url: typeof window !== 'undefined' ? window.location.href : undefined,
          referrer: typeof window !== 'undefined' ? document.referrer : undefined,
          user_agent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
        };

        // Enviar evento a GA4
        trackPromotionEvent(interaction.action as any, gaData);
      }
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const handleBannerClose = () => {
    if (activePromotion) {
      trackInteraction(activePromotion.id, { action: 'close' });
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('banner_closed', 'true');
        sessionStorage.setItem('banner_last_shown', new Date().toDateString());
        sessionStorage.setItem('banner_has_shown', 'true');
      }
    }
    setActivePromotion(null);
  };

  const handleBannerClick = () => {
    if (activePromotion) {
      trackInteraction(activePromotion.id, { action: 'click' });
      
      // Agregar parámetros de tracking a la URL
      const url = new URL(activePromotion.ctaUrl, window.location.origin);
      url.searchParams.set('promotionId', activePromotion.id);
      url.searchParams.set('sessionId', sessionId || '');
      url.searchParams.set('pageUrl', window.location.href);
      url.searchParams.set('referrer', document.referrer);
      url.searchParams.set('userAgent', navigator.userAgent);
      
      // Redirigir a la URL con tracking
      window.location.href = url.toString();
    }
  };

  const handleBannerImpression = () => {
    if (activePromotion) {
      trackInteraction(activePromotion.id, { action: 'impression' });
      
      // Marcar que el banner se mostró
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('banner_last_shown', new Date().toDateString());
        sessionStorage.setItem('banner_has_shown', 'true');
      }
    }
  };

  return {
    activePromotion,
    isLoading,
    handleBannerClose,
    handleBannerClick,
    handleBannerImpression,
  };
} 