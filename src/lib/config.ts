// Configuración de características y flags de la aplicación
export const FEATURE_FLAGS = {
  // Hero principal - versión 2 con diseño de dos columnas
  HERO_V2: true, // Temporalmente hardcodeado para debug
  // HERO_V2: process.env.NEXT_PUBLIC_HERO_V2 === 'true' || false,
  
  // Otras características
  NEW_COURSE_DESIGN: process.env.NEXT_PUBLIC_NEW_COURSE_DESIGN === 'true' || false,
  ADVANCED_ANALYTICS: process.env.NEXT_PUBLIC_ADVANCED_ANALYTICS === 'true' || false,
};

// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'eGrow Academy',
  description: 'Plataforma líder en cursos de Inteligencia Artificial en México y Latinoamérica',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  environment: process.env.NODE_ENV || 'development',
};

// Configuración de imágenes y assets
export const IMAGE_CONFIG = {
  formats: ['webp', 'avif', 'png'],
  defaultQuality: 85,
  responsive: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    large: 1440,
  },
};
