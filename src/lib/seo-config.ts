import { Metadata } from 'next';

// Configuración SEO base para eGrow Academy
export const baseSEOConfig = {
  title: {
    default: "eGrow Academy - Cursos de Inteligencia Artificial | Líder en México y Latinoamérica",
    template: "%s | eGrow Academy - Cursos de IA"
  },
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
    "especialización en IA",
    "inteligencia artificial Latinoamérica",
    "cursos de programación IA",
    "formación profesional IA",
    "certificación en inteligencia artificial",
    "cursos de Python para IA",
    "aprendizaje automático",
    "redes neuronales",
    "procesamiento de lenguaje natural",
    "visión por computadora",
    "robótica e IA"
  ],
  authors: [{ name: "eGrow Academy", url: "https://egrow-academy.com" }],
  creator: "eGrow Academy",
  publisher: "eGrow Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://egrow-academy.com'),
  alternates: {
    canonical: '/',
    languages: {
      'es-MX': '/es-MX',
      'es-AR': '/es-AR',
      'es-CO': '/es-CO',
      'es-PE': '/es-PE',
      'es-CL': '/es-CL',
      'es-EC': '/es-EC',
      'es-GT': '/es-GT',
      'es-CR': '/es-CR',
      'es-PA': '/es-PA',
      'es-CU': '/es-CU',
      'es-BO': '/es-BO',
      'es-DO': '/es-DO',
      'es-HN': '/es-HN',
      'es-PY': '/es-PY',
      'es-EL': '/es-EL',
      'es-SV': '/es-SV',
      'es-UY': '/es-UY',
      'es-VE': '/es-VE',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://egrow-academy.com',
    siteName: 'eGrow Academy',
    title: 'eGrow Academy - Cursos de Inteligencia Artificial | Líder en México y Latinoamérica',
    description: 'Aprende Inteligencia Artificial con los mejores cursos online en español. Formación profesional en IA, Machine Learning, Deep Learning y más.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'eGrow Academy - Cursos de Inteligencia Artificial',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@egrowacademy',
    creator: '@egrowacademy',
    title: 'eGrow Academy - Cursos de Inteligencia Artificial',
    description: 'Aprende Inteligencia Artificial con los mejores cursos online en español. Líder en México y Latinoamérica.',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'tu-google-verification-code',
    yandex: 'tu-yandex-verification-code',
    yahoo: 'tu-yahoo-verification-code',
    bing: 'tu-bing-verification-code',
  },
  category: 'education',
  classification: 'Cursos de Inteligencia Artificial',
  other: {
    'geo.region': 'MX',
    'geo.placename': 'México',
    'geo.position': '19.4326;-99.1332',
    'ICBM': '19.4326, -99.1332',
    'DC.title': 'eGrow Academy - Cursos de Inteligencia Artificial',
    'DC.creator': 'eGrow Academy',
    'DC.subject': 'Inteligencia Artificial, Machine Learning, Deep Learning, Cursos Online',
    'DC.description': 'Plataforma líder en cursos de inteligencia artificial en español para México y Latinoamérica',
    'DC.publisher': 'eGrow Academy',
    'DC.contributor': 'eGrow Academy',
    'DC.date': new Date().toISOString(),
    'DC.type': 'InteractiveResource',
    'DC.format': 'text/html',
    'DC.identifier': 'https://egrow-academy.com',
    'DC.language': 'es-MX',
    'DC.coverage': 'México, Latinoamérica',
    'DC.rights': '© 2024 eGrow Academy. Todos los derechos reservados.',
  },
};

// Configuración SEO específica para páginas de cursos
export const courseSEOConfig = (courseData: any): Metadata => ({
  ...baseSEOConfig,
  title: `${courseData.title} - Curso de Inteligencia Artificial | eGrow Academy`,
  description: courseData.description || `Aprende ${courseData.title} con nuestro curso especializado. Formación profesional en inteligencia artificial.`,
  keywords: [
    ...baseSEOConfig.keywords,
    courseData.title,
    `curso ${courseData.title}`,
    `aprender ${courseData.title}`,
    `${courseData.title} México`,
    `${courseData.title} Latinoamérica`,
  ],
  openGraph: {
    ...baseSEOConfig.openGraph,
    title: `${courseData.title} - Curso de Inteligencia Artificial | eGrow Academy`,
    description: courseData.description || `Aprende ${courseData.title} con nuestro curso especializado.`,
    url: `https://egrow-academy.com/curso/${courseData.slug}`,
    images: [
      {
        url: courseData.image || '/images/course-default.jpg',
        width: 1200,
        height: 630,
        alt: `Curso de ${courseData.title} - eGrow Academy`,
      },
    ],
  },
  twitter: {
    ...baseSEOConfig.twitter,
    title: `${courseData.title} - Curso de Inteligencia Artificial`,
    description: courseData.description || `Aprende ${courseData.title} con nuestro curso especializado.`,
    images: [courseData.image || '/images/course-default.jpg'],
  },
});

