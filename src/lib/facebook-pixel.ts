// Facebook Pixel Service para eGrow Academy
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

// Tipos de eventos de Facebook Pixel
export type FacebookPixelEventType = 
  | 'PageView'
  | 'ViewContent'
  | 'AddToCart'
  | 'Purchase'
  | 'CompleteRegistration'
  | 'Lead'
  | 'Subscribe'
  | 'StartTrial'
  | 'CompleteTrial'
  | 'CustomEvent';

// Interfaz para datos de evento educativo
export interface EducationalEventData {
  content_name?: string;
  content_category?: string;
  content_type?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
  user_id?: string;
  course_id?: string;
  lesson_id?: string;
  membership_level?: 'FREE' | 'PREMIUM';
  custom_parameters?: Record<string, any>;
}

// Función para enviar eventos a Facebook Pixel
export const trackFacebookPixelEvent = (
  eventType: FacebookPixelEventType,
  data: EducationalEventData = {}
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    // Preparar parámetros del evento
    const eventParams: any = {
      content_name: data.content_name,
      content_category: data.content_category,
      content_type: data.content_type,
      content_ids: data.content_ids,
      value: data.value,
      currency: data.currency || 'USD',
      user_id: data.user_id,
      custom_parameters: {
        ...data.custom_parameters,
        course_id: data.course_id,
        lesson_id: data.lesson_id,
        membership_level: data.membership_level,
      }
    };

    // Enviar evento a Facebook Pixel
    window.fbq('track', eventType, eventParams);

    console.log(`📊 [Facebook Pixel] Evento enviado: ${eventType}`, eventParams);
  } else {
    console.warn('Facebook Pixel no está disponible');
  }
};

// Eventos específicos para eGrow Academy

// 1. Eventos de Registro y Autenticación
export const trackUserRegistration = (userData: { user_id: string; email?: string }) => {
  trackFacebookPixelEvent('CompleteRegistration', {
    content_name: 'User Registration',
    content_category: 'Authentication',
    content_type: 'registration',
    user_id: userData.user_id,
    custom_parameters: {
      registration_method: 'email',
      email: userData.email
    }
  });
};

export const trackUserLogin = (userData: { user_id: string; membership_level?: string }) => {
  trackFacebookPixelEvent('CustomEvent', {
    content_name: 'User Login',
    content_category: 'Authentication',
    content_type: 'login',
    user_id: userData.user_id,
    custom_parameters: {
      membership_level: userData.membership_level || 'FREE'
    }
  });
};

// 2. Eventos de Cursos y Educación
export const trackCourseView = (courseData: { 
  course_id: string; 
  course_name: string; 
  user_id?: string;
  membership_level?: string;
}) => {
  trackFacebookPixelEvent('ViewContent', {
    content_name: courseData.course_name,
    content_category: 'Course',
    content_type: 'course',
    content_ids: [courseData.course_id],
    user_id: courseData.user_id,
    custom_parameters: {
      course_id: courseData.course_id,
      membership_level: courseData.membership_level
    }
  });
};

export const trackLessonComplete = (lessonData: {
  course_id: string;
  lesson_id: string;
  lesson_name: string;
  user_id: string;
  progress_percentage: number;
}) => {
  trackFacebookPixelEvent('CustomEvent', {
    content_name: lessonData.lesson_name,
    content_category: 'Lesson',
    content_type: 'lesson_complete',
    content_ids: [lessonData.course_id, lessonData.lesson_id],
    user_id: lessonData.user_id,
    custom_parameters: {
      course_id: lessonData.course_id,
      lesson_id: lessonData.lesson_id,
      progress_percentage: lessonData.progress_percentage
    }
  });
};

export const trackCertificateEarned = (certificateData: {
  course_id: string;
  course_name: string;
  user_id: string;
  certificate_id: string;
}) => {
  trackFacebookPixelEvent('CustomEvent', {
    content_name: `Certificate: ${certificateData.course_name}`,
    content_category: 'Achievement',
    content_type: 'certificate',
    content_ids: [certificateData.course_id, certificateData.certificate_id],
    user_id: certificateData.user_id,
    custom_parameters: {
      course_id: certificateData.course_id,
      certificate_id: certificateData.certificate_id
    }
  });
};

