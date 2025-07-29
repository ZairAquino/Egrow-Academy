'use client';

import { useCallback } from 'react';

interface CourseEventData {
  course_id: string;
  course_name: string;
  course_category?: string;
  course_level?: string;
  course_price?: number;
}

interface UserEventData {
  user_id?: string;
  user_type?: 'free' | 'premium' | 'admin';
  user_country?: string;
}

interface ConversionEventData {
  value?: number;
  currency?: string;
  transaction_id?: string;
}

export const useAnalytics = () => {
  const trackEvent = useCallback((
    eventName: string, 
    parameters: Record<string, any> = {}
  ) => {
    // Solo ejecutar en el cliente y si las funciones están disponibles
    if (typeof window !== 'undefined') {
      try {
        if (window.gtag) {
          window.gtag('event', eventName, {
            event_category: 'egrow_academy',
            event_label: window.location.pathname,
            ...parameters,
          });
        }

        if (window.fbq) {
          window.fbq('track', eventName, parameters);
        }
      } catch (error) {
        console.warn('Analytics error:', error);
      }
    }
  }, []);

  // Eventos de Cursos
  const trackCourseView = useCallback((data: CourseEventData) => {
    trackEvent('course_view', {
      course_id: data.course_id,
      course_name: data.course_name,
      course_category: data.course_category,
      course_level: data.course_level,
      course_price: data.course_price,
    });
  }, [trackEvent]);

  const trackCourseEnroll = useCallback((data: CourseEventData & UserEventData) => {
    trackEvent('course_enroll', {
      course_id: data.course_id,
      course_name: data.course_name,
      course_category: data.course_category,
      course_level: data.course_level,
      course_price: data.course_price,
      user_type: data.user_type,
      user_country: data.user_country,
    });
  }, [trackEvent]);

  const trackCourseComplete = useCallback((data: CourseEventData & UserEventData) => {
    trackEvent('course_complete', {
      course_id: data.course_id,
      course_name: data.course_name,
      course_category: data.course_category,
      course_level: data.course_level,
      user_type: data.user_type,
    });
  }, [trackEvent]);

  const trackLessonView = useCallback((data: {
    course_id: string;
    lesson_id: string;
    lesson_name: string;
    lesson_number: number;
  } & UserEventData) => {
    trackEvent('lesson_view', {
      course_id: data.course_id,
      lesson_id: data.lesson_id,
      lesson_name: data.lesson_name,
      lesson_number: data.lesson_number,
      user_type: data.user_type,
    });
  }, [trackEvent]);

  const trackVideoPlay = useCallback((data: {
    course_id: string;
    lesson_id: string;
    video_duration: number;
    video_title: string;
  } & UserEventData) => {
    trackEvent('video_play', {
      course_id: data.course_id,
      lesson_id: data.lesson_id,
      video_duration: data.video_duration,
      video_title: data.video_title,
      user_type: data.user_type,
    });
  }, [trackEvent]);

  // Eventos de Conversión
  const trackSubscriptionStart = useCallback((data: ConversionEventData & UserEventData) => {
    trackEvent('subscription_start', {
      value: data.value,
      currency: data.currency || 'MXN',
      transaction_id: data.transaction_id,
      user_type: data.user_type,
      user_country: data.user_country,
    });
  }, [trackEvent]);

  const trackPaymentComplete = useCallback((data: ConversionEventData & UserEventData) => {
    trackEvent('payment_complete', {
      value: data.value,
      currency: data.currency || 'MXN',
      transaction_id: data.transaction_id,
      user_type: data.user_type,
      user_country: data.user_country,
    });
  }, [trackEvent]);

  const trackFreeTrialStart = useCallback((data: UserEventData) => {
    trackEvent('free_trial_start', {
      user_type: data.user_type,
      user_country: data.user_country,
    });
  }, [trackEvent]);

  const trackDownloadResource = useCallback((data: {
    resource_id: string;
    resource_name: string;
    resource_type: 'pdf' | 'video' | 'code' | 'other';
  } & UserEventData) => {
    trackEvent('download_resource', {
      resource_id: data.resource_id,
      resource_name: data.resource_name,
      resource_type: data.resource_type,
      user_type: data.user_type,
    });
  }, [trackEvent]);

  // Eventos de Usuario
  const trackUserRegister = useCallback((data: UserEventData) => {
    trackEvent('user_register', {
      user_type: data.user_type,
      user_country: data.user_country,
    });
  }, [trackEvent]);

  const trackUserLogin = useCallback((data: UserEventData) => {
    trackEvent('user_login', {
      user_type: data.user_type,
      user_country: data.user_country,
    });
  }, [trackEvent]);

  const trackSearchCourse = useCallback((data: {
    search_term: string;
    results_count: number;
  } & UserEventData) => {
    trackEvent('search_course', {
      search_term: data.search_term,
      results_count: data.results_count,
      user_type: data.user_type,
    });
  }, [trackEvent]);

  const trackContactFormSubmit = useCallback((data: {
    form_type: 'contact' | 'support' | 'feedback';
    subject?: string;
  } & UserEventData) => {
    trackEvent('contact_form_submit', {
      form_type: data.form_type,
      subject: data.subject,
      user_type: data.user_type,
    });
  }, [trackEvent]);

  // Eventos de Navegación
  const trackPageView = useCallback((data: {
    page_title?: string;
    page_url?: string;
    page_category?: string;
  } = {}) => {
    if (typeof window !== 'undefined') {
      try {
        const title = data.page_title || document.title;
        const url = data.page_url || window.location.href;
        
        if (window.gtag) {
          window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
            page_title: title,
            page_location: url,
            custom_map: {
              'custom_parameter_1': 'page_category',
            },
            custom_parameter_1: data.page_category,
          });
        }

        if (window.fbq) {
          window.fbq('track', 'PageView');
        }
      } catch (error) {
        console.warn('PageView tracking error:', error);
      }
    }
  }, []);

  // Eventos de Engagement
  const trackScrollDepth = useCallback((depth: number) => {
    trackEvent('scroll_depth', {
      scroll_percentage: depth,
    });
  }, [trackEvent]);

  const trackTimeOnPage = useCallback((timeSpent: number) => {
    trackEvent('time_on_page', {
      time_spent_seconds: timeSpent,
    });
  }, [trackEvent]);

  const trackCTAClick = useCallback((data: {
    cta_type: 'enroll' | 'subscribe' | 'download' | 'contact' | 'trial';
    cta_text: string;
    cta_location: string;
  } & UserEventData) => {
    trackEvent('cta_click', {
      cta_type: data.cta_type,
      cta_text: data.cta_text,
      cta_location: data.cta_location,
      user_type: data.user_type,
    });
  }, [trackEvent]);

  // Eventos de Error
  const trackError = useCallback((data: {
    error_type: '404' | '500' | 'video_error' | 'payment_error' | 'other';
    error_message: string;
    error_url: string;
  }) => {
    trackEvent('error', {
      error_type: data.error_type,
      error_message: data.error_message,
      error_url: data.error_url,
    });
  }, [trackEvent]);

  return {
    // Métodos básicos
    trackEvent,
    trackPageView,
    
    // Eventos de cursos
    trackCourseView,
    trackCourseEnroll,
    trackCourseComplete,
    trackLessonView,
    trackVideoPlay,
    
    // Eventos de conversión
    trackSubscriptionStart,
    trackPaymentComplete,
    trackFreeTrialStart,
    trackDownloadResource,
    
    // Eventos de usuario
    trackUserRegister,
    trackUserLogin,
    trackSearchCourse,
    trackContactFormSubmit,
    
    // Eventos de engagement
    trackScrollDepth,
    trackTimeOnPage,
    trackCTAClick,
    
    // Eventos de error
    trackError,
  };
};

// Tipos para TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
} 