// Configuración SEO para páginas de categorías
export const categorySEOConfig = (categoryData: any): Metadata => ({
  ...baseSEOConfig,
  title: `Cursos de ${categoryData.name} - Inteligencia Artificial | eGrow Academy`,
  description: `Explora nuestros cursos especializados en ${categoryData.name}. Formación profesional en inteligencia artificial y tecnología.`,
  keywords: [
    ...baseSEOConfig.keywords,
    categoryData.name,
    `cursos ${categoryData.name}`,
    `${categoryData.name} México`,
    `${categoryData.name} Latinoamérica`,
  ],
  openGraph: {
    ...baseSEOConfig.openGraph,
    title: `Cursos de ${categoryData.name} - Inteligencia Artificial | eGrow Academy`,
    description: `Explora nuestros cursos especializados en ${categoryData.name}.`,
    url: `https://egrow-academy.com/cursos/${categoryData.slug}`,
  },
});

// Configuración SEO para blog
export const blogSEOConfig = (postData: any): Metadata => ({
  ...baseSEOConfig,
  title: `${postData.title} - Blog eGrow Academy`,
  description: postData.excerpt || postData.description || `Artículo sobre ${postData.title} en nuestro blog de inteligencia artificial.`,
  keywords: [
    ...baseSEOConfig.keywords,
    ...(postData.tags || []),
    'blog inteligencia artificial',
    'artículos IA',
    'noticias inteligencia artificial',
  ],
  openGraph: {
    ...baseSEOConfig.openGraph,
    type: 'article',
    title: `${postData.title} - Blog eGrow Academy`,
    description: postData.excerpt || postData.description,
    url: `https://egrow-academy.com/blog/${postData.slug}`,
    images: [
      {
        url: postData.image || '/images/blog-default.jpg',
        width: 1200,
        height: 630,
        alt: postData.title,
      },
    ],
    publishedTime: postData.publishedAt,
    modifiedTime: postData.updatedAt,
    authors: ['eGrow Academy'],
    section: 'Inteligencia Artificial',
    tags: postData.tags || [],
  },
});

// Configuración para páginas específicas
export const pageSEOConfig = {
  home: {
    ...baseSEOConfig,
    title: "eGrow Academy - Cursos de Inteligencia Artificial | Líder en México y Latinoamérica",
    description: "Aprende Inteligencia Artificial con los mejores cursos online en español. Formación profesional en IA, Machine Learning, Deep Learning y más. Líder en México y Latinoamérica.",
  },
  about: {
    ...baseSEOConfig,
    title: "Sobre Nosotros - eGrow Academy | Líder en Educación de IA",
    description: "Conoce eGrow Academy, la plataforma líder en cursos de inteligencia artificial en México y Latinoamérica. Nuestra misión es democratizar el acceso a la educación en IA.",
  },
  contact: {
    ...baseSEOConfig,
    title: "Contacto - eGrow Academy | Soporte y Consultas",
    description: "Contáctanos para resolver tus dudas sobre nuestros cursos de inteligencia artificial. Soporte técnico y asesoría personalizada disponible.",
  },
  courses: {
    ...baseSEOConfig,
    title: "Cursos de Inteligencia Artificial - eGrow Academy",
    description: "Explora nuestro catálogo completo de cursos de inteligencia artificial. Desde principiantes hasta avanzados, encuentra tu camino en la IA.",
  },
  pricing: {
    ...baseSEOConfig,
    title: "Precios y Planes - eGrow Academy | Cursos de IA",
    description: "Conoce nuestros planes y precios para cursos de inteligencia artificial. Opciones flexibles para todos los presupuestos y niveles.",
  },
};

// Schema.org structured data
export const generateStructuredData = (type: string, data: any) => {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type,
    "name": "eGrow Academy",
    "url": "https://egrow-academy.com",
    "logo": "https://egrow-academy.com/images/logo.png",
    "description": "Plataforma líder en cursos de inteligencia artificial en español para México y Latinoamérica",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "MX",
      "addressRegion": "Ciudad de México",
      "addressLocality": "México"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contacto@egrow-academy.com",
      "availableLanguage": ["Spanish", "English"]
    },
    "sameAs": [
      "https://www.facebook.com/egrowacademy",
      "https://twitter.com/egrowacademy",
      "https://www.linkedin.com/company/egrow-academy",
      "https://www.instagram.com/egrowacademy",
      "https://www.youtube.com/c/egrowacademy"
    ]
  };

  switch (type) {
    case 'Organization':
      return {
        ...baseStructuredData,
        "foundingDate": "2024",
        "numberOfEmployees": "10-50",
        "areaServed": ["MX", "AR", "CO", "PE", "CL", "EC", "GT", "CR", "PA", "CU", "BO", "DO", "HN", "PY", "EL", "SV", "UY", "VE"],
        "serviceArea": {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": 19.4326,
            "longitude": -99.1332
          },
          "geoRadius": "5000000"
        }
      };
    
    case 'Course':
      return {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": data.title,
        "description": data.description,
        "provider": {
          "@type": "Organization",
          "name": "eGrow Academy",
          "url": "https://egrow-academy.com"
        },
        "courseMode": "online",
        "educationalLevel": data.level || "intermediate",
        "inLanguage": "es-MX",
        "teaches": data.skills || [],
        "coursePrerequisites": data.prerequisites || [],
        "educationalCredentialAwarded": "Certificate",
        "timeRequired": data.duration || "P40H",
        "offers": {
          "@type": "Offer",
          "price": data.price,
          "priceCurrency": "MXN",
          "availability": "https://schema.org/InStock"
        }
      };
    
    case 'WebSite':
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "eGrow Academy",
        "url": "https://egrow-academy.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://egrow-academy.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      };
    
    default:
      return baseStructuredData;
  }
}; 