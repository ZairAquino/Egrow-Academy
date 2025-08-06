// Facebook Analytics Service para eGrow Academy
import { trackFacebookPixelEvent } from './facebook-pixel';

// Tipos de métricas
export interface FacebookAnalyticsMetrics {
  pageViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  engagementRate: number;
  revenue: number;
  topPages: Array<{ page: string; views: number }>;
  topEvents: Array<{ event: string; count: number }>;
  userJourney: Array<{ step: string; users: number; conversion: number }>;
  demographics?: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    devices: Record<string, number>;
  };
}

// Tipos de eventos para tracking
export interface FacebookEventData {
  eventName: string;
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  customParameters?: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  pageUrl: string;
  referrer?: string;
  userAgent?: string;
}

// Clase principal de Facebook Analytics
export class FacebookAnalytics {
  private events: FacebookEventData[] = [];
  private sessionData: Map<string, any> = new Map();
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window !== 'undefined') {
      this.isInitialized = true;
      this.setupEventListeners();
      console.log('📊 Facebook Analytics inicializado');
    }
  }

  private setupEventListeners() {
    // Trackear clicks en elementos importantes
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      this.trackClickEvent(target);
    });

    // Trackear scroll para engagement
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackScrollEngagement();
      }, 1000);
    });

    // Trackear tiempo en página
    this.trackTimeOnPage();
  }

  private trackClickEvent(element: HTMLElement) {
    const eventData: Partial<FacebookEventData> = {
      eventName: 'click',
      eventCategory: 'engagement',
      eventAction: 'click',
      pageUrl: window.location.href,
      timestamp: new Date(),
      userAgent: navigator.userAgent
    };

    // Identificar tipo de elemento clickeado
    if (element.tagName === 'A' || element.closest('a')) {
      const link = element.tagName === 'A' ? element : element.closest('a') as HTMLAnchorElement;
      eventData.eventLabel = link.href;
      eventData.eventCategory = 'navigation';
      
      // Trackear clicks en CTAs específicos
      if (link.textContent?.toLowerCase().includes('curso') || link.href.includes('/curso')) {
        eventData.eventCategory = 'course_click';
        this.trackFacebookEvent('ViewContent', {
          content_name: 'Course Click',
          content_category: 'Course',
          content_type: 'course_click',
          custom_parameters: {
            link_url: link.href,
            link_text: link.textContent?.trim()
          }
        });
      }

      if (link.textContent?.toLowerCase().includes('registro') || link.href.includes('/register')) {
        eventData.eventCategory = 'registration_click';
        this.trackFacebookEvent('Lead', {
          content_name: 'Registration Click',
          content_category: 'Registration',
          content_type: 'registration_click',
          custom_parameters: {
            link_url: link.href,
            link_text: link.textContent?.trim()
          }
        });
      }

      if (link.textContent?.toLowerCase().includes('login') || link.href.includes('/login')) {
        eventData.eventCategory = 'login_click';
        this.trackFacebookEvent('CustomEvent', {
          content_name: 'Login Click',
          content_category: 'Authentication',
          content_type: 'login_click',
          custom_parameters: {
            link_url: link.href,
            link_text: link.textContent?.trim()
          }
        });
      }
    }

    // Trackear clicks en botones
    if (element.tagName === 'BUTTON' || element.closest('button')) {
      const button = element.tagName === 'BUTTON' ? element : element.closest('button') as HTMLButtonElement;
      eventData.eventLabel = button.textContent?.trim();
      eventData.eventCategory = 'button_click';
      
      // Identificar tipo de botón
      if (button.textContent?.toLowerCase().includes('comprar') || button.textContent?.toLowerCase().includes('pagar')) {
        eventData.eventCategory = 'purchase_click';
        this.trackFacebookEvent('AddToCart', {
          content_name: 'Purchase Button Click',
          content_category: 'Purchase',
          content_type: 'purchase_click',
          custom_parameters: {
            button_text: button.textContent?.trim()
          }
        });
      }
    }

    this.recordEvent(eventData as FacebookEventData);
  }

  private trackScrollEngagement() {
    const scrollPercentage = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercentage > 25 && scrollPercentage <= 50) {
      this.trackFacebookEvent('CustomEvent', {
        content_name: 'Scroll Engagement 25%',
        content_category: 'Engagement',
        content_type: 'scroll_engagement',
        custom_parameters: {
          scroll_percentage: 25
        }
      });
    } else if (scrollPercentage > 50 && scrollPercentage <= 75) {
      this.trackFacebookEvent('CustomEvent', {
        content_name: 'Scroll Engagement 50%',
        content_category: 'Engagement',
        content_type: 'scroll_engagement',
        custom_parameters: {
          scroll_percentage: 50
        }
      });
    } else if (scrollPercentage > 75) {
      this.trackFacebookEvent('CustomEvent', {
        content_name: 'Scroll Engagement 75%',
        content_category: 'Engagement',
        content_type: 'scroll_engagement',
        custom_parameters: {
          scroll_percentage: 75
        }
      });
    }
  }

  private trackTimeOnPage() {
    let startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      
      if (timeSpent > 30) {
        this.trackFacebookEvent('CustomEvent', {
          content_name: 'Time on Page 30s+',
          content_category: 'Engagement',
          content_type: 'time_on_page',
          custom_parameters: {
            time_spent_seconds: timeSpent
          }
        });
      }
    });
  }

  private trackFacebookEvent(eventType: string, data: any) {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventType, data);
      console.log(`📊 [Facebook Analytics] Evento enviado: ${eventType}`, data);
    }
  }

  private recordEvent(eventData: FacebookEventData) {
    this.events.push(eventData);
    
    // Limitar el número de eventos en memoria
    if (this.events.length > 1000) {
      this.events = this.events.slice(-500);
    }
  }

  // Métodos públicos para tracking manual
  public trackPageView(pageName: string, customData?: Record<string, any>) {
    const eventData: FacebookEventData = {
      eventName: 'page_view',
      eventCategory: 'page',
      eventAction: 'view',
      eventLabel: pageName,
      pageUrl: window.location.href,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      customParameters: customData
    };

    this.recordEvent(eventData);
    this.trackFacebookEvent('PageView', {
      content_name: pageName,
      content_category: 'Page',
      content_type: 'page_view',
      custom_parameters: customData
    });
  }

  public trackConversion(conversionType: string, value?: number, currency = 'USD') {
    const eventData: FacebookEventData = {
      eventName: 'conversion',
      eventCategory: 'conversion',
      eventAction: conversionType,
      eventValue: value,
      pageUrl: window.location.href,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      customParameters: {
        conversion_type: conversionType,
        currency: currency
      }
    };

    this.recordEvent(eventData);
    this.trackFacebookEvent('Purchase', {
      content_name: `Conversion: ${conversionType}`,
      content_category: 'Conversion',
      content_type: 'conversion',
      value: value,
      currency: currency,
      custom_parameters: {
        conversion_type: conversionType
      }
    });
  }

  public trackEngagement(engagementType: string, customData?: Record<string, any>) {
    const eventData: FacebookEventData = {
      eventName: 'engagement',
      eventCategory: 'engagement',
      eventAction: engagementType,
      pageUrl: window.location.href,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      customParameters: customData
    };

    this.recordEvent(eventData);
    this.trackFacebookEvent('CustomEvent', {
      content_name: `Engagement: ${engagementType}`,
      content_category: 'Engagement',
      content_type: 'engagement',
      custom_parameters: {
        engagement_type: engagementType,
        ...customData
      }
    });
  }

  // Métodos para obtener estadísticas
  public getMetrics(): FacebookAnalyticsMetrics {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // Filtrar eventos de las últimas 24 horas
    const recentEvents = this.events.filter(event => event.timestamp > last24Hours);
    
    // Calcular métricas básicas
    const pageViews = recentEvents.filter(e => e.eventName === 'page_view').length;
    const uniqueVisitors = this.getUniqueVisitors(recentEvents);
    const conversions = recentEvents.filter(e => e.eventCategory === 'conversion').length;
    const engagementEvents = recentEvents.filter(e => e.eventCategory === 'engagement').length;
    
    // Calcular páginas más visitadas
    const pageViewsByPage = recentEvents
      .filter(e => e.eventName === 'page_view')
      .reduce((acc, event) => {
        const page = event.eventLabel || 'Unknown';
        acc[page] = (acc[page] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    const topPages = Object.entries(pageViewsByPage)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Calcular eventos más frecuentes
    const eventCounts = recentEvents.reduce((acc, event) => {
      const eventKey = `${event.eventCategory}_${event.eventAction}`;
      acc[eventKey] = (acc[eventKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topEvents = Object.entries(eventCounts)
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calcular funnel de conversión
    const userJourney = this.calculateUserJourney(recentEvents);

    return {
      pageViews,
      uniqueVisitors,
      conversionRate: pageViews > 0 ? (conversions / pageViews) * 100 : 0,
      engagementRate: pageViews > 0 ? (engagementEvents / pageViews) * 100 : 0,
      revenue: this.calculateRevenue(recentEvents),
      topPages,
      topEvents,
      userJourney
    };
  }

  private getUniqueVisitors(events: FacebookEventData[]): number {
    const uniqueSessions = new Set();
    events.forEach(event => {
      if (event.sessionId) {
        uniqueSessions.add(event.sessionId);
      }
    });
    return uniqueSessions.size;
  }

  private calculateRevenue(events: FacebookEventData[]): number {
    return events
      .filter(e => e.eventValue)
      .reduce((total, event) => total + (event.eventValue || 0), 0);
  }

  private calculateUserJourney(events: FacebookEventData[]): Array<{ step: string; users: number; conversion: number }> {
    const steps = [
      { name: 'Page View', eventName: 'page_view' },
      { name: 'Engagement', eventName: 'engagement' },
      { name: 'Course Click', eventCategory: 'course_click' },
      { name: 'Registration Click', eventCategory: 'registration_click' },
      { name: 'Purchase Click', eventCategory: 'purchase_click' },
      { name: 'Conversion', eventCategory: 'conversion' }
    ];

    return steps.map(step => {
      const stepEvents = events.filter(e => 
        (step.eventName && e.eventName === step.eventName) ||
        (step.eventCategory && e.eventCategory === step.eventCategory)
      );
      
      const users = stepEvents.length;
      const conversion = step.name === 'Conversion' ? users : 0;
      
      return { step: step.name, users, conversion };
    });
  }

  // Método para exportar datos
  public exportData(): string {
    return JSON.stringify({
      metrics: this.getMetrics(),
      events: this.events.slice(-100), // Últimos 100 eventos
      timestamp: new Date().toISOString()
    }, null, 2);
  }

  // Método para limpiar datos antiguos
  public cleanup() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp > oneWeekAgo);
  }
}

// Instancia global
export const facebookAnalytics = new FacebookAnalytics(); 