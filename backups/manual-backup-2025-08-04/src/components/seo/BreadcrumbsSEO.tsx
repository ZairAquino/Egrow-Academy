'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BreadcrumbItem, generateBreadcrumbs, generateBreadcrumbSchema } from '@/lib/breadcrumbs-config';

interface BreadcrumbsSEOProps {
  items?: BreadcrumbItem[];
  currentPageTitle?: string;
  showSchema?: boolean;
  className?: string;
}

export default function BreadcrumbsSEO({ 
  items, 
  currentPageTitle, 
  showSchema = true,
  className = ''
}: BreadcrumbsSEOProps) {
  const pathname = usePathname();
  
  // Usar items proporcionados o generar automáticamente
  const breadcrumbs = items || generateBreadcrumbs(pathname, currentPageTitle);

  // Generar Schema.org si está habilitado
  const schemaData = showSchema ? generateBreadcrumbSchema(breadcrumbs) : null;

  if (breadcrumbs.length <= 1) {
    return null; // No mostrar breadcrumbs si solo hay una página
  }

  return (
    <>
      {/* Schema.org para breadcrumbs */}
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData),
          }}
        />
      )}

      {/* Breadcrumbs visuales */}
      <nav 
        className={`breadcrumbs-seo ${className}`}
        aria-label="Breadcrumb"
        role="navigation"
      >
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          {breadcrumbs.map((item, index) => (
            <li key={item.url} className="flex items-center">
              {/* Separador */}
              {index > 0 && (
                <svg
                  className="w-4 h-4 mx-2 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              {/* Enlace o texto */}
              {item.isCurrentPage ? (
                <span 
                  className="font-medium text-blue-600"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-blue-600 hover:underline transition-colors duration-200"
                  title={`Ir a ${item.name}`}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Estilos CSS para breadcrumbs */}
      <style jsx>{`
        .breadcrumbs-seo {
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 1rem;
        }
        
        .breadcrumbs-seo ol {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .breadcrumbs-seo li {
          display: flex;
          align-items: center;
        }
        
        .breadcrumbs-seo a {
          text-decoration: none;
          color: #6b7280;
          transition: color 0.2s ease;
        }
        
        .breadcrumbs-seo a:hover {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .breadcrumbs-seo span[aria-current="page"] {
          color: #2563eb;
          font-weight: 500;
        }
        
        /* Responsive */
        @media (max-width: 640px) {
          .breadcrumbs-seo {
            padding: 0.5rem 0;
            font-size: 0.875rem;
          }
          
          .breadcrumbs-seo ol {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </>
  );
}

// Componente simplificado para uso rápido
export function SimpleBreadcrumbs({ 
  path, 
  title,
  className = ''
}: {
  path: string;
  title?: string;
  className?: string;
}) {
  const breadcrumbs = generateBreadcrumbs(path, title);
  
  return (
    <BreadcrumbsSEO 
      items={breadcrumbs} 
      className={className}
    />
  );
}

// Hook personalizado para breadcrumbs
export function useBreadcrumbs(currentPageTitle?: string) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname, currentPageTitle);
  
  return {
    breadcrumbs,
    schemaData: generateBreadcrumbSchema(breadcrumbs),
    pathname,
  };
} 