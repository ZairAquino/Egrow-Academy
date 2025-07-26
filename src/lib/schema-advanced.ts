// Schema.org Avanzado para eGrow Academy
// Optimizado para cursos de inteligencia artificial

export const generateAdvancedCourseSchema = (courseData: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": courseData.title,
    "description": courseData.description,
    "url": `https://egrow-academy.com/curso/${courseData.slug}`,
    "image": courseData.image || "/images/course-default.jpg",
    
    // Información del proveedor
    "provider": {
      "@type": "EducationalOrganization",
      "name": "eGrow Academy",
      "url": "https://egrow-academy.com",
      "logo": "https://egrow-academy.com/images/logo.png",
      "description": "Plataforma líder en cursos de inteligencia artificial en español",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "MX",
        "addressRegion": "Ciudad de México"
      }
    },
    
    // Detalles del curso
    "courseMode": "online",
    "educationalLevel": courseData.level || "intermediate",
    "inLanguage": "es-MX",
    "educationalCredentialAwarded": "Certificate",
    "timeRequired": courseData.duration || "P40H",
    "coursePrerequisites": courseData.prerequisites || [],
    "teaches": courseData.skills || [],
    
    // Contenido del curso
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "inLanguage": "es-MX",
      "startDate": courseData.startDate,
      "endDate": courseData.endDate,
      "maximumAttendeeCapacity": courseData.maxStudents || 100
    },
    
    // Oferta y precio
    "offers": {
      "@type": "Offer",
      "price": courseData.price,
      "priceCurrency": "MXN",
      "availability": "https://schema.org/InStock",
      "validFrom": courseData.validFrom,
      "validThrough": courseData.validThrough,
      "url": `https://egrow-academy.com/curso/${courseData.slug}`,
      "seller": {
        "@type": "EducationalOrganization",
        "name": "eGrow Academy"
      }
    },
    
    // Calificaciones y reseñas
    "aggregateRating": courseData.rating ? {
      "@type": "AggregateRating",
      "ratingValue": courseData.rating.average,
      "reviewCount": courseData.rating.count,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    
    // Categorías y temas
    "about": courseData.topics || [],
    "keywords": courseData.keywords || [],
    
    // Información adicional
    "audience": {
      "@type": "Audience",
      "audienceType": "Estudiantes de inteligencia artificial"
    },
    
    "learningResourceType": "Curso en línea",
    "interactivityType": "mixed",
    "typicalAgeRange": "18-65",
    "educationalUse": "Formación profesional"
  };
};

// Schema.org para Organización Educativa
export const generateEducationalOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "eGrow Academy",
    "url": "https://egrow-academy.com",
    "logo": "https://egrow-academy.com/images/logo.png",
    "description": "Plataforma líder en cursos de inteligencia artificial en español para México y Latinoamérica",
    
    // Información de contacto
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contacto@egrow-academy.com",
      "availableLanguage": ["Spanish", "English"],
      "areaServed": ["MX", "AR", "CO", "PE", "CL", "EC", "GT", "CR", "PA", "CU", "BO", "DO", "HN", "PY", "EL", "SV", "UY", "VE"]
    },
    
    // Dirección
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "MX",
      "addressRegion": "Ciudad de México",
      "addressLocality": "México"
    },
    
    // Redes sociales
    "sameAs": [
      "https://www.facebook.com/egrowacademy",
      "https://twitter.com/egrowacademy",
      "https://www.linkedin.com/company/egrow-academy",
      "https://www.instagram.com/egrowacademy",
      "https://www.youtube.com/c/egrowacademy"
    ],
    
    // Información de la organización
    "foundingDate": "2024",
    "numberOfEmployees": "10-50",
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 19.4326,
        "longitude": -99.1332
      },
      "geoRadius": "5000000"
    },
    
    // Servicios educativos
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Cursos de Inteligencia Artificial",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "Machine Learning Fundamentals"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "Deep Learning con Python"
          }
        }
      ]
    }
  };
};

// Schema.org para Breadcrumbs
export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

// Schema.org para FAQ
export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Schema.org para Reseñas
export const generateReviewSchema = (reviews: Array<{
  author: string,
  rating: number,
  reviewBody: string,
  datePublished: string
}>) => {
  return reviews.map(review => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": 5,
      "worstRating": 1
    },
    "reviewBody": review.reviewBody,
    "datePublished": review.datePublished,
    "itemReviewed": {
      "@type": "Course",
      "name": "Curso de Inteligencia Artificial"
    }
  }));
};

// Schema.org para Eventos (Webinars, Workshops)
export const generateEventSchema = (eventData: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": eventData.title,
    "description": eventData.description,
    "startDate": eventData.startDate,
    "endDate": eventData.endDate,
    "location": {
      "@type": "VirtualLocation",
      "url": eventData.url
    },
    "organizer": {
      "@type": "EducationalOrganization",
      "name": "eGrow Academy",
      "url": "https://egrow-academy.com"
    },
    "performer": {
      "@type": "Person",
      "name": eventData.instructor
    },
    "offers": {
      "@type": "Offer",
      "price": eventData.price || "0",
      "priceCurrency": "MXN",
      "availability": "https://schema.org/InStock"
    },
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode"
  };
}; 