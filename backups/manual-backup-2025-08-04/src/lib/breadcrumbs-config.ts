// Breadcrumbs SEO Configuration - eGrow Academy
// Optimizado para navegación y SEO

export interface BreadcrumbItem {
  name: string;
  url: string;
  isCurrentPage?: boolean;
}

export interface BreadcrumbConfig {
  items: BreadcrumbItem[];
  showHome?: boolean;
  separator?: string;
  maxItems?: number;
}

// Configuración base de breadcrumbs
export const breadcrumbConfig = {
  separator: '>',
  showHome: true,
  maxItems: 5,
  homeText: 'Inicio',
  homeUrl: '/',
};

// Generador de breadcrumbs para diferentes tipos de páginas
export const generateBreadcrumbs = (path: string, currentPageTitle?: string): BreadcrumbItem[] => {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Agregar página de inicio
  if (breadcrumbConfig.showHome) {
    breadcrumbs.push({
      name: breadcrumbConfig.homeText,
      url: breadcrumbConfig.homeUrl,
    });
  }

  let currentPath = '';
  
  // Generar breadcrumbs basados en la ruta
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Mapear segmentos a nombres legibles
    const name = getBreadcrumbName(segment, index, segments);
    
    breadcrumbs.push({
      name,
      url: currentPath,
      isCurrentPage: index === segments.length - 1,
    });
  });

  // Si se proporciona un título personalizado para la página actual
  if (currentPageTitle && breadcrumbs.length > 0) {
    const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
    lastBreadcrumb.name = currentPageTitle;
  }

  return breadcrumbs;
};

// Mapeo de segmentos de URL a nombres legibles
const getBreadcrumbName = (segment: string, index: number, segments: string[]): string => {
  const nameMap: Record<string, string> = {
    // Páginas principales
    'cursos': 'Cursos',
    'curso': 'Curso',
    'blog': 'Blog',
    'articulo': 'Artículo',
    'eventos': 'Eventos',
    'evento': 'Evento',
    'contacto': 'Contacto',
    'sobre-nosotros': 'Sobre Nosotros',
    'precios': 'Precios',
    'instructores': 'Instructores',
    'instructor': 'Instructor',
    'testimonios': 'Testimonios',
    'testimonio': 'Testimonio',
    
    // Categorías de cursos
    'machine-learning': 'Machine Learning',
    'deep-learning': 'Deep Learning',
    'python': 'Python',
    'data-science': 'Data Science',
    'inteligencia-artificial': 'Inteligencia Artificial',
    'neural-networks': 'Redes Neuronales',
    'computer-vision': 'Computer Vision',
    'nlp': 'Procesamiento de Lenguaje Natural',
    
    // Niveles de dificultad
    'principiante': 'Principiante',
    'intermedio': 'Intermedio',
    'avanzado': 'Avanzado',
    
    // Tipos de contenido
    'webinars': 'Webinars',
    'workshops': 'Workshops',
    'tutoriales': 'Tutoriales',
    'recursos': 'Recursos',
    'descargas': 'Descargas',
    
    // Páginas de usuario
    'perfil': 'Mi Perfil',
    'dashboard': 'Panel de Control',
    'mis-cursos': 'Mis Cursos',
    'progreso': 'Mi Progreso',
    'certificados': 'Mis Certificados',
    'facturas': 'Mis Facturas',
    'configuracion': 'Configuración',
    
    // Páginas de autenticación
    'login': 'Iniciar Sesión',
    'registro': 'Registro',
    'recuperar-password': 'Recuperar Contraseña',
    'verificar-email': 'Verificar Email',
    
    // Páginas de pago
    'checkout': 'Finalizar Compra',
    'pago': 'Pago',
    'confirmacion': 'Confirmación',
    'exito': 'Pago Exitoso',
    'error': 'Error en el Pago',
  };

  // Si es un slug de curso específico, intentar obtener el título real
  if (segment && !nameMap[segment]) {
    // Para slugs de cursos, convertir a formato legible
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return nameMap[segment] || segment;
};

// Configuraciones específicas por tipo de página
export const breadcrumbConfigs = {
  // Página de curso
  course: (courseSlug: string, courseTitle: string) => ({
    items: [
      { name: 'Inicio', url: '/' },
      { name: 'Cursos', url: '/cursos' },
      { name: courseTitle, url: `/curso/${courseSlug}`, isCurrentPage: true },
    ],
  }),

  // Página de categoría
  category: (categorySlug: string, categoryName: string) => ({
    items: [
      { name: 'Inicio', url: '/' },
      { name: 'Cursos', url: '/cursos' },
      { name: categoryName, url: `/categoria/${categorySlug}`, isCurrentPage: true },
    ],
  }),

  // Página de instructor
  instructor: (instructorSlug: string, instructorName: string) => ({
    items: [
      { name: 'Inicio', url: '/' },
      { name: 'Instructores', url: '/instructores' },
      { name: instructorName, url: `/instructor/${instructorSlug}`, isCurrentPage: true },
    ],
  }),

  // Página de blog
  blog: (postSlug: string, postTitle: string) => ({
    items: [
      { name: 'Inicio', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: postTitle, url: `/blog/${postSlug}`, isCurrentPage: true },
    ],
  }),

  // Página de evento
  event: (eventSlug: string, eventTitle: string) => ({
    items: [
      { name: 'Inicio', url: '/' },
      { name: 'Eventos', url: '/eventos' },
      { name: eventTitle, url: `/evento/${eventSlug}`, isCurrentPage: true },
    ],
  }),

  // Página de checkout
  checkout: (courseTitle?: string) => ({
    items: [
      { name: 'Inicio', url: '/' },
      ...(courseTitle ? [{ name: courseTitle, url: `/curso/${courseTitle.toLowerCase().replace(/\s+/g, '-')}` }] : []),
      { name: 'Finalizar Compra', url: '/checkout', isCurrentPage: true },
    ],
  }),
};

// Generador de Schema.org para breadcrumbs
export const generateBreadcrumbSchema = (breadcrumbs: BreadcrumbItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://egrow-academy.com${item.url}`,
    })),
  };
};

