// Open Graph Configuration - eGrow Academy
// Optimizado para redes sociales y compartir profesional

export interface OpenGraphData {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'course' | 'event';
  siteName?: string;
  locale?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  price?: number;
  priceCurrency?: string;
  availability?: string;
  rating?: {
    value: number;
    count: number;
  };
  duration?: string;
  instructor?: string;
  level?: string;
}

// Configuración base de Open Graph
export const baseOpenGraphConfig = {
  siteName: 'eGrow Academy',
  locale: 'es_MX',
  type: 'website' as const,
  defaultImage: '/images/og-image.jpg',
  defaultDescription: 'Aprende Inteligencia Artificial con los mejores cursos online en español. Formación profesional en IA, Machine Learning, Deep Learning y más. Líder en México y Latinoamérica.',
};

// Generador de Open Graph para diferentes tipos de contenido
export const generateOpenGraph = (data: OpenGraphData) => {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags,
    price,
    priceCurrency = 'MXN',
    availability,
    rating,
    duration,
    instructor,
    level
  } = data;

  const ogData = {
    // Meta tags básicos
    'og:title': title,
    'og:description': description,
    'og:image': image || baseOpenGraphConfig.defaultImage,
    'og:url': url || 'https://egrow-academy.com',
    'og:type': type,
    'og:site_name': baseOpenGraphConfig.siteName,
    'og:locale': baseOpenGraphConfig.locale,
    
    // Twitter Card
    'twitter:card': 'summary_large_image',
    'twitter:site': '@egrowacademy',
    'twitter:creator': '@egrowacademy',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image || baseOpenGraphConfig.defaultImage,
    
    // Imagen específica
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': title,
    'og:image:type': 'image/jpeg',
  };

  // Agregar metadatos específicos según el tipo
  if (type === 'article') {
    Object.assign(ogData, {
      'og:type': 'article',
      'article:published_time': publishedTime,
      'article:modified_time': modifiedTime,
      'article:author': author,
      'article:section': section,
      'article:tag': tags?.join(', '),
    });
  }

  if (type === 'course') {
    Object.assign(ogData, {
      'og:type': 'website',
      'product:price:amount': price?.toString(),
      'product:price:currency': priceCurrency,
      'product:availability': availability || 'in stock',
      'product:rating:value': rating?.value?.toString(),
      'product:rating:count': rating?.count?.toString(),
      'course:duration': duration,
      'course:instructor': instructor,
      'course:level': level,
    });
  }

  return ogData;
};

// Configuraciones específicas por página
export const openGraphConfigs = {
  // Página principal
  home: {
    title: 'eGrow Academy - Cursos de Inteligencia Artificial | Líder en México y Latinoamérica',
    description: 'Aprende Inteligencia Artificial con los mejores cursos online en español. Formación profesional en IA, Machine Learning, Deep Learning y más. Líder en México y Latinoamérica.',
    image: '/images/og-home.jpg',
    type: 'website' as const,
  },

  // Página de cursos
  courses: {
    title: 'Cursos de Inteligencia Artificial - eGrow Academy',
    description: 'Explora nuestro catálogo completo de cursos de inteligencia artificial. Desde principiantes hasta avanzados, encuentra tu camino en la IA.',
    image: '/images/og-courses.jpg',
    type: 'website' as const,
  },

  // Página de contacto
  contact: {
    title: 'Contacto - eGrow Academy | Soporte y Consultas',
    description: 'Contáctanos para resolver tus dudas sobre nuestros cursos de inteligencia artificial. Soporte técnico y asesoría personalizada disponible.',
    image: '/images/og-contact.jpg',
    type: 'website' as const,
  },

  // Página sobre nosotros
  about: {
    title: 'Sobre Nosotros - eGrow Academy | Líder en Educación de IA',
    description: 'Conoce eGrow Academy, la plataforma líder en cursos de inteligencia artificial en México y Latinoamérica. Nuestra misión es democratizar el acceso a la educación en IA.',
    image: '/images/og-about.jpg',
    type: 'website' as const,
  },

  // Página de precios
  pricing: {
    title: 'Precios y Planes - eGrow Academy | Cursos de IA',
    description: 'Conoce nuestros planes y precios para cursos de inteligencia artificial. Opciones flexibles para todos los presupuestos y niveles.',
    image: '/images/og-pricing.jpg',
    type: 'website' as const,
  },
};

// Generador para cursos específicos
export const generateCourseOpenGraph = (courseData: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  price?: number;
  rating?: { average: number; count: number };
  duration?: string;
  instructor?: string;
  level?: string;
}) => {
  return generateOpenGraph({
    title: `${courseData.title} - Curso de Inteligencia Artificial | eGrow Academy`,
    description: courseData.description || `Aprende ${courseData.title} con nuestro curso especializado. Formación profesional en inteligencia artificial.`,
    image: courseData.image || '/images/course-default.jpg',
    url: `https://egrow-academy.com/curso/${courseData.slug}`,
    type: 'course',
    price: courseData.price,
    rating: courseData.rating,
    duration: courseData.duration,
    instructor: courseData.instructor,
    level: courseData.level,
    tags: ['inteligencia artificial', 'cursos online', 'machine learning', courseData.title],
  });
};

// Generador para artículos del blog
export const generateBlogOpenGraph = (postData: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
}) => {
  return generateOpenGraph({
    title: `${postData.title} - Blog eGrow Academy`,
    description: postData.description || `Artículo sobre ${postData.title} en nuestro blog de inteligencia artificial.`,
    image: postData.image || '/images/blog-default.jpg',
    url: `https://egrow-academy.com/blog/${postData.slug}`,
    type: 'article',
    publishedTime: postData.publishedAt,
    modifiedTime: postData.updatedAt,
    author: postData.author || 'eGrow Academy',
    section: 'Inteligencia Artificial',
    tags: postData.tags || ['blog', 'inteligencia artificial', postData.title],
  });
};

// Generador para eventos (webinars, workshops)
export const generateEventOpenGraph = (eventData: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  startDate: string;
  endDate?: string;
  instructor?: string;
  price?: number;
}) => {
  return generateOpenGraph({
    title: `${eventData.title} - Evento eGrow Academy`,
    description: eventData.description || `Participa en ${eventData.title}, un evento exclusivo de inteligencia artificial.`,
    image: eventData.image || '/images/event-default.jpg',
    url: `https://egrow-academy.com/evento/${eventData.slug}`,
    type: 'event',
    publishedTime: eventData.startDate,
    tags: ['evento', 'webinar', 'inteligencia artificial', eventData.title],
  });
}; 