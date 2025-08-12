// Sistema de Tracking para Redes Sociales - eGrow Academy

export interface SocialTrackingData {
  platform: 'instagram' | 'tiktok' | 'linkedin' | 'youtube' | 'twitter';
  campaign: string;
  content_type: 'post' | 'story' | 'reel' | 'video' | 'article';
  post_id?: string;
  user_id?: string;
  session_id?: string;
  referrer?: string;
}

// Configuración de URLs de tracking
export const SOCIAL_TRACKING_URLS = {
  instagram: {
    base: 'https://egrowacademy.com',
    campaigns: {
      curso_ia: '/courses?utm_source=instagram&utm_medium=social&utm_campaign=curso_ia',
      recursos_gratuitos: '/resources?utm_source=instagram&utm_medium=social&utm_campaign=recursos_gratuitos',
      comunidad: '/community?utm_source=instagram&utm_medium=social&utm_campaign=comunidad',
      newsletter: '/?utm_source=instagram&utm_medium=social&utm_campaign=newsletter',
      curso_monetiza: '/curso/monetiza-ia?utm_source=instagram&utm_medium=social&utm_campaign=curso_monetiza',
      curso_asistentes: '/curso/asistentes-virtuales-ia?utm_source=instagram&utm_medium=social&utm_campaign=curso_asistentes',
    }
  },
  tiktok: {
    base: 'https://egrowacademy.com',
    campaigns: {
      curso_ia: '/courses?utm_source=tiktok&utm_medium=social&utm_campaign=curso_ia',
      recursos_gratuitos: '/resources?utm_source=tiktok&utm_medium=social&utm_campaign=recursos_gratuitos',
      comunidad: '/community?utm_source=tiktok&utm_medium=social&utm_campaign=comunidad',
      newsletter: '/?utm_source=tiktok&utm_medium=social&utm_campaign=newsletter',
    }
  },
  linkedin: {
    base: 'https://egrowacademy.com',
    campaigns: {
      curso_ia: '/courses?utm_source=linkedin&utm_medium=social&utm_campaign=curso_ia',
      recursos_gratuitos: '/resources?utm_source=linkedin&utm_medium=social&utm_campaign=recursos_gratuitos',
      comunidad: '/community?utm_source=linkedin&utm_medium=social&utm_campaign=comunidad',
      newsletter: '/?utm_source=linkedin&utm_medium=social&utm_campaign=newsletter',
    }
  }
};

// Función para generar URLs de tracking
export const generateSocialTrackingUrl = (
  platform: keyof typeof SOCIAL_TRACKING_URLS,
  campaign: string,
  additionalParams?: Record<string, string>
): string => {
  const platformConfig = SOCIAL_TRACKING_URLS[platform];
  const baseUrl = platformConfig.base;
  const campaignUrl = platformConfig.campaigns[campaign as keyof typeof platformConfig.campaigns];
  
  if (!campaignUrl) {
    console.warn(`Campaign "${campaign}" not found for platform "${platform}"`);
    return baseUrl;
  }

  let url = `${baseUrl}${campaignUrl}`;
  
  // Agregar parámetros adicionales
  if (additionalParams) {
    const params = new URLSearchParams(additionalParams);
    url += `&${params.toString()}`;
  }

  return url;
};

// Función para trackear eventos de redes sociales
export const trackSocialMediaEvent = (
  eventType: 'social_click' | 'social_impression' | 'social_conversion',
  data: SocialTrackingData
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventType, {
      // Parámetros estándar de GA4
      event_category: 'social_media',
      event_label: `${data.platform}_${data.campaign}`,
      
      // Parámetros personalizados
      social_platform: data.platform,
      social_campaign: data.campaign,
      social_content_type: data.content_type,
      social_post_id: data.post_id,
      session_id: data.session_id,
      user_id: data.user_id,
      referrer: data.referrer,
      
      // Parámetros adicionales para análisis
      custom_parameter_1: data.platform,
      custom_parameter_2: data.campaign,
      custom_parameter_3: data.content_type,
    });

    console.log(`📱 [Social Tracking] Evento enviado: ${eventType}`, data);
  } else {
    console.warn('Google Analytics no está disponible para social tracking');
  }
};

// Función para trackear conversiones desde redes sociales
export const trackSocialConversion = (
  data: SocialTrackingData & {
    conversion_type: 'registration' | 'course_enrollment' | 'newsletter_signup' | 'resource_download';
    value?: number;
    currency?: string;
  }
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Evento de conversión estándar
    window.gtag('event', 'social_conversion', {
      event_category: 'social_media',
      event_label: `${data.platform}_${data.campaign}_${data.conversion_type}`,
      value: data.value,
      currency: data.currency || 'USD',
      
      // Parámetros personalizados
      social_platform: data.platform,
      social_campaign: data.campaign,
      social_content_type: data.content_type,
      conversion_type: data.conversion_type,
      social_post_id: data.post_id,
      session_id: data.session_id,
      user_id: data.user_id,
    });

    console.log(`💰 [Social Conversion] Conversión registrada desde ${data.platform}`, data);
  }
};

