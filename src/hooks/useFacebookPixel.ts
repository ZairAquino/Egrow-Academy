import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  trackFacebookPixelEvent,
  trackUserRegistration,
  trackUserLogin,
  trackCourseView,
  trackLessonComplete,
  trackCertificateEarned,
  trackPremiumUpgrade,
  trackPurchase,
  trackCommunityJoin,
  trackWebinarRegistration,
  trackResourceDownload,
  trackVideoWatch,
  trackAddToCart,
  trackEducationalFunnel,
  type FacebookPixelEventType,
  type EducationalEventData
} from '@/lib/facebook-pixel';

export const useFacebookPixel = () => {
  const { user } = useAuth();

  // Función base para tracking de eventos
  const trackEvent = useCallback((
    eventType: FacebookPixelEventType,
    data: EducationalEventData = {}
  ) => {
    // Agregar user_id automáticamente si el usuario está logueado
    const eventData = {
      ...data,
      user_id: user?.id || data.user_id,
      membership_level: user?.membershipLevel || data.membership_level
    };

    trackFacebookPixelEvent(eventType, eventData);
  }, [user]);

  // Eventos de autenticación
  const trackRegistration = useCallback((email?: string) => {
    if (user?.id) {
      trackUserRegistration({
        user_id: user.id,
        email: email || user.email
      });
    }
  }, [user]);

  const trackLogin = useCallback(() => {
    if (user?.id) {
      trackUserLogin({
        user_id: user.id,
        membership_level: user.membershipLevel
      });
    }
  }, [user]);

  // Eventos de cursos
  const trackCourseViewEvent = useCallback((courseData: {
    course_id: string;
    course_name: string;
  }) => {
    trackCourseView({
      ...courseData,
      user_id: user?.id,
      membership_level: user?.membershipLevel
    });
  }, [user]);

  const trackLessonCompleteEvent = useCallback((lessonData: {
    course_id: string;
    lesson_id: string;
    lesson_name: string;
    progress_percentage: number;
  }) => {
    if (user?.id) {
      trackLessonComplete({
        ...lessonData,
        user_id: user.id
      });
    }
  }, [user]);

  const trackCertificateEarnedEvent = useCallback((certificateData: {
    course_id: string;
    course_name: string;
    certificate_id: string;
  }) => {
    if (user?.id) {
      trackCertificateEarned({
        ...certificateData,
        user_id: user.id
      });
    }
  }, [user]);

  // Eventos de membresía y pagos
  const trackPremiumUpgradeEvent = useCallback((upgradeData: {
    plan_type: 'monthly' | 'yearly';
    value: number;
    currency?: string;
  }) => {
    if (user?.id) {
      trackPremiumUpgrade({
        ...upgradeData,
        user_id: user.id
      });
    }
  }, [user]);

  const trackPurchaseEvent = useCallback((purchaseData: {
    course_id: string;
    course_name: string;
    value: number;
    currency?: string;
  }) => {
    if (user?.id) {
      trackPurchase({
        ...purchaseData,
        user_id: user.id
      });
    }
  }, [user]);

  // Eventos de comunidad
  const trackCommunityJoinEvent = useCallback((communityType: 'forum' | 'webinar' | 'event') => {
    if (user?.id) {
      trackCommunityJoin({
        user_id: user.id,
        community_type: communityType
      });
    }
  }, [user]);

  const trackWebinarRegistrationEvent = useCallback((webinarData: {
    webinar_id: string;
    webinar_name: string;
  }) => {
    if (user?.id) {
      trackWebinarRegistration({
        ...webinarData,
        user_id: user.id
      });
    }
  }, [user]);

  // Eventos de engagement
  const trackResourceDownloadEvent = useCallback((resourceData: {
    resource_id: string;
    resource_name: string;
    resource_type: string;
  }) => {
    if (user?.id) {
      trackResourceDownload({
        ...resourceData,
        user_id: user.id
      });
    }
  }, [user]);

  const trackVideoWatchEvent = useCallback((videoData: {
    video_id: string;
    video_name: string;
    course_id?: string;
    watch_duration: number;
  }) => {
    if (user?.id) {
      trackVideoWatch({
        ...videoData,
        user_id: user.id
      });
    }
  }, [user]);

  // Eventos de funnel
  const trackAddToCartEvent = useCallback((cartData: {
    course_id: string;
    course_name: string;
    value: number;
    currency?: string;
  }) => {
    trackAddToCart({
      ...cartData,
      user_id: user?.id
    });
  }, [user]);

  const trackFunnelEvent = useCallback((
    step: 'view' | 'interest' | 'registration' | 'purchase',
    data: EducationalEventData = {}
  ) => {
    const funnelData = {
      ...data,
      user_id: user?.id || data.user_id,
      membership_level: user?.membershipLevel || data.membership_level
    };

    trackEducationalFunnel(step, funnelData);
  }, [user]);

  return {
    // Función base
    trackEvent,
    
    // Eventos de autenticación
    trackRegistration,
    trackLogin,
    
    // Eventos de cursos
    trackCourseView: trackCourseViewEvent,
    trackLessonComplete: trackLessonCompleteEvent,
    trackCertificateEarned: trackCertificateEarnedEvent,
    
    // Eventos de membresía y pagos
    trackPremiumUpgrade: trackPremiumUpgradeEvent,
    trackPurchase: trackPurchaseEvent,
    
    // Eventos de comunidad
    trackCommunityJoin: trackCommunityJoinEvent,
    trackWebinarRegistration: trackWebinarRegistrationEvent,
    
    // Eventos de engagement
    trackResourceDownload: trackResourceDownloadEvent,
    trackVideoWatch: trackVideoWatchEvent,
    
    // Eventos de funnel
    trackAddToCart: trackAddToCartEvent,
    trackFunnel: trackFunnelEvent,
    
    // Estado del usuario
    isUserLoggedIn: !!user?.id,
    userMembershipLevel: user?.membershipLevel
  };
}; 