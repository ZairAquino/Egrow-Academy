'use client';

import { useEffect } from 'react';
import { webinarEvents, sendFacebookConversionEvent } from '@/lib/facebook-conversions-api';

interface FacebookConversionsTrackerProps {
  trackPageView?: boolean;
  pageData?: {
    content_name?: string;
    content_category?: string;
    content_type?: string;
    content_ids?: string[];
  };
  customEvents?: Array<{
    event: string;
    data: any;
    delay?: number;
  }>;
}

/**
 * Componente para tracking con Facebook Conversions API
 */
export default function FacebookConversionsTracker({
  trackPageView = true,
  pageData = {},
  customEvents = []
}: FacebookConversionsTrackerProps) {
  
  useEffect(() => {
    // Verificar si estamos en el cliente y FB Conversions está habilitado
    if (typeof window === 'undefined') return;

    // Tracking de PageView
    if (trackPageView) {
      sendFacebookConversionEvent('PageView', {
        content_name: pageData.content_name || document.title,
        content_category: pageData.content_category || 'Page',
        content_type: pageData.content_type || 'page_view',
        content_ids: pageData.content_ids || []
      }).catch(error => {
        // Manejo silencioso de errores para no interrumpir la experiencia del usuario
        console.warn('Facebook Conversions API error handled gracefully:', error);
      });
    }

    // Tracking de eventos personalizados con delay
    customEvents.forEach((customEvent, index) => {
      const delay = customEvent.delay || 0;
      
      setTimeout(() => {
        sendFacebookConversionEvent(customEvent.event as any, customEvent.data).catch(error => {
          // Manejo silencioso de errores
          console.warn('Facebook Conversions API event error handled gracefully:', error);
        });
      }, delay);
    });
  }, [trackPageView, pageData, customEvents]);

  return null;
}

/**
 * Componente específico para tracking de webinar
 */
export function WebinarConversionsTracker({
  webinarId,
  webinarName,
  userEmail
}: {
  webinarId: string;
  webinarName: string;
  userEmail?: string;
}) {
  
  useEffect(() => {
    // Verificar si estamos en el cliente
    if (typeof window === 'undefined') return;

    // Tracking de visualización de página de webinar
    webinarEvents.trackWebinarPageView(webinarId, webinarName).catch(error => {
      console.warn('Webinar page view tracking error handled gracefully:', error);
    });
    
    // Tracking de lead si hay email
    if (userEmail) {
      webinarEvents.trackWebinarLead(webinarId, webinarName, userEmail).catch(error => {
        console.warn('Webinar lead tracking error handled gracefully:', error);
      });
    }
  }, [webinarId, webinarName, userEmail]);

  return null;
}

/**
 * Hook para usar Conversions API en componentes
 */
export function useWebinarConversions() {
  const trackRegistration = async (webinarId: string, webinarName: string, userEmail?: string) => {
    try {
      return await webinarEvents.trackWebinarRegistration(webinarId, webinarName, userEmail);
    } catch (error) {
      console.warn('Registration tracking error handled gracefully:', error);
      return false;
    }
  };

  const trackPageView = async (webinarId: string, webinarName: string) => {
    try {
      return await webinarEvents.trackWebinarPageView(webinarId, webinarName);
    } catch (error) {
      console.warn('Page view tracking error handled gracefully:', error);
      return false;
    }
  };

  const trackLead = async (webinarId: string, webinarName: string, userEmail?: string) => {
    try {
      return await webinarEvents.trackWebinarLead(webinarId, webinarName, userEmail);
    } catch (error) {
      console.warn('Lead tracking error handled gracefully:', error);
      return false;
    }
  };

  return {
    trackRegistration,
    trackPageView,
    trackLead
  };
} 