// Función para detectar tráfico de redes sociales
export const detectSocialTraffic = (): SocialTrackingData | null => {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');

  if (utmSource && utmMedium === 'social' && utmCampaign) {
    return {
      platform: utmSource as SocialTrackingData['platform'],
      campaign: utmCampaign,
      content_type: 'post', // Por defecto
      session_id: sessionStorage.getItem('session_id') || undefined,
      user_id: localStorage.getItem('user_id') || undefined,
      referrer: document.referrer,
    };
  }

  return null;
};

// Función para inicializar tracking de redes sociales
export const initializeSocialTracking = () => {
  if (typeof window === 'undefined') return;

  // Detectar si el usuario viene de redes sociales
  const socialData = detectSocialTraffic();
  
  if (socialData) {
    // Trackear impresión desde red social
    trackSocialMediaEvent('social_impression', socialData);
    
    // Guardar datos en sessionStorage para tracking posterior
    sessionStorage.setItem('social_tracking_data', JSON.stringify(socialData));
    
    console.log('📱 [Social Tracking] Usuario detectado desde', socialData.platform);
  }
};

// Función para obtener URLs de tracking para diferentes campañas
export const getSocialTrackingUrls = (platform: keyof typeof SOCIAL_TRACKING_URLS) => {
  const platformConfig = SOCIAL_TRACKING_URLS[platform];
  const urls: Record<string, string> = {};
  
  Object.entries(platformConfig.campaigns).forEach(([campaign, url]) => {
    urls[campaign] = `${platformConfig.base}${url}`;
  });
  
  return urls;
};

// URLs UTM específicas para la campaña "Monetiza tu Voz con IA"
export const COURSE_LAUNCH_UTM_URLS = {
  linkedin: {
    curso_principal: '/curso/monetiza-voz-ia-elevenlabs?utm_source=linkedin&utm_medium=cpc&utm_campaign=curso_lanzamiento_2025',
    landing_page: '/curso/monetiza-voz-ia-elevenlabs?utm_source=linkedin&utm_medium=cpc&utm_campaign=curso_lanzamiento_2025&utm_content=landing',
    checkout: '/curso/monetiza-voz-ia-elevenlabs?utm_source=linkedin&utm_medium=cpc&utm_campaign=curso_lanzamiento_2025&utm_content=checkout',
  },
  meta: {
    curso_principal: '/curso/monetiza-voz-ia-elevenlabs?utm_source=meta&utm_medium=paid_social&utm_campaign=curso_lanzamiento_2025',
    landing_page: '/curso/monetiza-voz-ia-elevenlabs?utm_source=meta&utm_medium=paid_social&utm_campaign=curso_lanzamiento_2025&utm_content=landing',
    checkout: '/curso/monetiza-voz-ia-elevenlabs?utm_source=meta&utm_medium=paid_social&utm_campaign=curso_lanzamiento_2025&utm_content=checkout',
  },
  google: {
    curso_principal: '/curso/monetiza-voz-ia-elevenlabs?utm_source=google&utm_medium=cpc&utm_campaign=curso_lanzamiento_2025',
    landing_page: '/curso/monetiza-voz-ia-elevenlabs?utm_source=google&utm_medium=cpc&utm_campaign=curso_lanzamiento_2025&utm_content=landing',
    checkout: '/curso/monetiza-voz-ia-elevenlabs?utm_source=google&utm_medium=cpc&utm_campaign=curso_lanzamiento_2025&utm_content=checkout',
  },
  tiktok: {
    curso_principal: '/curso/monetiza-voz-ia-elevenlabs?utm_source=tiktok&utm_medium=paid_social&utm_campaign=curso_lanzamiento_2025',
    landing_page: '/curso/monetiza-voz-ia-elevenlabs?utm_source=tiktok&utm_medium=paid_social&utm_campaign=curso_lanzamiento_2025&utm_content=landing',
    checkout: '/curso/monetiza-voz-ia-elevenlabs?utm_source=tiktok&utm_medium=paid_social&utm_campaign=curso_lanzamiento_2025&utm_content=checkout',
  },
};

// Función para obtener todas las URLs de la campaña de lanzamiento con UTM
export const getAllCourseLaunchUrls = (): Record<string, Record<string, string>> => {
  const baseUrl = 'https://egrowacademy.com';
  
  const fullUrls: Record<string, Record<string, string>> = {};
  
  Object.entries(COURSE_LAUNCH_UTM_URLS).forEach(([platform, contentTypes]) => {
    fullUrls[platform] = {};
    Object.entries(contentTypes).forEach(([contentType, path]) => {
      fullUrls[platform][contentType] = `${baseUrl}${path}`;
    });
  });
  
  return fullUrls;
};

// Función para generar URL UTM específica para la campaña
export const generateCourseLaunchUrl = (
  platform: keyof typeof COURSE_LAUNCH_UTM_URLS,
  contentType: string,
  additionalParams?: Record<string, string>
): string => {
  const baseUrl = 'https://egrowacademy.com';
  const platformUrls = COURSE_LAUNCH_UTM_URLS[platform];
  const path = platformUrls[contentType as keyof typeof platformUrls];
  
  if (!path) {
    console.warn(`Content type "${contentType}" not found for platform "${platform}"`);
    return baseUrl;
  }
  
  let url = `${baseUrl}${path}`;
  
  // Agregar parámetros adicionales
  if (additionalParams) {
    const params = new URLSearchParams(additionalParams);
    url += `&${params.toString()}`;
  }
  
  return url;
}; 