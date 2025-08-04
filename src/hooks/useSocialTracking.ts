import { useEffect, useCallback } from 'react';
import { 
  detectSocialTraffic, 
  trackSocialMediaEvent, 
  trackSocialConversion,
  initializeSocialTracking,
  SocialTrackingData 
} from '@/lib/social-tracking';

export const useSocialTracking = () => {
  // Inicializar tracking al cargar el componente
  useEffect(() => {
    initializeSocialTracking();
  }, []);

  // Función para trackear conversiones
  const trackConversion = useCallback((
    conversionType: 'registration' | 'course_enrollment' | 'newsletter_signup' | 'resource_download',
    value?: number,
    currency?: string
  ) => {
    const socialData = detectSocialTraffic();
    
    if (socialData) {
      trackSocialConversion({
        ...socialData,
        conversion_type: conversionType,
        value,
        currency,
      });
    }
  }, []);

  // Función para trackear clicks en elementos específicos
  const trackSocialClick = useCallback((
    elementId: string,
    elementType: 'button' | 'link' | 'card' | 'form'
  ) => {
    const socialData = detectSocialTraffic();
    
    if (socialData) {
      trackSocialMediaEvent('social_click', {
        ...socialData,
        post_id: elementId,
        content_type: 'post',
      });
    }
  }, []);

  // Función para obtener datos de tracking actuales
  const getCurrentSocialData = useCallback((): SocialTrackingData | null => {
    return detectSocialTraffic();
  }, []);

  // Función para verificar si el usuario viene de redes sociales
  const isFromSocialMedia = useCallback((): boolean => {
    return detectSocialTraffic() !== null;
  }, []);

  // Función para obtener la plataforma de origen
  const getSocialPlatform = useCallback((): string | null => {
    const socialData = detectSocialTraffic();
    return socialData?.platform || null;
  }, []);

  // Función para obtener la campaña actual
  const getCurrentCampaign = useCallback((): string | null => {
    const socialData = detectSocialTraffic();
    return socialData?.campaign || null;
  }, []);

  return {
    trackConversion,
    trackSocialClick,
    getCurrentSocialData,
    isFromSocialMedia,
    getSocialPlatform,
    getCurrentCampaign,
  };
}; 