// 3. Eventos de Membresía y Pagos
export const trackPremiumUpgrade = (upgradeData: {
  user_id: string;
  plan_type: 'monthly' | 'yearly';
  value: number;
  currency?: string;
}) => {
  trackFacebookPixelEvent('Subscribe', {
    content_name: `Premium ${upgradeData.plan_type}`,
    content_category: 'Membership',
    content_type: 'premium_upgrade',
    value: upgradeData.value,
    currency: upgradeData.currency || 'USD',
    user_id: upgradeData.user_id,
    custom_parameters: {
      plan_type: upgradeData.plan_type,
      membership_type: 'PREMIUM'
    }
  });
};

export const trackPurchase = (purchaseData: {
  user_id: string;
  course_id: string;
  course_name: string;
  value: number;
  currency?: string;
}) => {
  trackFacebookPixelEvent('Purchase', {
    content_name: purchaseData.course_name,
    content_category: 'Course Purchase',
    content_type: 'course_purchase',
    content_ids: [purchaseData.course_id],
    value: purchaseData.value,
    currency: purchaseData.currency || 'USD',
    user_id: purchaseData.user_id,
    custom_parameters: {
      course_id: purchaseData.course_id
    }
  });
};

// 4. Eventos de Comunidad
export const trackCommunityJoin = (communityData: {
  user_id: string;
  community_type: 'forum' | 'webinar' | 'event';
}) => {
  trackFacebookPixelEvent('CustomEvent', {
    content_name: `Join ${communityData.community_type}`,
    content_category: 'Community',
    content_type: 'community_join',
    user_id: communityData.user_id,
    custom_parameters: {
      community_type: communityData.community_type
    }
  });
};

export const trackWebinarRegistration = (webinarData: {
  webinar_id: string;
  webinar_name: string;
  user_id: string;
}) => {
  trackFacebookPixelEvent('Lead', {
    content_name: webinarData.webinar_name,
    content_category: 'Webinar',
    content_type: 'webinar_registration',
    content_ids: [webinarData.webinar_id],
    user_id: webinarData.user_id,
    custom_parameters: {
      webinar_id: webinarData.webinar_id
    }
  });
};

// 5. Eventos de Engagement
export const trackResourceDownload = (resourceData: {
  resource_id: string;
  resource_name: string;
  resource_type: string;
  user_id: string;
}) => {
  trackFacebookPixelEvent('CustomEvent', {
    content_name: resourceData.resource_name,
    content_category: 'Resource',
    content_type: 'resource_download',
    content_ids: [resourceData.resource_id],
    user_id: resourceData.user_id,
    custom_parameters: {
      resource_id: resourceData.resource_id,
      resource_type: resourceData.resource_type
    }
  });
};

export const trackVideoWatch = (videoData: {
  video_id: string;
  video_name: string;
  course_id?: string;
  user_id: string;
  watch_duration: number;
}) => {
  trackFacebookPixelEvent('CustomEvent', {
    content_name: videoData.video_name,
    content_category: 'Video',
    content_type: 'video_watch',
    content_ids: [videoData.video_id],
    user_id: videoData.user_id,
    custom_parameters: {
      video_id: videoData.video_id,
      course_id: videoData.course_id,
      watch_duration: videoData.watch_duration
    }
  });
};

// 6. Eventos de Funnel de Conversión
export const trackAddToCart = (cartData: {
  course_id: string;
  course_name: string;
  value: number;
  currency?: string;
  user_id?: string;
}) => {
  trackFacebookPixelEvent('AddToCart', {
    content_name: cartData.course_name,
    content_category: 'Course',
    content_type: 'course',
    content_ids: [cartData.course_id],
    value: cartData.value,
    currency: cartData.currency || 'USD',
    user_id: cartData.user_id,
    custom_parameters: {
      course_id: cartData.course_id
    }
  });
};

// Función para inicializar Facebook Pixel (ya está en layout.tsx)
export const initializeFacebookPixel = (pixelId: string) => {
  if (typeof window !== 'undefined') {
    console.log('✅ Facebook Pixel inicializado con ID:', pixelId);
  }
};

// Función para tracking de funnel completo
export const trackEducationalFunnel = (
  step: 'view' | 'interest' | 'registration' | 'purchase',
  data: EducationalEventData
) => {
  const eventMap = {
    view: 'ViewContent',
    interest: 'Lead',
    registration: 'CompleteRegistration',
    purchase: 'Purchase'
  } as const;

  trackFacebookPixelEvent(eventMap[step], data);
}; 