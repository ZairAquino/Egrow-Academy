'use client';

import { useState, useEffect, useCallback } from 'react';

interface ViewportInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  orientation: 'landscape' | 'portrait';
  pixelRatio: number;
  touchSupport: boolean;
}

export const useViewport = (): ViewportInfo => {
  const [viewportInfo, setViewportInfo] = useState<ViewportInfo>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLandscape: false,
    isPortrait: false,
    orientation: 'portrait',
    pixelRatio: 1,
    touchSupport: false
  });

  const updateViewport = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Determinar orientación
    const isLandscape = width > height;
    const isPortrait = height > width;
    const orientation = isLandscape ? 'landscape' : 'portrait';

    // Determinar tipo de dispositivo
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;

    setViewportInfo({
      width,
      height,
      isMobile,
      isTablet,
      isDesktop,
      isLandscape,
      isPortrait,
      orientation,
      pixelRatio,
      touchSupport
    });
  }, []);

  useEffect(() => {
    // Actualizar en el montaje
    updateViewport();

    // Escuchar cambios de tamaño
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, [updateViewport]);

  return viewportInfo;
};

// Hook para optimizaciones específicas de móvil
export const useMobileOptimizations = () => {
  const viewport = useViewport();
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Detectar conexión lenta
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        setIsLowBandwidth(true);
      }
    }

    // Detectar dispositivo de bajo rendimiento
    const cores = navigator.hardwareConcurrency || 1;
    const memory = (navigator as any).deviceMemory || 1;
    
    if (cores < 4 || memory < 2) {
      setIsLowPerformance(true);
    }
  }, []);

  return {
    ...viewport,
    isLowBandwidth,
    isLowPerformance,
    shouldOptimizeImages: viewport.isMobile || isLowBandwidth,
    shouldReduceAnimations: isLowPerformance,
    shouldLazyLoad: viewport.isMobile || isLowBandwidth
  };
};

// Hook para gestos móviles específicos
export const useMobileGestures = () => {
  const viewport = useViewport();
  const [lastTap, setLastTap] = useState(0);
  const [doubleTapTimeout, setDoubleTapTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleDoubleTap = useCallback((callback: () => void) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTap && (now - lastTap) < DOUBLE_TAP_DELAY) {
      // Es un doble tap
      if (doubleTapTimeout) {
        clearTimeout(doubleTapTimeout);
        setDoubleTapTimeout(null);
      }
      callback();
    } else {
      // Es un tap simple
      const timeout = setTimeout(() => {
        // Single tap action if no double tap occurs
      }, DOUBLE_TAP_DELAY);
      setDoubleTapTimeout(timeout);
    }

    setLastTap(now);
  }, [lastTap, doubleTapTimeout]);

  const handleLongPress = useCallback((callback: () => void, duration = 500) => {
    let pressTimer: NodeJS.Timeout | null = null;
    let hasMoved = false;

    const startPress = () => {
      hasMoved = false;
      pressTimer = setTimeout(() => {
        if (!hasMoved) {
          callback();
        }
      }, duration);
    };

    const endPress = () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    const movePress = () => {
      hasMoved = true;
      endPress();
    };

    return { startPress, endPress, movePress };
  }, []);

  return {
    isMobile: viewport.isMobile,
    handleDoubleTap,
    handleLongPress
  };
};

// Hook para optimizaciones de scroll en móvil
export const useMobileScroll = () => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let ticking = false;
    let lastScrollY = 0;

    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrollY(currentScrollY);
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setIsScrolling(true);
      
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    const handleScrollEnd = () => {
      setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScrollEnd, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollEnd);
    };
  }, []);

  return {
    scrollY,
    scrollDirection,
    isScrolling
  };
}; 