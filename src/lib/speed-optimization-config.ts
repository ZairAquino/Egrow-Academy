// Speed Optimization Configuration - eGrow Academy
// Optimizado para Core Web Vitals y rendimiento máximo

export interface SpeedConfig {
  // Core Web Vitals targets
  lcp: number; // Largest Contentful Paint (ms)
  fid: number; // First Input Delay (ms)
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint (ms)
  ttfb: number; // Time to First Byte (ms)
}

export interface ResourceConfig {
  type: 'script' | 'style' | 'image' | 'font';
  path: string;
  priority: 'high' | 'medium' | 'low';
  preload: boolean;
  async?: boolean;
  defer?: boolean;
}

// Configuración de objetivos de velocidad
export const speedTargets: SpeedConfig = {
  lcp: 2500, // < 2.5s (Excelente)
  fid: 100,  // < 100ms (Excelente)
  cls: 0.1,  // < 0.1 (Excelente)
  fcp: 1800, // < 1.8s (Excelente)
  ttfb: 600, // < 600ms (Excelente)
};

// Recursos críticos para preload
export const criticalResources: ResourceConfig[] = [
  // CSS crítico
  {
    type: 'style',
    path: '/styles/critical.css',
    priority: 'high',
    preload: true,
  },
  
  // Fuentes críticas
  {
    type: 'font',
    path: '/fonts/inter-var.woff2',
    priority: 'high',
    preload: true,
  },
  
  // Imágenes críticas
  {
    type: 'image',
    path: '/images/optimized/logop.webp',
    priority: 'high',
    preload: true,
  },
  
  // Scripts críticos
  {
    type: 'script',
    path: '/scripts/analytics.js',
    priority: 'medium',
    preload: false,
    async: true,
  },
];

// Configuración de lazy loading
export const lazyLoadingConfig = {
  // Componentes para lazy loading
  components: [
    'WelcomeModal',
    'CourseDetails',
    'InstructorProfile',
    'BlogComments',
    'RelatedCourses',
    'TestimonialsSection',
  ],
  
  // Imágenes para lazy loading
  images: {
    threshold: 0.1, // 10% visible
    rootMargin: '50px',
    placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  },
  
  // Scripts para lazy loading
  scripts: {
    threshold: 0.5, // 50% visible
    rootMargin: '100px',
  },
};

// Configuración de caching
export const cacheConfig = {
  // Headers de cache para diferentes tipos de recursos
  headers: {
    // HTML - Cache corto para actualizaciones
    html: {
      'Cache-Control': 'public, max-age=300, s-maxage=600', // 5min browser, 10min CDN
    },
    
    // CSS/JS - Cache largo para versiones
    assets: {
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 año
    },
    
    // Imágenes - Cache medio
    images: {
      'Cache-Control': 'public, max-age=86400, s-maxage=604800', // 1 día browser, 1 semana CDN
    },
    
    // Fuentes - Cache largo
    fonts: {
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 año
    },
    
    // API - Sin cache
    api: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  },
  
  // Estrategias de cache por ruta
  routes: {
    '/': 'html',
    '/cursos': 'html',
    '/blog': 'html',
    '/api/*': 'api',
    '/_next/static/*': 'assets',
    '/images/*': 'images',
    '/fonts/*': 'fonts',
  },
};

// Configuración de compresión
export const compressionConfig = {
  // Tipos de archivo para comprimir
  compressible: [
    'text/html',
    'text/css',
    'text/javascript',
    'application/javascript',
    'application/json',
    'application/xml',
    'text/xml',
    'text/plain',
    'text/x-component',
    'text/x-js',
    'text/xml+rss',
    'application/atom+xml',
    'application/rss+xml',
    'application/xhtml+xml',
  ],
  
  // Nivel de compresión
  level: 6, // Balance entre velocidad y compresión
  
  // Tamaño mínimo para comprimir
  threshold: 1024, // 1KB
};

