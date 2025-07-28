// SEO Error Prevention - eGrow Academy
// Previene errores de contenido y mejora la indexación

export interface SEOErrorPrevention {
  checkContent: (content: string) => boolean;
  validateMetaTags: (metaTags: Record<string, string>) => boolean;
  generateFallbackContent: (type: 'title' | 'description' | 'keywords') => string;
  handleEmptyContent: (pathname: string) => string;
}

// Configuración de contenido mínimo requerido
export const minimumContentRequirements = {
  title: {
    minLength: 10,
    maxLength: 60,
    required: true
  },
  description: {
    minLength: 50,
    maxLength: 160,
    required: true
  },
  keywords: {
    minCount: 3,
    maxCount: 10,
    required: true
  }
};

// Contenido de respaldo para diferentes tipos de páginas
export const fallbackContent = {
  home: {
    title: "eGrow Academy - Cursos de Inteligencia Artificial | Líder en México y Latinoamérica",
    description: "Aprende Inteligencia Artificial con los mejores cursos online en español. Formación profesional en IA, Machine Learning, Deep Learning y más. Líder en México y Latinoamérica.",
    keywords: [
      "cursos de inteligencia artificial",
      "cursos de IA",
      "machine learning",
      "deep learning",
      "inteligencia artificial México",
      "cursos de IA en español",
      "formación en inteligencia artificial",
      "aprender IA",
      "cursos online de inteligencia artificial",
      "especialización en IA"
    ]
  },
  courses: {
    title: "Cursos de Inteligencia Artificial - eGrow Academy",
    description: "Explora nuestra colección completa de cursos de Inteligencia Artificial. Desde fundamentos hasta especializaciones avanzadas en IA, Machine Learning y Deep Learning.",
    keywords: [
      "cursos de inteligencia artificial",
      "cursos de IA",
      "machine learning",
      "deep learning",
      "formación en IA",
      "especialización en inteligencia artificial"
    ]
  },
  community: {
    title: "Comunidad eGrow Academy - Conecta con Expertos en IA",
    description: "Únete a nuestra comunidad de estudiantes y expertos en Inteligencia Artificial. Comparte conocimientos, participa en eventos y crece profesionalmente.",
    keywords: [
      "comunidad IA",
      "expertos inteligencia artificial",
      "eventos IA",
      "foro inteligencia artificial",
      "networking IA"
    ]
  },
  resources: {
    title: "Recursos de Inteligencia Artificial - eGrow Academy",
    description: "Biblioteca completa de recursos educativos en Inteligencia Artificial. Libros, papers, herramientas y tutoriales para tu formación en IA.",
    keywords: [
      "recursos IA",
      "biblioteca inteligencia artificial",
      "herramientas IA",
      "papers machine learning",
      "tutoriales deep learning"
    ]
  },
  contact: {
    title: "Contacto - eGrow Academy",
    description: "Contáctanos para resolver tus dudas sobre nuestros cursos de Inteligencia Artificial. Estamos aquí para ayudarte en tu formación en IA.",
    keywords: [
      "contacto eGrow Academy",
      "soporte cursos IA",
      "ayuda inteligencia artificial",
      "consultas formación IA"
    ]
  },
  error: {
    title: "Página no encontrada - eGrow Academy",
    description: "Lo sentimos, la página que buscas no existe. Regresa al inicio de eGrow Academy para encontrar los mejores cursos de Inteligencia Artificial.",
    keywords: [
      "eGrow Academy",
      "cursos de inteligencia artificial",
      "página no encontrada",
      "error 404"
    ]
  }
};

// Función para validar contenido SEO
export const validateSEOContent = (content: string, type: 'title' | 'description' | 'keywords'): boolean => {
  const requirements = minimumContentRequirements[type];
  
  if (!content || content.trim().length === 0) {
    return false;
  }
  
  const length = content.length;
  
  if (type === 'keywords') {
    const keywordArray = content.split(',').map(k => k.trim()).filter(k => k.length > 0);
    return keywordArray.length >= requirements.minCount && keywordArray.length <= requirements.maxCount;
  }
  
  return length >= requirements.minLength && length <= requirements.maxLength;
};

