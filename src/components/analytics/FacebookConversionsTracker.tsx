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
    // Tracking de PageView
    if (trackPageView) {
      sendFacebookConversionEvent('PageView', {
        content_name: pageData.content_name || document.title,
        content_category: pageData.content_category || 'Page',
        content_type: pageData.content_type || 'page_view',
        content_ids: pageData.content_ids || []
      });
    }

    // Tracking de eventos personalizados con delay
    customEvents.forEach((customEvent, index) => {
      const delay = customEvent.delay || 0;
      
      setTimeout(() => {
        sendFacebookConversionEvent(customEvent.event as any, customEvent.data);
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
    // Tracking de visualización de página de webinar
    webinarEvents.trackWebinarPageView(webinarId, webinarName);
    
    // Tracking de lead si hay email
    if (userEmail) {
      webinarEvents.trackWebinarLead(webinarId, webinarName, userEmail);
    }
  }, [webinarId, webinarName, userEmail]);

  return null;
}

/**
 * Hook para usar Conversions API en componentes
 */
export function useWebinarConversions() {
  const trackRegistration = async (webinarId: string, webinarName: string, userEmail?: string) => {
    return await webinarEvents.trackWebinarRegistration(webinarId, webinarName, userEmail);
  };

  const trackPageView = async (webinarId: string, webinarName: string) => {
    return await webinarEvents.trackWebinarPageView(webinarId, webinarName);
  };

  const trackLead = async (webinarId: string, webinarName: string, userEmail?: string) => {
    return await webinarEvents.trackWebinarLead(webinarId, webinarName, userEmail);
  };

  return {
    trackRegistration,
    trackPageView,
    trackLead
  };
} 