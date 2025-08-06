/**
 * Facebook Conversions API Configuration
 * 
 * Este archivo maneja la configuración de Facebook Conversions API
 * para mejorar el tracking de eventos y conversiones.
 */

// Token de acceso para Conversions API
export const FACEBOOK_ACCESS_TOKEN = 'EAASn2QJlHvQBPHUZCWrVGv6mrJR1flCZCAs4HWuf1aQvZAmueKTdZAxZCXRaXNamMCeixJjJr56ckEZBvXi7dRKp8Mlhm2ujJiw8GHHQaxL2d2dx2G9PuYKvPZA7hx74AMZClqiCkhuau31M5yX5ZByeylIuKwt66M7bdamC7ZConWHSSzCxCknaKOXn51neJ7ozpVsQZDZD';

// Endpoint de Conversions API
export const CONVERSIONS_API_ENDPOINT = 'https://graph.facebook.com/v18.0/events';

// Tipos de eventos soportados
export type FacebookEventType = 
  | 'PageView'
  | 'ViewContent'
  | 'Lead'
  | 'Purchase'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'CompleteRegistration'
  | 'CustomEvent';

// Interfaz para datos de evento
export interface FacebookEventData {
  content_name?: string;
  content_category?: string;
  content_type?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
  custom_parameters?: Record<string, any>;
}

// Interfaz para el payload de Conversions API
export interface ConversionsApiPayload {
  data: Array<{
    event_name: string;
    event_time: number;
    action_source: string;
    event_source_url: string;
    user_data: {
      client_ip_address?: string;
      client_user_agent?: string;
      em?: string;
      ph?: string;
      external_id?: string;
    };
    custom_data?: Record<string, any>;
  }>;
  access_token: string;
  test_event_code?: string;
}

/**
 * Envía evento a Facebook Conversions API
 */
export async function sendFacebookConversionEvent(
  eventName: FacebookEventType,
  eventData: FacebookEventData = {},
  userData: {
    email?: string;
    phone?: string;
    externalId?: string;
  } = {}
): Promise<boolean> {
  try {
    // Verificar si estamos en desarrollo y deshabilitar en modo dev si es necesario
    if (process.env.NODE_ENV === 'development' && !process.env.ENABLE_FACEBOOK_CONVERSIONS_DEV) {
      console.log('🔧 [Conversions API] Deshabilitado en desarrollo');
      return true;
    }

    // Validar que tenemos el token de acceso
    if (!FACEBOOK_ACCESS_TOKEN || FACEBOOK_ACCESS_TOKEN === '') {
      console.warn('⚠️ [Conversions API] Token de acceso no configurado');
      return false;
    }

    const payload: ConversionsApiPayload = {
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: typeof window !== 'undefined' ? window.location.href : '',
        user_data: {
          client_user_agent: typeof window !== 'undefined' ? navigator.userAgent : '',
          em: userData.email ? hashEmail(userData.email) : undefined,
          ph: userData.phone ? hashPhone(userData.phone) : undefined,
          external_id: userData.externalId
        },
        custom_data: {
          content_name: eventData.content_name,
          content_category: eventData.content_category,
          content_type: eventData.content_type,
          content_ids: eventData.content_ids,
          value: eventData.value,
          currency: eventData.currency || 'USD',
          ...eventData.custom_parameters
        }
      }],
      access_token: FACEBOOK_ACCESS_TOKEN
    };

    console.log('📊 [Conversions API] Enviando evento:', {
      eventName,
      eventData,
      userData: { ...userData, email: userData.email ? '[REDACTED]' : undefined }
    });

    const response = await fetch(CONVERSIONS_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [Conversions API] Error HTTP:', response.status, errorText);
      return false;
    }

    const result = await response.json();

    // Verificar si el resultado está vacío o tiene errores
    if (!result || Object.keys(result).length === 0) {
      console.error('❌ [Conversions API] Respuesta vacía del servidor');
      return false;
    }

    if (result.error) {
      console.error('❌ [Conversions API] Error en respuesta:', result.error);
      return false;
    }

    console.log('✅ [Conversions API] Evento enviado correctamente:', result);
    return true;
    
  } catch (error) {
    console.error('❌ [Conversions API] Error de red o parsing:', error);
    return false;
  }
}

/**
 * Función para hashear email (requerido por Facebook)
 */
function hashEmail(email: string): string {
  // En producción, usar una función de hash real
  return btoa(email.toLowerCase().trim());
}

/**
 * Función para hashear teléfono (requerido por Facebook)
 */
function hashPhone(phone: string): string {
  // En producción, usar una función de hash real
  return btoa(phone.replace(/\D/g, ''));
}

/**
 * Eventos específicos para webinar
 */
export const webinarEvents = {
  /**
   * Registro de webinar
   */
  async trackWebinarRegistration(webinarId: string, webinarName: string, userEmail?: string) {
    return await sendFacebookConversionEvent('CompleteRegistration', {
      content_name: webinarName,
      content_category: 'Webinar',
      content_type: 'webinar_registration',
      content_ids: [webinarId],
      custom_parameters: {
        webinar_id: webinarId,
        webinar_name: webinarName,
        event_type: 'webinar_registration'
      }
    }, {
      email: userEmail
    });
  },

  /**
   * Visualización de página de webinar
   */
  async trackWebinarPageView(webinarId: string, webinarName: string) {
    return await sendFacebookConversionEvent('ViewContent', {
      content_name: webinarName,
      content_category: 'Webinar',
      content_type: 'webinar_page_view',
      content_ids: [webinarId],
      custom_parameters: {
        webinar_id: webinarId,
        webinar_name: webinarName,
        event_type: 'webinar_page_view'
      }
    });
  },

  /**
   * Lead generado desde webinar
   */
  async trackWebinarLead(webinarId: string, webinarName: string, userEmail?: string) {
    return await sendFacebookConversionEvent('Lead', {
      content_name: webinarName,
      content_category: 'Webinar',
      content_type: 'webinar_lead',
      content_ids: [webinarId],
      custom_parameters: {
        webinar_id: webinarId,
        webinar_name: webinarName,
        event_type: 'webinar_lead'
      }
    }, {
      email: userEmail
    });
  }
};

/**
 * Hook para usar Conversions API en componentes React
 */
export function useFacebookConversions() {
  return {
    sendEvent: sendFacebookConversionEvent,
    webinarEvents
  };
} 