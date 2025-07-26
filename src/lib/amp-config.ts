// AMP Configuration - eGrow Academy
// Optimizado para páginas aceleradas y rendimiento móvil

export interface AMPConfig {
  // Configuración básica de AMP
  enabled: boolean;
  version: string;
  cache: boolean;
  analytics: boolean;
  ads: boolean;
  
  // Configuración de páginas
  pages: {
    home: boolean;
    courses: boolean;
    courseDetail: boolean;
    blog: boolean;
    blogPost: boolean;
    about: boolean;
    contact: boolean;
  };
  
  // Configuración de componentes
  components: {
    ampImg: boolean;
    ampVideo: boolean;
    ampCarousel: boolean;
    ampAccordion: boolean;
    ampForm: boolean;
    ampAnalytics: boolean;
    ampAd: boolean;
    ampSocialShare: boolean;
  };
  
  // Configuración de cache
  cacheConfig: {
    enabled: boolean;
    domains: string[];
    strategy: 'cdn' | 'self' | 'hybrid';
  };
  
  // Configuración de analytics
  analyticsConfig: {
    enabled: boolean;
    providers: {
      google: boolean;
      facebook: boolean;
      custom: boolean;
    };
    events: {
      pageView: boolean;
      scroll: boolean;
      click: boolean;
      formSubmit: boolean;
      videoPlay: boolean;
    };
  };
}

// Configuración principal de AMP
export const ampConfig: AMPConfig = {
  enabled: true,
  version: '0.1',
  cache: true,
  analytics: true,
  ads: false,
  
  // Páginas que tendrán versión AMP
  pages: {
    home: true,
    courses: true,
    courseDetail: true,
    blog: true,
    blogPost: true,
    about: true,
    contact: true,
  },
  
  // Componentes AMP habilitados
  components: {
    ampImg: true,
    ampVideo: true,
    ampCarousel: true,
    ampAccordion: true,
    ampForm: true,
    ampAnalytics: true,
    ampAd: false,
    ampSocialShare: true,
  },
  
  // Configuración de cache AMP
  cacheConfig: {
    enabled: true,
    domains: [
      'https://cdn.ampproject.org',
      'https://amp.cloudflare.com',
      'https://www.google.com',
    ],
    strategy: 'hybrid',
  },
  
  // Configuración de analytics AMP
  analyticsConfig: {
    enabled: true,
    providers: {
      google: true,
      facebook: false,
      custom: true,
    },
    events: {
      pageView: true,
      scroll: true,
      click: true,
      formSubmit: true,
      videoPlay: true,
    },
  },
};

// Configuración de componentes AMP específicos
export const ampComponents = {
  // Configuración de amp-img
  ampImg: {
    layout: 'responsive' as const,
    width: 1200,
    height: 800,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    fallback: true,
    placeholder: true,
  },
  
  // Configuración de amp-video
  ampVideo: {
    layout: 'responsive' as const,
    width: 1280,
    height: 720,
    autoplay: false,
    controls: true,
    poster: true,
  },
  
  // Configuración de amp-carousel
  ampCarousel: {
    layout: 'responsive' as const,
    width: 1200,
    height: 400,
    type: 'slides' as const,
    autoplay: true,
    delay: 5000,
    loop: true,
  },
  
  // Configuración de amp-accordion
  ampAccordion: {
    animate: true,
    expandSingleSection: false,
  },
  
  // Configuración de amp-form
  ampForm: {
    method: 'POST' as const,
    action: '/api/contact',
    target: '_top' as const,
    customValidationReporting: 'show-first-on-submit' as const,
  },
  
  // Configuración de amp-analytics
  ampAnalytics: {
    type: 'gtag' as const,
    config: {
      vars: {
        gtag_id: process.env.NEXT_PUBLIC_GA_ID,
        config: {
          [process.env.NEXT_PUBLIC_GA_ID || '']: {
            groups: 'default',
          },
        },
      },
    },
  },
  
  // Configuración de amp-social-share
  ampSocialShare: {
    type: 'system' as const,
    width: 60,
    height: 44,
  },
};

// Configuración de estilos AMP
export const ampStyles = {
  // Estilos críticos para AMP
  critical: `
    /* Estilos críticos para AMP */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    
    .amp-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .amp-header {
      background: #2563eb;
      color: white;
      padding: 1rem 0;
    }
    
    .amp-hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 0;
      text-align: center;
    }
    
    .amp-course-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
      transition: transform 0.2s;
    }
    
    .amp-course-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .amp-button {
      background: #2563eb;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }
    
    .amp-button:hover {
      background: #1d4ed8;
    }
  `,
  
  // Estilos para componentes específicos
  components: {
    ampImg: `
      amp-img {
        max-width: 100%;
        height: auto;
      }
    `,
    
    ampCarousel: `
      amp-carousel {
        margin: 2rem 0;
      }
      
      amp-carousel .amp-carousel-item {
        padding: 0 10px;
      }
    `,
    
    ampAccordion: `
      amp-accordion {
        margin: 1rem 0;
      }
      
      amp-accordion section {
        border: 1px solid #e5e7eb;
        margin-bottom: 0.5rem;
      }
    `,
    
    ampForm: `
      amp-form {
        margin: 2rem 0;
      }
      
      amp-form input,
      amp-form textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        margin-bottom: 1rem;
      }
    `,
  },
};

