'use client';

import { ampComponents } from '@/lib/amp-config';

interface AMPImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  layout?: 'responsive' | 'fixed' | 'fill' | 'flex-item' | 'intrinsic' | 'nodisplay';
  sizes?: string;
  className?: string;
  fallback?: boolean;
  placeholder?: boolean;
  priority?: boolean;
}

export default function AMPImage({
  src,
  alt,
  width = ampComponents.ampImg.width,
  height = ampComponents.ampImg.height,
  layout = ampComponents.ampImg.layout,
  sizes = ampComponents.ampImg.sizes,
  className = '',
  fallback = ampComponents.ampImg.fallback,
  placeholder = ampComponents.ampImg.placeholder,
  priority = false,
}: AMPImageProps) {
  // Generar placeholder si está habilitado
  const placeholderSrc = placeholder 
    ? `data:image/svg+xml;base64,${btoa(`
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">
            Cargando...
          </text>
        </svg>
      `)}`
    : undefined;

  return (
    <amp-img
      src={src}
      alt={alt}
      width={width}
      height={height}
      layout={layout}
      sizes={sizes}
      class={className}
      {...(placeholder && placeholderSrc && { placeholder: placeholderSrc })}
      {...(fallback && { fallback: true })}
      {...(priority && { fetchpriority: 'high' })}
    />
  );
}

// Componente para imagen con lazy loading
export function AMPLazyImage({
  src,
  alt,
  width,
  height,
  layout = 'responsive',
  className = '',
}: Omit<AMPImageProps, 'fallback' | 'placeholder' | 'priority'>) {
  return (
    <amp-img
      src={src}
      alt={alt}
      width={width}
      height={height}
      layout={layout}
      class={`amp-lazy-image ${className}`}
      loading="lazy"
    />
  );
}

// Componente para imagen con carrusel
export function AMPCarouselImage({
  src,
  alt,
  width,
  height,
  className = '',
}: Omit<AMPImageProps, 'layout' | 'sizes' | 'fallback' | 'placeholder' | 'priority'>) {
  return (
    <amp-img
      src={src}
      alt={alt}
      width={width}
      height={height}
      layout="fill"
      class={`amp-carousel-image ${className}`}
    />
  );
} 