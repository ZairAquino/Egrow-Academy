'use client';

import { useEffect, useRef, useState } from 'react';
import { speedUtils, speedTargets } from '@/lib/speed-optimization-config';

interface PerformanceMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
  score: number;
}

interface PerformanceOptimizerProps {
  trackMetrics?: boolean;
  showDebug?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export default function PerformanceOptimizer({
  trackMetrics = true,
  showDebug = false,
  onMetricsUpdate,
}: PerformanceOptimizerProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    score: 0,
  });

  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    if (!trackMetrics || typeof window === 'undefined') return;

    // Medir TTFB
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      setMetrics(prev => ({ ...prev, ttfb }));
    }

    // Observador para Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // LCP Observer
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // FID Observer
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'first-input') {
              const fidEntry = entry as PerformanceEventTiming;
              setMetrics(prev => ({ ...prev, fid: fidEntry.processingStart - fidEntry.startTime }));
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // CLS Observer
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // FCP Observer
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0] as PerformanceEntry;
          setMetrics(prev => ({ ...prev, fcp: firstEntry.startTime }));
        });
        fcpObserver.observe({ entryTypes: ['paint'] });

        observerRef.current = lcpObserver;

        return () => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
          fcpObserver.disconnect();
        };
      } catch (error) {
        console.warn('PerformanceObserver no soportado:', error);
      }
    }
  }, [trackMetrics]);

  // Calcular score cuando cambien las métricas
  useEffect(() => {
    const score = speedUtils.calculateScore(metrics);
    setMetrics(prev => ({ ...prev, score }));
    
    if (onMetricsUpdate) {
      onMetricsUpdate({ ...metrics, score });
    }
  }, [metrics.lcp, metrics.fid, metrics.cls, onMetricsUpdate]);

  // Optimizaciones automáticas
  useEffect(() => {
    // Preload recursos críticos
    const preloadCriticalResources = () => {
      const criticalPaths = [
        '/styles/critical.css',
        '/fonts/inter-var.woff2',
        '/images/optimized/logo.webp',
      ];

      criticalPaths.forEach(path => {
        if (!document.querySelector(`link[href="${path}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = path;
          link.as = path.includes('.css') ? 'style' : 
                   path.includes('.woff') ? 'font' : 'image';
          if (path.includes('.woff')) link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      });
    };

    // Optimizar fuentes
    const optimizeFonts = () => {
      const fontLinks = document.querySelectorAll('link[rel="preload"][as="font"]');
      fontLinks.forEach(link => {
        link.setAttribute('crossorigin', 'anonymous');
      });
    };

    // Lazy load imágenes no críticas
    const lazyLoadImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      }, { threshold: 0.1, rootMargin: '50px' });

      images.forEach(img => imageObserver.observe(img));
    };

    preloadCriticalResources();
    optimizeFonts();
    lazyLoadImages();
  }, []);

  // Debug panel
  if (!showDebug) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <h3 className="font-bold mb-2">Core Web Vitals</h3>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={metrics.lcp && metrics.lcp <= speedTargets.lcp ? 'text-green-400' : 'text-red-400'}>
            {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : '...'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>FID:</span>
          <span className={metrics.fid && metrics.fid <= speedTargets.fid ? 'text-green-400' : 'text-red-400'}>
            {metrics.fid ? `${Math.round(metrics.fid)}ms` : '...'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={metrics.cls && metrics.cls <= speedTargets.cls ? 'text-green-400' : 'text-red-400'}>
            {metrics.cls ? metrics.cls.toFixed(3) : '...'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={metrics.fcp && metrics.fcp <= speedTargets.fcp ? 'text-green-400' : 'text-red-400'}>
            {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : '...'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span className={metrics.ttfb && metrics.ttfb <= speedTargets.ttfb ? 'text-green-400' : 'text-red-400'}>
            {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : '...'}
          </span>
        </div>
        <div className="border-t border-gray-600 pt-1 mt-1">
          <div className="flex justify-between">
            <span>Score:</span>
            <span className={metrics.score >= 90 ? 'text-green-400' : metrics.score >= 50 ? 'text-yellow-400' : 'text-red-400'}>
              {metrics.score}/100
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook para usar métricas de rendimiento
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    score: 0,
  });

  return {
    metrics,
    setMetrics,
    isOptimized: metrics.score >= 90,
    needsOptimization: metrics.score < 50,
  };
}

// Tipos para TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
} 