// Configuración de validación AMP
export const ampValidation = {
  // Reglas de validación
  rules: {
    // Elementos requeridos
    required: [
      'amp-img',
      'amp-analytics',
      'amp-social-share',
    ],
    
    // Elementos prohibidos
    forbidden: [
      'script',
      'style',
      'link',
      'iframe',
      'object',
      'embed',
      'form',
      'input',
      'textarea',
      'select',
      'button',
    ],
    
    // Atributos requeridos
    requiredAttributes: {
      'amp-img': ['src', 'width', 'height', 'alt'],
      'amp-video': ['src', 'width', 'height'],
      'amp-carousel': ['width', 'height'],
      'amp-accordion': ['width', 'height'],
    },
  },
  
  // Configuración de testing
  testing: {
    enabled: true,
    tools: [
      'amp-validator',
      'google-amp-test',
      'amp-bench',
    ],
    autoValidate: true,
  },
};

// Configuración de cache AMP
export const ampCacheConfig = {
  // URLs de cache AMP
  cacheUrls: {
    google: 'https://cdn.ampproject.org/c/s/',
    cloudflare: 'https://amp.cloudflare.com/c/s/',
    bing: 'https://www.bing-amp.com/c/s/',
  },
  
  // Configuración de transformación
  transform: {
    enabled: true,
    minify: true,
    inline: true,
    optimize: true,
  },
  
  // Configuración de headers
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, max-age=3600',
  },
};

// Utilidades de AMP
export const ampUtils = {
  // Verificar si una página debe tener AMP
  shouldHaveAMP: (pathname: string): boolean => {
    const ampPages = Object.entries(ampConfig.pages)
      .filter(([_, enabled]) => enabled)
      .map(([page]) => page);
    
    return ampPages.some(page => pathname.includes(page));
  },
  
  // Generar URL de cache AMP
  generateCacheURL: (url: string, cacheProvider: 'google' | 'cloudflare' | 'bing' = 'google'): string => {
    const cacheUrl = ampCacheConfig.cacheUrls[cacheProvider];
    return `${cacheUrl}${url}`;
  },
  
  // Generar meta tags AMP
  generateAMPMetaTags: (pageData: any) => {
    return {
      'amp-version': ampConfig.version,
      'amp-cache': ampConfig.cache ? 'enabled' : 'disabled',
      'amp-analytics': ampConfig.analytics ? 'enabled' : 'disabled',
      'amp-ads': ampConfig.ads ? 'enabled' : 'disabled',
    };
  },
  
  // Validar estructura AMP
  validateAMPStructure: (html: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Verificar elementos requeridos
    if (!html.includes('<html amp')) {
      errors.push('Missing amp attribute on html tag');
    }
    
    if (!html.includes('<head>')) {
      errors.push('Missing head tag');
    }
    
    if (!html.includes('<body>')) {
      errors.push('Missing body tag');
    }
    
    // Verificar elementos prohibidos
    const forbiddenElements = ampValidation.rules.forbidden;
    forbiddenElements.forEach(element => {
      if (html.includes(`<${element}`)) {
        errors.push(`Forbidden element found: ${element}`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors,
    };
  },
  
  // Generar CSS crítico para AMP
  generateCriticalCSS: (): string => {
    return ampStyles.critical + Object.values(ampStyles.components).join('\n');
  },
  
  // Configurar analytics AMP
  setupAMPAnalytics: (pageType: string, pageData?: any) => {
    if (!ampConfig.analyticsConfig.enabled) return '';
    
    const config = {
      vars: {
        gtag_id: process.env.NEXT_PUBLIC_GA_ID,
        page_title: pageData?.title || 'eGrow Academy',
        page_location: pageData?.url || (typeof window !== 'undefined' ? window.location.href : 'https://egrow-academy.com'),
        page_type: pageType,
      },
      triggers: {
        trackPageview: {
          on: 'visible',
          request: 'pageview',
        },
        trackScroll: {
          on: 'scroll',
          request: 'event',
          vars: {
            event_category: 'engagement',
            event_label: 'scroll',
          },
        },
        trackClick: {
          on: 'click',
          request: 'event',
          vars: {
            event_category: 'engagement',
            event_label: 'click',
          },
        },
      },
    };
    
    return JSON.stringify(config);
  },
}; 