// Utilidades para breadcrumbs
export const breadcrumbUtils = {
  // Obtener breadcrumbs para una ruta específica
  getBreadcrumbsForPath: (path: string, title?: string) => {
    return generateBreadcrumbs(path, title);
  },

  // Obtener breadcrumbs para un curso
  getCourseBreadcrumbs: (courseSlug: string, courseTitle: string) => {
    return breadcrumbConfigs.course(courseSlug, courseTitle).items;
  },

  // Obtener breadcrumbs para una categoría
  getCategoryBreadcrumbs: (categorySlug: string, categoryName: string) => {
    return breadcrumbConfigs.category(categorySlug, categoryName).items;
  },

  // Obtener breadcrumbs para un instructor
  getInstructorBreadcrumbs: (instructorSlug: string, instructorName: string) => {
    return breadcrumbConfigs.instructor(instructorSlug, instructorName).items;
  },

  // Obtener breadcrumbs para un artículo del blog
  getBlogBreadcrumbs: (postSlug: string, postTitle: string) => {
    return breadcrumbConfigs.blog(postSlug, postTitle).items;
  },

  // Obtener breadcrumbs para un evento
  getEventBreadcrumbs: (eventSlug: string, eventTitle: string) => {
    return breadcrumbConfigs.event(eventSlug, eventTitle).items;
  },

  // Validar breadcrumbs
  validateBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => {
    if (!breadcrumbs || breadcrumbs.length === 0) {
      return false;
    }

    // Verificar que al menos un breadcrumb sea la página actual
    const hasCurrentPage = breadcrumbs.some(item => item.isCurrentPage);
    if (!hasCurrentPage) {
      return false;
    }

    // Verificar que las URLs sean válidas
    const hasValidUrls = breadcrumbs.every(item => 
      item.url && item.url.startsWith('/')
    );

    return hasValidUrls;
  },
}; 