'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { lazyLoadingConfig } from '@/lib/speed-optimization-config';

interface LazyLoaderProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  placeholder?: ReactNode;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function LazyLoader({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  placeholder,
  className = '',
  onLoad,
  onError,
}: LazyLoaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (isVisible && !isLoaded && !hasError) {
      // Simular carga para componentes
      const timer = setTimeout(() => {
        setIsLoaded(true);
        onLoad?.();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isVisible, isLoaded, hasError, onLoad]);

  if (hasError) {
    return (
      <div className={`lazy-error ${className}`}>
        <div className="text-center p-4 text-gray-500">
          <p>Error al cargar el contenido</p>
          <button 
            onClick={() => {
              setHasError(false);
              setIsLoaded(false);
              setIsVisible(false);
            }}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!isVisible) {
    return (
      <div ref={ref} className={`lazy-placeholder ${className}`}>
        {placeholder || (
          <div className="animate-pulse bg-gray-200 rounded h-32 flex items-center justify-center">
            <div className="text-gray-400">Cargando...</div>
          </div>
        )}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`lazy-loading ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className={`lazy-loaded ${className}`}>
      {children}
    </div>
  );
}

// Componente específico para imágenes lazy
interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  quality = 85,
  placeholder,
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = imgRef.current;
          if (img) {
            img.src = src;
            img.onload = () => {
              setIsLoaded(true);
              onLoad?.();
            };
            img.onerror = () => {
              setHasError(true);
              onError?.();
            };
          }
          observer.disconnect();
        }
      },
      {
        threshold: lazyLoadingConfig.images.threshold,
        rootMargin: lazyLoadingConfig.images.rootMargin,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, onLoad, onError]);

  if (hasError) {
    return (
      <div className={`lazy-image-error ${className}`}>
        <div className="bg-gray-100 rounded flex items-center justify-center h-full">
          <span className="text-gray-400 text-sm">Error al cargar imagen</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`lazy-image-container ${className}`}>
      {!isLoaded && (
        <div 
          className="lazy-image-placeholder absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            backgroundImage: placeholder ? `url(${placeholder})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <img
        ref={imgRef}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={`lazy-image ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        style={{
          width: width ? `${width}px` : 'auto',
          height: height ? `${height}px` : 'auto',
        }}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  );
}

// Componente para scripts lazy
interface LazyScriptProps {
  src: string;
  async?: boolean;
  defer?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyScript({
  src,
  async = true,
  defer = false,
  onLoad,
  onError,
}: LazyScriptProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const scriptRef = useRef<HTMLScriptElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const script = document.createElement('script');
          script.src = src;
          script.async = async;
          script.defer = defer;
          
          script.onload = () => {
            setIsLoaded(true);
            onLoad?.();
          };
          
          script.onerror = () => {
            setHasError(true);
            onError?.();
          };

          document.head.appendChild(script);
          observer.disconnect();
        }
      },
      {
        threshold: lazyLoadingConfig.scripts.threshold,
        rootMargin: lazyLoadingConfig.scripts.rootMargin,
      }
    );

    if (scriptRef.current) {
      observer.observe(scriptRef.current);
    }

    return () => observer.disconnect();
  }, [src, async, defer, onLoad, onError]);

  return (
    <div ref={scriptRef} className="lazy-script-trigger">
      {hasError && (
        <div className="text-red-500 text-sm">
          Error al cargar script: {src}
        </div>
      )}
    </div>
  );
}

// Hook para lazy loading personalizado
export function useLazyLoad<T>(
  items: T[],
  threshold: number = 0.1,
  rootMargin: string = '50px'
) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMore = () => {
    setIsLoading(true);
    // Simular carga
    setTimeout(() => {
      const currentLength = visibleItems.length;
      const newItems = items.slice(currentLength, currentLength + 10);
      setVisibleItems(prev => [...prev, ...newItems]);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (items.length > 0 && visibleItems.length === 0) {
      setVisibleItems(items.slice(0, 10));
    }
  }, [items, visibleItems.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && visibleItems.length < items.length) {
          loadMore();
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current = observer;

    return () => observer.disconnect();
  }, [items.length, visibleItems.length, isLoading, threshold, rootMargin]);

  const observeElement = (element: HTMLElement | null) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  return {
    visibleItems,
    isLoading,
    hasMore: visibleItems.length < items.length,
    observeElement,
    loadMore,
  };
} 