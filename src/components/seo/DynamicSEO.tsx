'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePerformanceMetrics } from './PerformanceOptimizer';
import { 
  validateSEOContent, 
  generateFallbackContent, 
  handleEmptyContent,
  generateFallbackMetaTags,
  hasValidContent
} from '@/lib/seo-error-prevention';

interface DynamicSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'course';
  courseData?: any;
  resourceData?: any;
  noindex?: boolean;
  canonical?: string;
  errorPage?: boolean;
}

export default function DynamicSEO({
  title,
  description,
  keywords = [],
  image,
  type = 'website',
  courseData,
  resourceData,
  noindex = false,
  canonical,
  errorPage = false,
}: DynamicSEOProps) {
  const pathname = usePathname();
  const { metrics } = usePerformanceMetrics();

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;
    
    // Validar y corregir contenido SEO
    const validatedTitle = handleEmptyContent(pathname, title || '', 'title');
    const validatedDescription = handleEmptyContent(pathname, description || '', 'description');
    const validatedKeywords = handleEmptyContent(pathname, keywords.join(', ') || '', 'keywords');
    
    // Actualizar título de la página
    if (validatedTitle) {
      document.title = validatedTitle;
    }

    // Actualizar meta tags dinámicamente
    const updateMetaTags = () => {
      // Robots meta tag para páginas de error
      if (errorPage || noindex) {
        let robotsMeta = document.querySelector('meta[name="robots"]');
        if (!robotsMeta) {
          robotsMeta = document.createElement('meta');
          robotsMeta.setAttribute('name', 'robots');
          document.head.appendChild(robotsMeta);
        }
        robotsMeta.setAttribute('content', 'noindex, nofollow');
      }

      // Meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', validatedDescription);

      // Meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', validatedKeywords);

      // Open Graph tags
      const ogTags = {
        'og:title': validatedTitle || document.title,
        'og:description': validatedDescription,
        'og:type': type,
        'og:url': `${window.location.origin}${pathname}`,
        'og:image': image || `${window.location.origin}/images/eGrowAcademylogo.png`,
        'og:site_name': 'eGrow Academy',
        'og:locale': 'es_MX',
      };

      Object.entries(ogTags).forEach(([property, content]) => {
        let ogTag = document.querySelector(`meta[property="${property}"]`);
        if (!ogTag) {
          ogTag = document.createElement('meta');
          ogTag.setAttribute('property', property);
          document.head.appendChild(ogTag);
        }
        ogTag.setAttribute('content', content);
      });

      // Twitter Card tags
      const twitterTags = {
        'twitter:card': 'summary_large_image',
        'twitter:site': '@egrowacademy',
        'twitter:creator': '@egrowacademy',
        'twitter:title': validatedTitle || document.title,
        'twitter:description': validatedDescription,
        'twitter:image': image || `${window.location.origin}/images/twitter-image.jpg`,
      };

      Object.entries(twitterTags).forEach(([name, content]) => {
        let twitterTag = document.querySelector(`meta[name="${name}"]`);
        if (!twitterTag) {
          twitterTag = document.createElement('meta');
          twitterTag.setAttribute('name', name);
          document.head.appendChild(twitterTag);
        }
        twitterTag.setAttribute('content', content);
      });

      // Canonical URL
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical || `${window.location.origin}${pathname}`);
    };

    // Actualizar structured data
    const updateStructuredData = () => {
      // Remover structured data existente
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach(script => {
        if (script.textContent?.includes('"@type":"Course"') || 
            script.textContent?.includes('"@type":"Article"')) {
          script.remove();
        }
      });

      // Agregar nuevo structured data según el tipo
      if (type === 'course' && courseData) {
        const courseStructuredData = {
          "@context": "https://schema.org",
          "@type": "Course",
          "name": courseData.title,
          "description": courseData.description,
          "provider": {
            "@type": "Organization",
            "name": "eGrow Academy",
            "url": "https://egrow-academy.com"
          },
          "courseMode": "online",
          "educationalLevel": courseData.level || "intermediate",
          "inLanguage": "es-MX",
          "teaches": courseData.skills || [],
          "coursePrerequisites": courseData.prerequisites || [],
          "educationalCredentialAwarded": "Certificate",
          "timeRequired": courseData.duration || "P40H",
          "offers": {
            "@type": "Offer",
            "price": courseData.price,
            "priceCurrency": "MXN",
            "availability": "https://schema.org/InStock"
          }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(courseStructuredData);
        document.head.appendChild(script);
      }

      if (type === 'article' && resourceData) {
        const articleStructuredData = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": resourceData.title,
          "description": resourceData.description,
          "author": {
            "@type": "Organization",
            "name": "eGrow Academy"
          },
          "publisher": {
            "@type": "Organization",
            "name": "eGrow Academy",
            "logo": {
              "@type": "ImageObject",
              "url": "https://egrow-academy.com/images/logo.png"
            }
          },
          "datePublished": resourceData.publishedAt || new Date().toISOString(),
          "dateModified": resourceData.updatedAt || new Date().toISOString(),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${window.location.origin}${pathname}`
          }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(articleStructuredData);
        document.head.appendChild(script);
      }
    };

    // Ejecutar actualizaciones
    updateMetaTags();
    updateStructuredData();

    // Track page view with Google Analytics
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: title || document.title,
        page_location: `${window.location.origin}${pathname}`,
        page_path: pathname
      });
    }

    // Track specific events based on page type
    if (type === 'course' && courseData) {
      if (window.gtag) {
        window.gtag('event', 'view_course', {
          course_title: courseData.title,
          course_slug: courseData.slug,
          course_category: courseData.category,
        });
      }
    }

    if (type === 'article' && resourceData) {
      if (window.gtag) {
        window.gtag('event', 'view_resource', {
          resource_title: resourceData.title,
          resource_slug: resourceData.slug,
          resource_type: resourceData.type,
        });
      }
    }

  }, [title, description, keywords, image, type, courseData, resourceData, pathname, noindex, canonical, errorPage]);

  return null; // Este componente no renderiza nada
}

// Hook para SEO dinámico
export const useDynamicSEO = (config: DynamicSEOProps) => {
  useEffect(() => {
    // Actualizar meta tags cuando cambie la configuración
    if (config.title) {
      document.title = config.title;
    }

    if (config.description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', config.description);
      }
    }

    if (config.keywords && config.keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', config.keywords.join(', '));
      }
    }
  }, [config]);
};

// Tipos para TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
} 