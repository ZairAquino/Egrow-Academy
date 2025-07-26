'use client';

import { useEffect } from 'react';

interface PerformanceOptimizerProps {
  enableCoreWebVitals?: boolean;
  enablePerformanceTracking?: boolean;
  enableUserBehaviorTracking?: boolean;
}

export default function PerformanceOptimizer({
  enableCoreWebVitals = true,
  enablePerformanceTracking = true,
  enableUserBehaviorTracking = true,
}: PerformanceOptimizerProps) {
  useEffect(() => {
    if (!enableCoreWebVitals && !enablePerformanceTracking && !enableUserBehaviorTracking) {
      return;
    }

    // Core Web Vitals Tracking
    if (enableCoreWebVitals && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            const lcp = entry.startTime;
            console.log('LCP:', lcp);
            
            // Enviar a analytics si está disponible
            if (window.gtag) {
              window.gtag('event', 'core_web_vital', {
                event_category: 'Web Vitals',
                event_label: 'LCP',
                value: Math.round(lcp),
                non_interaction: true,
              });
            }
          }
          
          if (entry.entryType === 'first-input') {
            const fid = entry.processingStart - entry.startTime;
            console.log('FID:', fid);
            
            if (window.gtag) {
              window.gtag('event', 'core_web_vital', {
                event_category: 'Web Vitals',
                event_label: 'FID',
                value: Math.round(fid),
                non_interaction: true,
              });
            }
          }
          
          if (entry.entryType === 'layout-shift') {
            const cls = entry.value;
            console.log('CLS:', cls);
            
            if (window.gtag) {
              window.gtag('event', 'core_web_vital', {
                event_category: 'Web Vitals',
                event_label: 'CLS',
                value: Math.round(cls * 1000),
                non_interaction: true,
              });
            }
          }
        }
      });

      observer.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
      });

      return () => observer.disconnect();
    }

    // Performance Tracking
    if (enablePerformanceTracking && 'performance' in window) {
      const trackPerformance = () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            const metrics = {
              dns: navigation.domainLookupEnd - navigation.domainLookupStart,
              tcp: navigation.connectEnd - navigation.connectStart,
              ttfb: navigation.responseStart - navigation.requestStart,
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
              loadComplete: navigation.loadEventEnd - navigation.navigationStart,
            };

            console.log('Performance Metrics:', metrics);
            
            if (window.gtag) {
              Object.entries(metrics).forEach(([key, value]) => {
                window.gtag('event', 'performance_metric', {
                  event_category: 'Performance',
                  event_label: key,
                  value: Math.round(value),
                  non_interaction: true,
                });
              });
            }
          }
        }, 0);
      };

      if (document.readyState === 'complete') {
        trackPerformance();
      } else {
        window.addEventListener('load', trackPerformance);
      }
    }

    // User Behavior Tracking
    if (enableUserBehaviorTracking) {
      const trackEvent = (eventName: string, parameters: any = {}) => {
        if (window.gtag) {
          window.gtag('event', eventName, {
            event_category: 'egrow_academy',
            event_label: window.location.pathname,
            ...parameters,
          });
        }

        if (window.fbq) {
          window.fbq('track', eventName, parameters);
        }
      };

      // Tracking de clicks en cursos
      const handleCourseClick = (e: Event) => {
        const target = e.target as HTMLElement;
        const courseLink = target.closest('a[href*="/curso/"]');
        if (courseLink) {
          const courseSlug = courseLink.getAttribute('href')?.split('/').pop();
          trackEvent('course_click', {
            course_slug: courseSlug,
            course_title: courseLink.textContent?.trim(),
          });
        }
      };

      // Tracking de clicks en CTA
      const handleCTAClick = (e: Event) => {
        const target = e.target as HTMLElement;
        const ctaButton = target.closest('button[data-cta], a[data-cta]');
        if (ctaButton) {
          const ctaType = ctaButton.getAttribute('data-cta');
          trackEvent('cta_click', {
            cta_type: ctaType,
            cta_text: ctaButton.textContent?.trim(),
          });
        }
      };

      // Tracking de scroll
      let scrollDepth = 0;
      const handleScroll = () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > scrollDepth && scrollPercent % 25 === 0) {
          scrollDepth = scrollPercent;
          trackEvent('scroll_depth', {
            scroll_percentage: scrollPercent,
          });
        }
      };

      // Tracking de tiempo en página
      let startTime = Date.now();
      const trackTimeOnPage = () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        if (timeSpent % 30 === 0 && timeSpent > 0) {
          trackEvent('time_on_page', {
            time_spent_seconds: timeSpent,
          });
        }
      };

      // Agregar event listeners
      document.addEventListener('click', handleCourseClick);
      document.addEventListener('click', handleCTAClick);
      window.addEventListener('scroll', handleScroll, { passive: true });
      const timeInterval = setInterval(trackTimeOnPage, 1000);

      // Cleanup
      return () => {
        document.removeEventListener('click', handleCourseClick);
        document.removeEventListener('click', handleCTAClick);
        window.removeEventListener('scroll', handleScroll);
        clearInterval(timeInterval);
      };
    }
  }, [enableCoreWebVitals, enablePerformanceTracking, enableUserBehaviorTracking]);

  return null; // Este componente no renderiza nada
}

// Hook para tracking personalizado
export const usePerformanceTracking = () => {
  const trackEvent = (eventName: string, parameters: any = {}) => {
    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'egrow_academy',
        event_label: window.location.pathname,
        ...parameters,
      });
    }

    if (window.fbq) {
      window.fbq('track', eventName, parameters);
    }
  };

  const trackPageView = (pageTitle?: string, pageUrl?: string) => {
    const title = pageTitle || document.title;
    const url = pageUrl || window.location.href;

    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_title: title,
        page_location: url,
      });
    }

    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  };

  const trackConversion = (value?: number, currency: string = 'MXN') => {
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
        value: value,
        currency: currency,
      });
    }

    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: value,
        currency: currency,
      });
    }
  };

  return {
    trackEvent,
    trackPageView,
    trackConversion,
  };
};

// Tipos para TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
} 