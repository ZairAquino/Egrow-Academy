'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  className?: string;
  showHome?: boolean;
  customItems?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  className = '',
  showHome = true,
  customItems
}) => {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;

    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (showHome) {
      breadcrumbs.push({
        label: 'Inicio',
        href: '/',
        isActive: pathname === '/'
      });
    }

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Mapear segmentos a nombres legibles
      const label = getSegmentLabel(segment);
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const getSegmentLabel = (segment: string): string => {
    const labelMap: Record<string, string> = {
      'courses': 'Cursos',
      'curso': 'Curso',
      'cursos-gratuitos': 'Cursos Gratuitos',
      'community': 'Comunidad',
      'contacto': 'Contacto',
      'resources': 'Recursos',
      'profile': 'Perfil',
      'my-courses': 'Mis Cursos',
      'subscription': 'Suscripción',
      'payment': 'Pago',
      'login': 'Iniciar Sesión',
      'register': 'Registrarse',
      'forgot-password': 'Recuperar Contraseña',
      'reset-password': 'Restablecer Contraseña',
      'verify-email': 'Verificar Email',
      'monetiza-ia': 'Monetiza con IA',
      'desarrollo-web-fullstack': 'Desarrollo Web Full Stack',
      'contenido': 'Contenido'
    };

    return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400"
            >
              /
            </motion.span>
          )}
          
          {item.isActive ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-900 font-medium"
              aria-current="page"
            >
              {item.label}
            </motion.span>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                {item.label}
              </Link>
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Hook para usar breadcrumbs en cualquier componente
export const useBreadcrumbs = () => {
  const pathname = usePathname();
  
  const getBreadcrumbs = (customItems?: BreadcrumbItem[]) => {
    if (customItems) return customItems;

    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    breadcrumbs.push({
      label: 'Inicio',
      href: '/',
      isActive: pathname === '/'
    });

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      const label = getSegmentLabel(segment);
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const getSegmentLabel = (segment: string): string => {
    const labelMap: Record<string, string> = {
      'courses': 'Cursos',
      'curso': 'Curso',
      'cursos-gratuitos': 'Cursos Gratuitos',
      'community': 'Comunidad',
      'contacto': 'Contacto',
      'resources': 'Recursos',
      'profile': 'Perfil',
      'my-courses': 'Mis Cursos',
      'subscription': 'Suscripción',
      'payment': 'Pago',
      'login': 'Iniciar Sesión',
      'register': 'Registrarse',
      'forgot-password': 'Recuperar Contraseña',
      'reset-password': 'Restablecer Contraseña',
      'verify-email': 'Verificar Email',
      'monetiza-ia': 'Monetiza con IA',
      'desarrollo-web-fullstack': 'Desarrollo Web Full Stack',
      'contenido': 'Contenido'
    };

    return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return { getBreadcrumbs, pathname };
}; 