// Función para generar contenido de respaldo
export const generateFallbackContent = (pathname: string, type: 'title' | 'description' | 'keywords'): string => {
  // Determinar el tipo de página basado en la URL
  let pageType = 'home';
  
  if (pathname.startsWith('/courses') || pathname.startsWith('/cursos')) {
    pageType = 'courses';
  } else if (pathname.startsWith('/community')) {
    pageType = 'community';
  } else if (pathname.startsWith('/resources')) {
    pageType = 'resources';
  } else if (pathname.startsWith('/contacto')) {
    pageType = 'contact';
  } else if (pathname === '/404' || pathname === '/not-found') {
    pageType = 'error';
  }
  
  const content = fallbackContent[pageType as keyof typeof fallbackContent];
  
  switch (type) {
    case 'title':
      return content.title;
    case 'description':
      return content.description;
    case 'keywords':
      return content.keywords.join(', ');
    default:
      return '';
  }
};

// Función para manejar contenido vacío o inválido
export const handleEmptyContent = (pathname: string, currentContent: string, type: 'title' | 'description' | 'keywords'): string => {
  if (!validateSEOContent(currentContent, type)) {
    return generateFallbackContent(pathname, type);
  }
  
  return currentContent;
};

// Función para validar meta tags completos
export const validateMetaTags = (metaTags: Record<string, string>): boolean => {
  const requiredTags = ['title', 'description'];
  
  for (const tag of requiredTags) {
    if (!metaTags[tag] || !validateSEOContent(metaTags[tag], tag as 'title' | 'description')) {
      return false;
    }
  }
  
  return true;
};

// Función para generar meta tags de respaldo
export const generateFallbackMetaTags = (pathname: string): Record<string, string> => {
  const pageType = getPageTypeFromPathname(pathname);
  const content = fallbackContent[pageType as keyof typeof fallbackContent];
  
  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords.join(', '),
    'og:title': content.title,
    'og:description': content.description,
    'og:type': 'website',
    'og:url': `https://egrow-academy.com${pathname}`,
    'og:site_name': 'eGrow Academy',
    'twitter:card': 'summary_large_image',
    'twitter:title': content.title,
    'twitter:description': content.description
  };
};

// Función auxiliar para determinar el tipo de página
export const getPageTypeFromPathname = (pathname: string): string => {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/courses') || pathname.startsWith('/cursos')) return 'courses';
  if (pathname.startsWith('/community')) return 'community';
  if (pathname.startsWith('/resources')) return 'resources';
  if (pathname.startsWith('/contacto')) return 'contact';
  if (pathname === '/404' || pathname === '/not-found') return 'error';
  
  return 'home';
};

// Función para verificar si una página tiene contenido válido
export const hasValidContent = (pathname: string, content: any): boolean => {
  // Verificar que el contenido no sea null, undefined o vacío
  if (!content || typeof content !== 'object') {
    return false;
  }
  
  // Verificar que tenga las propiedades mínimas requeridas
  const requiredProperties = ['title', 'description'];
  for (const prop of requiredProperties) {
    if (!content[prop] || typeof content[prop] !== 'string' || content[prop].trim().length === 0) {
      return false;
    }
  }
  
  return true;
};

// Función para generar contenido de error SEO-friendly
export const generateErrorContent = (errorType: '404' | '500' | '403'): Record<string, string> => {
  const errorContent = {
    '404': {
      title: 'Página no encontrada - eGrow Academy',
      description: 'Lo sentimos, la página que buscas no existe. Regresa al inicio de eGrow Academy para encontrar los mejores cursos de Inteligencia Artificial.',
      keywords: ['eGrow Academy', 'cursos de inteligencia artificial', 'página no encontrada', 'error 404']
    },
    '500': {
      title: 'Error del servidor - eGrow Academy',
      description: 'Estamos experimentando problemas técnicos. Por favor, intenta nuevamente en unos minutos.',
      keywords: ['eGrow Academy', 'error servidor', 'problemas técnicos']
    },
    '403': {
      title: 'Acceso denegado - eGrow Academy',
      description: 'No tienes permisos para acceder a esta página. Contacta con soporte si crees que esto es un error.',
      keywords: ['eGrow Academy', 'acceso denegado', 'permisos']
    }
  };
  
  const content = errorContent[errorType];
  
  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords.join(', '),
    'og:title': content.title,
    'og:description': content.description,
    'og:type': 'website',
    'og:site_name': 'eGrow Academy',
    'twitter:card': 'summary_large_image',
    'twitter:title': content.title,
    'twitter:description': content.description,
    'robots': 'noindex, nofollow'
  };
}; 