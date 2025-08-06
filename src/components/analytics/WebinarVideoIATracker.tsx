'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { trackFacebookPixelEvent } from '@/lib/facebook-pixel';

interface WebinarVideoIATrackerProps {
  webinarId: string;
  webinarName: string;
  trackPageView?: boolean;
  trackRegistration?: boolean;
  trackEngagement?: boolean;
}

export default function WebinarVideoIATracker({
  webinarId,
  webinarName,
  trackPageView = true,
  trackRegistration = true,
  trackEngagement = true
}: WebinarVideoIATrackerProps) {
  const { user, status } = useAuth();
  const [hasTrackedPageView, setHasTrackedPageView] = useState(false);
  const [hasTrackedRegistration, setHasTrackedRegistration] = useState(false);
  const [engagementEvents, setEngagementEvents] = useState<string[]>([]);

  // Obtener metadatos completos del usuario
  const getUserMetadata = () => {
    if (!user) return {};

    return {
      user_id: user.id,
      user_email: user.email,
      user_first_name: user.firstName,
      user_last_name: user.lastName,
      user_membership_level: user.membershipLevel,
      user_country: user.country || 'No especificado',
      user_has_been_premium: user.hasBeenPremium,
      user_created_at: user.createdAt,
      user_last_login: user.lastLogin,
      user_is_active: user.isActive,
      user_email_verified: user.emailVerified,
      user_stripe_customer_id: user.stripeCustomerId || 'No configurado',
      user_username: user.username || 'No configurado',
      user_bio: user.bio || 'No configurado',
      user_profile_image: user.profileImage || 'No configurado'
    };
  };

  // Track PageView con metadatos completos
  useEffect(() => {
    if (trackPageView && !hasTrackedPageView && status === 'authenticated') {
      const userMetadata = getUserMetadata();
      
      trackFacebookPixelEvent('ViewContent', {
        content_name: webinarName,
        content_category: 'Webinar',
        content_type: 'webinar_landing_page',
        content_ids: [webinarId],
        user_id: user?.id,
        custom_parameters: {
          ...userMetadata,
          webinar_id: webinarId,
          webinar_type: 'ia_video_creation',
          webinar_category: 'Marketing Digital',
          webinar_duration: '90 minutos',
          webinar_level: 'Principiante',
          funnel_step: 'landing_page_view',
          page_url: typeof window !== 'undefined' ? window.location.href : '',
          timestamp: new Date().toISOString(),
          session_id: Math.random().toString(36).substring(2, 15)
        }
      });

      setHasTrackedPageView(true);
      console.log('📊 [Webinar Video IA] PageView tracked with full user metadata');
    }
  }, [trackPageView, hasTrackedPageView, status, user, webinarId, webinarName]);

  // Track Registration con metadatos completos
  const handleRegistration = () => {
    if (trackRegistration && !hasTrackedRegistration && status === 'authenticated') {
      const userMetadata = getUserMetadata();
      
      trackFacebookPixelEvent('Lead', {
        content_name: webinarName,
        content_category: 'Webinar',
        content_type: 'webinar_registration',
        content_ids: [webinarId],
        user_id: user?.id,
        custom_parameters: {
          ...userMetadata,
          webinar_id: webinarId,
          webinar_type: 'ia_video_creation',
          webinar_category: 'Marketing Digital',
          webinar_duration: '90 minutos',
          webinar_level: 'Principiante',
          funnel_step: 'registration_completed',
          registration_method: 'form_submission',
          registration_timestamp: new Date().toISOString(),
          session_id: Math.random().toString(36).substring(2, 15)
        }
      });

      setHasTrackedRegistration(true);
      console.log('📊 [Webinar Video IA] Registration tracked with full user metadata');
    }
  };

  // Track Engagement events
  const handleEngagement = (eventType: string, additionalData: any = {}) => {
    if (trackEngagement && status === 'authenticated') {
      const userMetadata = getUserMetadata();
      
      trackFacebookPixelEvent('CustomEvent', {
        content_name: webinarName,
        content_category: 'Webinar',
        content_type: `webinar_${eventType}`,
        content_ids: [webinarId],
        user_id: user?.id,
        custom_parameters: {
          ...userMetadata,
          ...additionalData,
          webinar_id: webinarId,
          webinar_type: 'ia_video_creation',
          webinar_category: 'Marketing Digital',
          engagement_type: eventType,
          engagement_timestamp: new Date().toISOString(),
          session_id: Math.random().toString(36).substring(2, 15)
        }
      });

      setEngagementEvents(prev => [...prev, eventType]);
      console.log(`📊 [Webinar Video IA] Engagement tracked: ${eventType}`);
    }
  };

  // Exponer funciones para uso externo
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).trackWebinarVideoIA = {
        trackRegistration: handleRegistration,
        trackEngagement: handleEngagement,
        getUserMetadata
      };
    }
  }, [handleRegistration, handleEngagement]);

  // Track automático de engagement basado en interacciones
  useEffect(() => {
    if (!trackEngagement || status !== 'authenticated') return;

    const trackScroll = () => {
      const scrollPercentage = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      
      if (scrollPercentage > 25 && !engagementEvents.includes('scroll_25')) {
        handleEngagement('scroll_25', { scroll_percentage: scrollPercentage });
      }
      if (scrollPercentage > 50 && !engagementEvents.includes('scroll_50')) {
        handleEngagement('scroll_50', { scroll_percentage: scrollPercentage });
      }
      if (scrollPercentage > 75 && !engagementEvents.includes('scroll_75')) {
        handleEngagement('scroll_75', { scroll_percentage: scrollPercentage });
      }
    };

    const trackTimeOnPage = () => {
      setTimeout(() => {
        if (!engagementEvents.includes('time_30s')) {
          handleEngagement('time_30s', { time_on_page: 30 });
        }
      }, 30000);

      setTimeout(() => {
        if (!engagementEvents.includes('time_60s')) {
          handleEngagement('time_60s', { time_on_page: 60 });
        }
      }, 60000);

      setTimeout(() => {
        if (!engagementEvents.includes('time_120s')) {
          handleEngagement('time_120s', { time_on_page: 120 });
        }
      }, 120000);
    };

    window.addEventListener('scroll', trackScroll);
    trackTimeOnPage();

    return () => {
      window.removeEventListener('scroll', trackScroll);
    };
  }, [trackEngagement, status, engagementEvents]);

  // Componente no renderiza nada visual
  return null;
}

// Hook personalizado para usar el tracker
export const useWebinarVideoIATracker = () => {
  const { user, status } = useAuth();

  const trackRegistration = () => {
    if (typeof window !== 'undefined' && (window as any).trackWebinarVideoIA) {
      (window as any).trackWebinarVideoIA.trackRegistration();
    }
  };

  const trackEngagement = (eventType: string, additionalData: any = {}) => {
    if (typeof window !== 'undefined' && (window as any).trackWebinarVideoIA) {
      (window as any).trackWebinarVideoIA.trackEngagement(eventType, additionalData);
    }
  };

  const getUserMetadata = () => {
    if (typeof window !== 'undefined' && (window as any).trackWebinarVideoIA) {
      return (window as any).trackWebinarVideoIA.getUserMetadata();
    }
    return {};
  };

  return {
    trackRegistration,
    trackEngagement,
    getUserMetadata,
    isUserLoggedIn: status === 'authenticated',
    user
  };
}; 