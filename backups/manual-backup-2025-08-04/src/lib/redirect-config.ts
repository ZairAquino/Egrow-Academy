// Configuración de redirecciones para SEO - eGrow Academy
// Evita errores 404 y mejora la experiencia del usuario

export interface RedirectRule {
  from: string;
  to: string;
  type: 'permanent' | 'temporary';
  priority: number;
}

export interface SEORedirect {
  pattern: string;
  destination: string;
  statusCode: 301 | 302;
  description: string;
}

// Redirecciones permanentes (301) para SEO
export const permanentRedirects: SEORedirect[] = [
  {
    pattern: '/cursos',
    destination: '/courses',
    statusCode: 301,
    description: 'Redirección de /cursos a /courses'
  },
  {
    pattern: '/curso',
    destination: '/courses',
    statusCode: 301,
    description: 'Redirección de /curso a /courses'
  },
  {
    pattern: '/blog',
    destination: '/community',
    statusCode: 301,
    description: 'Redirección de /blog a /community'
  },
  {
    pattern: '/eventos',
    destination: '/community',
    statusCode: 301,
    description: 'Redirección de /eventos a /community'
  },
  {
    pattern: '/instructores',
    destination: '/courses',
    statusCode: 301,
    description: 'Redirección de /instructores a /courses'
  },
  {
    pattern: '/categorias',
    destination: '/courses',
    statusCode: 301,
    description: 'Redirección de /categorias a /courses'
  },
  {
    pattern: '/about',
    destination: '/',
    statusCode: 301,
    description: 'Redirección de /about a página principal'
  },
  {
    pattern: '/acerca-de',
    destination: '/',
    statusCode: 301,
    description: 'Redirección de /acerca-de a página principal'
  },
  {
    pattern: '/home',
    destination: '/',
    statusCode: 301,
    description: 'Redirección de /home a página principal'
  },
  {
    pattern: '/inicio',
    destination: '/',
    statusCode: 301,
    description: 'Redirección de /inicio a página principal'
  }
];

// Redirecciones temporales (302) para contenido dinámico
export const temporaryRedirects: SEORedirect[] = [
  {
    pattern: '/login',
    destination: '/login',
    statusCode: 302,
    description: 'Página de login'
  },
  {
    pattern: '/register',
    destination: '/register',
    statusCode: 302,
    description: 'Página de registro'
  },
  {
    pattern: '/profile',
    destination: '/profile',
    statusCode: 302,
    description: 'Página de perfil'
  }
];

// URLs que deben devolver 404 intencionalmente
export const intentional404s: string[] = [
  '/admin',
  '/api',
  '/_next',
  '/static',
  '/private',
  '/test',
  '/dev',
  '/staging'
];

// URLs que deben ser ignoradas por el middleware
export const ignoredPaths: string[] = [
  '/api/',
  '/_next/',
  '/static/',
  '/images/',
  '/fonts/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml'
];

// Función para verificar si una URL debe ser redirigida
export const shouldRedirect = (pathname: string): SEORedirect | null => {
  // Verificar redirecciones permanentes
  for (const redirect of permanentRedirects) {
    if (pathname === redirect.pattern || pathname.startsWith(redirect.pattern + '/')) {
      return redirect;
    }
  }

  // Verificar redirecciones temporales
  for (const redirect of temporaryRedirects) {
    if (pathname === redirect.pattern) {
      return redirect;
    }
  }

  return null;
};

// Función para verificar si una URL debe devolver 404 intencionalmente
export const shouldReturn404 = (pathname: string): boolean => {
  return intentional404s.some(pattern => pathname.startsWith(pattern));
};

// Función para verificar si una URL debe ser ignorada
export const shouldIgnore = (pathname: string): boolean => {
  return ignoredPaths.some(pattern => pathname.startsWith(pattern));
};

// Función para limpiar URLs
export const cleanURL = (url: string): string => {
  // Remover múltiples slashes
  let cleaned = url.replace(/\/+/g, '/');
  
  // Remover trailing slash excepto para la raíz
  if (cleaned !== '/' && cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }
  
  // Remover parámetros de query innecesarios
  if (cleaned.includes('?')) {
    const [path, query] = cleaned.split('?');
    const params = new URLSearchParams(query);
    
    // Remover parámetros vacíos o innecesarios
    params.delete('');
    params.delete('undefined');
    params.delete('null');
    
    const cleanParams = params.toString();
    cleaned = cleanParams ? `${path}?${cleanParams}` : path;
  }
  
  return cleaned;
};

// Función para generar URLs canónicas
export const generateCanonicalURL = (pathname: string): string => {
  const baseURL = 'https://egrow-academy.com';
  const cleanPath = cleanURL(pathname);
  return `${baseURL}${cleanPath}`;
};

// Configuración de sitemap para redirecciones
export const sitemapRedirects = [
  {
    url: '/courses',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    url: '/cursos-gratuitos',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    url: '/community',
    priority: 0.8,
    changefreq: 'daily'
  },
  {
    url: '/resources',
    priority: 0.7,
    changefreq: 'weekly'
  },
  {
    url: '/contacto',
    priority: 0.6,
    changefreq: 'monthly'
  }
];

// Función para validar URLs de cursos
export const validateCourseURL = (pathname: string): boolean => {
  const coursePattern = /^\/curso\/[a-z0-9-]+$/;
  return coursePattern.test(pathname);
};

// Función para validar URLs de recursos
export const validateResourceURL = (pathname: string): boolean => {
  const resourcePattern = /^\/resources\/[a-z0-9-]+$/;
  return resourcePattern.test(pathname);
};

// Configuración de headers para redirecciones
export const getRedirectHeaders = (redirect: SEORedirect) => {
  return {
    'Cache-Control': redirect.statusCode === 301 ? 'public, max-age=31536000' : 'no-cache',
    'X-Redirect-Type': redirect.description,
    'X-Redirect-From': redirect.pattern,
    'X-Redirect-To': redirect.destination
  };
}; 