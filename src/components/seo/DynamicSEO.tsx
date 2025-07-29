'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

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

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;
    
    // Actualizar título de la página de forma segura
    if (title) {
      document.title = title;
    }

    // Actualizar meta tags de forma segura
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Meta description
    if (description) {
      updateMetaTag('description', description);
    }

    // Meta keywords
    if (keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '));
    }

    // Open Graph tags básicos
    if (title) {
      updatePropertyTag('og:title', title);
    }
    if (description) {
      updatePropertyTag('og:description', description);
    }
    updatePropertyTag('og:type', type);
    updatePropertyTag('og:url', `${window.location.origin}${pathname}`);

    // Canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }

  }, [pathname, title, description, keywords, type, canonical]);

  return null;
}

// Hook para usar SEO dinámico
export const useDynamicSEO = (config: DynamicSEOProps) => {
  return {
    updateSEO: (newConfig: Partial<DynamicSEOProps>) => {
      Object.assign(config, newConfig);
    },
    validateSEO: () => {
      const issues = [];
      if (!config.title) issues.push('Título faltante');
      if (!config.description) issues.push('Descripción faltante');
      if (config.description && config.description.length > 160) {
        issues.push('Descripción muy larga');
      }
      return issues;
    }
  };
};

// Tipos para TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
} 