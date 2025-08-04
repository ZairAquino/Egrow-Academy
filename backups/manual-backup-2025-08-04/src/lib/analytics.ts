// Google Analytics 4 (GA4) Service
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Tipos de eventos de promociones
export type PromotionEventType = 
  | 'promotion_impression'
  | 'promotion_click'
  | 'promotion_close'
  | 'promotion_conversion';

// Interfaz para datos de promoción
export interface PromotionEventData {
  promotion_id: string;
  promotion_title: string;
  promotion_type: 'PREMIUM_SUBSCRIPTION' | 'NEW_COURSE' | 'SPECIAL_OFFER';
  cta_text: string;
  cta_url: string;
  session_id?: string;
  user_id?: string;
  page_url?: string;
  referrer?: string;
  user_agent?: string;
  revenue?: number;
  currency?: string;
}

// Función para enviar eventos a GA4
export const trackPromotionEvent = (
  eventType: PromotionEventType,
  data: PromotionEventData
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Enviar evento a GA4
    window.gtag('event', eventType, {
      // Parámetros estándar de GA4
      event_category: 'promotion',
      event_label: data.promotion_title,
      
      // Parámetros personalizados
      promotion_id: data.promotion_id,
      promotion_title: data.promotion_title,
      promotion_type: data.promotion_type,
      cta_text: data.cta_text,
      cta_url: data.cta_url,
      session_id: data.session_id,
      user_id: data.user_id,
      page_url: data.page_url,
      referrer: data.referrer,
      user_agent: data.user_agent,
      
      // Parámetros de conversión (para revenue tracking)
      ...(data.revenue && { value: data.revenue }),
      ...(data.currency && { currency: data.currency }),
      
      // Parámetros adicionales para análisis
      custom_parameter_1: data.promotion_type,
      custom_parameter_2: data.session_id,
      custom_parameter_3: data.user_id,
    });

    console.log(`📊 [GA4] Evento enviado: ${eventType}`, data);
  } else {
    console.warn('Google Analytics no está disponible');
  }
};

// Función para tracking de conversión con revenue
export const trackPromotionConversion = (
  data: PromotionEventData & { 
    revenue: number; 
    currency?: string;
    plan_type?: 'monthly' | 'yearly';
  }
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Evento de conversión estándar
    window.gtag('event', 'promotion_conversion', {
      event_category: 'promotion',
      event_label: data.promotion_title,
      value: data.revenue,
      currency: data.currency || 'USD',
      
      // Parámetros personalizados
      promotion_id: data.promotion_id,
      promotion_title: data.promotion_title,
      promotion_type: data.promotion_type,
      plan_type: data.plan_type,
      session_id: data.session_id,
      user_id: data.user_id,
    });

    // Evento de compra para ecommerce tracking
    window.gtag('event', 'purchase', {
      transaction_id: `promo_${data.promotion_id}_${Date.now()}`,
      value: data.revenue,
      currency: data.currency || 'USD',
      items: [{
        item_id: data.promotion_id,
        item_name: data.promotion_title,
        item_category: data.promotion_type,
        price: data.revenue,
        quantity: 1
      }]
    });

    console.log(`💰 [GA4] Conversión registrada: $${data.revenue}`, data);
  }
};

// Función para tracking de funnel completo
export const trackPromotionFunnel = (
  step: 'impression' | 'click' | 'conversion',
  data: PromotionEventData
) => {
  const eventMap = {
    impression: 'promotion_impression',
    click: 'promotion_click',
    conversion: 'promotion_conversion'
  };

  trackPromotionEvent(eventMap[step] as PromotionEventType, data);
};

// Función para configurar GA4
export const initializeGA4 = (measurementId: string) => {
  if (typeof window !== 'undefined') {
    // Cargar GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Configurar gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    console.log('✅ Google Analytics 4 inicializado');
  }
}; 