// Configuración de bundle splitting
export const bundleConfig = {
  // Chunks principales
  chunks: {
    // Chunk principal (crítico)
    main: {
      name: 'main',
      priority: 'high',
      minSize: 20000,
      maxSize: 244000,
    },
    
    // Chunk de componentes
    components: {
      name: 'components',
      priority: 'medium',
      minSize: 30000,
      maxSize: 244000,
    },
    
    // Chunk de utilidades
    utils: {
      name: 'utils',
      priority: 'low',
      minSize: 20000,
      maxSize: 244000,
    },
    
    // Chunk de vendor (librerías)
    vendor: {
      name: 'vendor',
      priority: 'medium',
      minSize: 50000,
      maxSize: 244000,
    },
  },
  
  // Optimizaciones específicas
  optimizations: {
    // Tree shaking
    treeShaking: true,
    
    // Minificación
    minification: true,
    
    // Dead code elimination
    deadCodeElimination: true,
    
    // Module concatenation
    concatenateModules: true,
  },
};

// Configuración de imágenes optimizadas
export const imageConfig = {
  // Formatos soportados
  formats: ['webp', 'avif', 'jpeg', 'png'],
  
  // Tamaños responsivos
  sizes: {
    thumbnail: '150px',
    small: '300px',
    medium: '600px',
    large: '1200px',
    xlarge: '1920px',
  },
  
  // Calidad por formato
  quality: {
    webp: 85,
    avif: 80,
    jpeg: 85,
    png: 90,
  },
  
  // Configuración de placeholder
  placeholder: {
    blur: true,
    blurDataURL: true,
    shimmer: true,
  },
};

// Configuración de fuentes optimizadas
export const fontConfig = {
  // Fuentes críticas
  critical: [
    {
      family: 'Inter',
      weight: [400, 500, 600, 700],
      display: 'swap',
      preload: true,
    },
  ],
  
  // Fuentes secundarias
  secondary: [
    {
      family: 'Poppins',
      weight: [300, 400, 500],
      display: 'swap',
      preload: false,
    },
  ],
  
  // Configuración de fallback
  fallback: {
    'Inter': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'Poppins': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
};

// Utilidades de optimización
export const speedUtils = {
  // Calcular score de Core Web Vitals
  calculateScore: (metrics: Partial<SpeedConfig>): number => {
    let score = 100;
    
    if (metrics.lcp && metrics.lcp > speedTargets.lcp) {
      score -= Math.min(30, (metrics.lcp - speedTargets.lcp) / 100);
    }
    
    if (metrics.fid && metrics.fid > speedTargets.fid) {
      score -= Math.min(30, (metrics.fid - speedTargets.fid) / 10);
    }
    
    if (metrics.cls && metrics.cls > speedTargets.cls) {
      score -= Math.min(40, metrics.cls * 400);
    }
    
    return Math.max(0, Math.round(score));
  },
  
  // Verificar si un recurso es crítico
  isCriticalResource: (path: string): boolean => {
    return criticalResources.some(resource => resource.path === path);
  },
  
  // Obtener configuración de cache para una ruta
  getCacheConfig: (path: string): Record<string, string> => {
    for (const [pattern, config] of Object.entries(cacheConfig.routes)) {
      if (path.match(new RegExp(pattern.replace('*', '.*')))) {
        return cacheConfig.headers[config as keyof typeof cacheConfig.headers];
      }
    }
    return cacheConfig.headers.html;
  },
  
  // Generar preload tags
  generatePreloadTags: (): string[] => {
    return criticalResources
      .filter(resource => resource.preload)
      .map(resource => {
        const as = resource.type === 'script' ? 'script' : 
                   resource.type === 'style' ? 'style' : 
                   resource.type === 'font' ? 'font' : 'image';
        
        return `<link rel="preload" href="${resource.path}" as="${as}" ${resource.type === 'font' ? 'crossorigin' : ''}>`;
      });
  },
}; 