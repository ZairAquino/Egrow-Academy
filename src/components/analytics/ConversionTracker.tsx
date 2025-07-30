'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackPromotionConversion } from '@/lib/analytics';

export default function ConversionTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Verificar si estamos en una página de conversión
    const isConversionPage = searchParams.get('conversion') === 'true';
    const promotionId = searchParams.get('promotionId');
    const planType = searchParams.get('planType') as 'monthly' | 'yearly';
    const sessionId = searchParams.get('sessionId');

    if (isConversionPage && promotionId) {
      // Determinar revenue basado en el plan
      const revenue = planType === 'yearly' ? 59.99 : 6.99;

      // Obtener información de la promoción desde localStorage o API
      const promotionData = localStorage.getItem(`promotion_${promotionId}`);
      let promotionInfo = {
        title: 'Promoción',
        type: 'PREMIUM_SUBSCRIPTION' as const,
        ctaText: 'Suscribirse',
        ctaUrl: '/subscription',
      };

      if (promotionData) {
        try {
          promotionInfo = JSON.parse(promotionData);
        } catch (error) {
          console.error('Error parsing promotion data:', error);
        }
      }

      // Trackear conversión en GA4
      trackPromotionConversion({
        promotion_id: promotionId,
        promotion_title: promotionInfo.title,
        promotion_type: promotionInfo.type,
        cta_text: promotionInfo.ctaText,
        cta_url: promotionInfo.ctaUrl,
        session_id: sessionId,
        user_id: undefined, // Se puede obtener del contexto de auth
        page_url: window.location.href,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        revenue,
        currency: 'USD',
        plan_type: planType,
      });

      console.log(`💰 [GA4] Conversión trackeada: ${promotionInfo.title} - $${revenue}`);
    }
  }, [searchParams]);

  return null; // Componente invisible
} 