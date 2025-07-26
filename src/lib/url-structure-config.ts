// URL Structure Configuration - eGrow Academy
// Optimizado para SEO y navegación intuitiva

export interface URLConfig {
  pattern: string;
  template: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastmod?: string;
}

export interface CanonicalURL {
  url: string;
  canonical: string;
  redirect?: string;
}

// Configuración de estructura de URLs SEO-friendly
export const urlStructureConfig = {
  // URLs principales
  home: {
    pattern: '/',
    template: '/',
    priority: 1.0,
    changefreq: 'daily' as const,
  },

  // Cursos
  courses: {
    pattern: '/cursos',
    template: '/cursos',
    priority: 0.9,
    changefreq: 'weekly' as const,
  },

  courseDetail: {
    pattern: '/curso/[slug]',
    template: '/curso/{slug}',
    priority: 0.8,
    changefreq: 'weekly' as const,
  },

  // Categorías
  categories: {
    pattern: '/categorias',
    template: '/categorias',
    priority: 0.8,
    changefreq: 'weekly' as const,
  },

  categoryDetail: {
    pattern: '/categoria/[slug]',
    template: '/categoria/{slug}',
    priority: 0.7,
    changefreq: 'weekly' as const,
  },

  // Instructores
  instructors: {
    pattern: '/instructores',
    template: '/instructores',
    priority: 0.8,
    changefreq: 'monthly' as const,
  },

  instructorDetail: {
    pattern: '/instructor/[slug]',
    template: '/instructor/{slug}',
    priority: 0.7,
    changefreq: 'monthly' as const,
  },

  // Blog
  blog: {
    pattern: '/blog',
    template: '/blog',
    priority: 0.8,
    changefreq: 'daily' as const,
  },

  blogPost: {
    pattern: '/blog/[slug]',
    template: '/blog/{slug}',
    priority: 0.7,
    changefreq: 'monthly' as const,
  },

  // Eventos
  events: {
    pattern: '/eventos',
    template: '/eventos',
    priority: 0.8,
    changefreq: 'weekly' as const,
  },

  eventDetail: {
    pattern: '/evento/[slug]',
    template: '/evento/{slug}',
    priority: 0.7,
    changefreq: 'weekly' as const,
  },

  // Páginas estáticas
  about: {
    pattern: '/sobre-nosotros',
    template: '/sobre-nosotros',
    priority: 0.6,
    changefreq: 'monthly' as const,
  },

  contact: {
    pattern: '/contacto',
    template: '/contacto',
    priority: 0.6,
    changefreq: 'monthly' as const,
  },

  pricing: {
    pattern: '/precios',
    template: '/precios',
    priority: 0.7,
    changefreq: 'monthly' as const,
  },

  testimonials: {
    pattern: '/testimonios',
    template: '/testimonios',
    priority: 0.6,
    changefreq: 'weekly' as const,
  },
};

// Generador de URLs SEO-friendly
export const generateSEOURL = (type: keyof typeof urlStructureConfig, params?: Record<string, string>): string => {
  const config = urlStructureConfig[type];
  if (!config) {
    throw new Error(`URL type "${type}" not found`);
  }

  let url = config.template;

  // Reemplazar parámetros en la plantilla
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value);
    });
  }

  return url;
};

// Generador de slug SEO-friendly
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .replace(/^-|-$/g, ''); // Remover guiones al inicio y final
};

// Validador de URLs
export const validateURL = (url: string): boolean => {
  const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(url);
};

// Configuración de redirecciones
export const redirectConfig: Record<string, string> = {
  // Redirecciones de URLs antiguas a nuevas
  '/courses': '/cursos',
  '/course': '/curso',
  '/category': '/categoria',
  '/categories': '/categorias',
  '/teacher': '/instructor',
  '/teachers': '/instructores',
  '/post': '/blog',
  '/article': '/blog',
  '/webinar': '/evento',
  '/workshop': '/evento',
  '/about': '/sobre-nosotros',
  '/contact': '/contacto',
  '/price': '/precios',
  '/pricing': '/precios',
  '/testimonial': '/testimonios',
  '/reviews': '/testimonios',
};

// Configuración de URLs canónicas
export const canonicalURLs: CanonicalURL[] = [
  // URLs que deben redirigir a su versión canónica
  {
    url: '/cursos/',
    canonical: '/cursos',
  },
  {
    url: '/blog/',
    canonical: '/blog',
  },
  {
    url: '/eventos/',
    canonical: '/eventos',
  },
  {
    url: '/instructores/',
    canonical: '/instructores',
  },
  {
    url: '/categorias/',
    canonical: '/categorias',
  },
];

// Generador de URLs para sitemap
export const generateSitemapURLs = () => {
  const urls: Array<{
    url: string;
    lastmod: string;
    changefreq: string;
    priority: number;
  }> = [];

  // Agregar URLs principales
  Object.entries(urlStructureConfig).forEach(([key, config]) => {
    urls.push({
      url: `https://egrow-academy.com${config.template}`,
      lastmod: new Date().toISOString(),
      changefreq: config.changefreq,
      priority: config.priority,
    });
  });

  return urls;
};

// Utilidades para URLs
export const urlUtils = {
  // Obtener URL canónica
  getCanonicalURL: (pathname: string): string => {
    const canonical = canonicalURLs.find(item => item.url === pathname);
    return canonical ? canonical.canonical : pathname;
  },

  // Verificar si una URL necesita redirección
  needsRedirect: (pathname: string): string | null => {
    return redirectConfig[pathname] || null;
  },

  // Generar URL completa
  getFullURL: (path: string): string => {
    return `https://egrow-academy.com${path}`;
  },

  // Validar slug de curso
  validateCourseSlug: (slug: string): boolean => {
    const slugPattern = /^[a-z0-9-]+$/;
    return slugPattern.test(slug) && slug.length >= 3 && slug.length <= 100;
  },

  // Limpiar URL de parámetros innecesarios
  cleanURL: (url: string): string => {
    return url.split('?')[0].split('#')[0];
  },
}; 