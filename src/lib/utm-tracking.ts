// Sistema de Tracking UTM para GA4 - eGrow Academy

export interface UTMData {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

export interface UTMConversionData {
  conversion_type: 'course_view' | 'course_enroll' | 'payment' | 'newsletter_signup';
  value?: number;
  currency?: string;
  course_id?: string;
  course_name?: string;
  user_id?: string;
  session_id?: string;
}

// Función para extraer parámetros UTM de la URL
export const extractUTMParams = (): UTMData => {
  if (typeof window === 'undefined') {
    return {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
    };
  }

  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_content: urlParams.get('utm_content'),
    utm_term: urlParams.get('utm_term'),
  };
};

// Función para trackear evento UTM en GA4
export const trackUTMEvent = (
  eventName: string,
  utmData: UTMData,
  additionalParams: Record<string, any> = {}
) => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('Google Analytics no está disponible');
    return;
  }

  // Parámetros base del evento
  const eventParams = {
    event_category: 'utm_tracking',
    event_label: `${utmData.utm_source}_${utmData.utm_campaign}`,
    
    // Parámetros UTM
    utm_source: utmData.utm_source,
    utm_medium: utmData.utm_medium,
    utm_campaign: utmData.utm_campaign,
    utm_content: utmData.utm_content,
    utm_term: utmData.utm_term,
    
    // Parámetros adicionales
    ...additionalParams,
  };

  // Enviar evento a GA4
  window.gtag('event', eventName, eventParams);
  
  console.log(`📊 [GA4 UTM] Evento enviado: ${eventName}`, eventParams);
};

// Función para trackear conversión UTM
export const trackUTMConversion = (
  conversionData: UTMConversionData,
  utmData: UTMData
) => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('Google Analytics no está disponible');
    return;
  }

  // Parámetros de conversión
  const conversionParams = {
    event_category: 'utm_conversion',
    event_label: `${utmData.utm_source}_${utmData.utm_campaign}_${conversionData.conversion_type}`,
    
    // Parámetros UTM
    utm_source: utmData.utm_source,
    utm_medium: utmData.utm_medium,
    utm_campaign: utmData.utm_campaign,
    utm_content: utmData.utm_content,
    utm_term: utmData.utm_term,
    
    // Parámetros de conversión
    conversion_type: conversionData.conversion_type,
    course_id: conversionData.course_id,
    course_name: conversionData.course_name,
    user_id: conversionData.user_id,
    session_id: conversionData.session_id,
    
    // Parámetros de valor (para ecommerce)
    ...(conversionData.value && { value: conversionData.value }),
    ...(conversionData.currency && { currency: conversionData.currency }),
  };

  // Enviar evento de conversión
  window.gtag('event', 'utm_conversion', conversionParams);
  
  // Si hay valor, enviar también evento de compra
  if (conversionData.value) {
    window.gtag('event', 'purchase', {
      transaction_id: `utm_${Date.now()}`,
      value: conversionData.value,
      currency: conversionData.currency || 'USD',
      items: [{
        item_id: conversionData.course_id || 'course',
        item_name: conversionData.course_name || 'Curso',
        item_category: 'course',
        price: conversionData.value,
        quantity: 1,
      }],
      // Parámetros UTM para análisis
      custom_parameter_1: utmData.utm_source,
      custom_parameter_2: utmData.utm_campaign,
      custom_parameter_3: utmData.utm_medium,
    });
  }
  
  console.log(`💰 [GA4 UTM] Conversión trackeada: ${conversionData.conversion_type}`, conversionParams);
};

// Función para trackear impresión de página con UTM
export const trackUTMPageView = (utmData: UTMData) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  // Configurar página con parámetros UTM
  window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    
    // Parámetros UTM personalizados
    custom_map: {
      'custom_parameter_1': 'utm_source',
      'custom_parameter_2': 'utm_medium',
      'custom_parameter_3': 'utm_campaign',
      'custom_parameter_4': 'utm_content',
      'custom_parameter_5': 'utm_term',
    },
    
    // Valores de parámetros UTM
    custom_parameter_1: utmData.utm_source,
    custom_parameter_2: utmData.utm_medium,
    custom_parameter_3: utmData.utm_campaign,
    custom_parameter_4: utmData.utm_content,
    custom_parameter_5: utmData.utm_term,
  });

  // Trackear evento de impresión UTM
  trackUTMEvent('utm_pageview', utmData, {
    page_title: document.title,
    page_url: window.location.href,
    referrer: document.referrer,
  });
};

// Función para inicializar tracking UTM
export const initializeUTMTracking = () => {
  if (typeof window === 'undefined') return;

  const utmData = extractUTMParams();
  
  // Solo trackear si hay parámetros UTM
  if (utmData.utm_source || utmData.utm_campaign) {
    console.log('📊 [UTM Tracking] Parámetros detectados:', utmData);
    
    // Trackear impresión de página
    trackUTMPageView(utmData);
    
    // Guardar en sessionStorage para tracking posterior
    sessionStorage.setItem('utm_data', JSON.stringify(utmData));
    
    // Trackear evento de llegada UTM
    trackUTMEvent('utm_arrival', utmData, {
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  }
};

// Función para obtener datos UTM guardados
export const getStoredUTMData = (): UTMData | null => {
  if (typeof window === 'undefined') return null;
  
  const stored = sessionStorage.getItem('utm_data');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing stored UTM data:', error);
    }
  }
  
  return null;
};

// Función para limpiar datos UTM
export const clearUTMData = () => {
  if (typeof window === 'undefined') return;
  
  sessionStorage.removeItem('utm_data');
  console.log('🧹 [UTM Tracking] Datos UTM limpiados');
};