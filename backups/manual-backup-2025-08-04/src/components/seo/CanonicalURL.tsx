'use client';

import { usePathname } from 'next/navigation';
import { urlUtils } from '@/lib/url-structure-config';

interface CanonicalURLProps {
  customPath?: string;
  baseUrl?: string;
}

export default function CanonicalURL({ 
  customPath, 
  baseUrl = 'https://egrow-academy.com' 
}: CanonicalURLProps) {
  const pathname = usePathname();
  
  // Usar path personalizado o el actual
  const currentPath = customPath || pathname;
  
  // Obtener URL canónica
  const canonicalPath = urlUtils.getCanonicalURL(currentPath);
  
  // Generar URL completa
  const canonicalURL = `${baseUrl}${canonicalPath}`;

  return (
    <link rel="canonical" href={canonicalURL} />
  );
}

// Hook para obtener URL canónica
export function useCanonicalURL(customPath?: string) {
  const pathname = usePathname();
  const currentPath = customPath || pathname;
  const canonicalPath = urlUtils.getCanonicalURL(currentPath);
  
  return {
    canonicalPath,
    fullCanonicalURL: `https://egrow-academy.com${canonicalPath}`,
    needsRedirect: canonicalPath !== currentPath,
  };
} 