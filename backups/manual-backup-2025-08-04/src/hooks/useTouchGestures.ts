'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchIn?: () => void;
  onPinchOut?: () => void;
  onPullToRefresh?: () => void;
  threshold?: number;
  enabled?: boolean;
}

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export const useTouchGestures = (options: TouchGestureOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinchIn,
    onPinchOut,
    onPullToRefresh,
    threshold = 50,
    enabled = true
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [touchStart, setTouchStart] = useState<TouchPoint | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchPoint | null>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    });
    setTouchEnd(null);
  }, [enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || !touchStart) return;

    const touch = e.touches[0];
    const currentY = touch.clientY;
    const startY = touchStart.y;
    const distance = startY - currentY;

    // Pull to refresh detection
    if (currentY > startY && distance > 0) {
      setIsPulling(true);
      setPullDistance(Math.min(distance, 100));
    }
  }, [enabled, touchStart]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enabled || !touchStart) return;

    const touch = e.changedTouches[0];
    const endPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };

    setTouchEnd(endPoint);

    // Calculate swipe direction
    const deltaX = touchStart.x - endPoint.x;
    const deltaY = touchStart.y - endPoint.y;
    const deltaTime = endPoint.timestamp - touchStart.timestamp;

    // Only trigger if movement is significant and fast enough
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      if (deltaTime < 500) { // Swipe must be fast
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > threshold) {
            onSwipeLeft?.();
          } else if (deltaX < -threshold) {
            onSwipeRight?.();
          }
        } else {
          // Vertical swipe
          if (deltaY > threshold) {
            onSwipeUp?.();
          } else if (deltaY < -threshold) {
            onSwipeDown?.();
          }
        }
      }
    }

    // Pull to refresh
    if (isPulling && pullDistance > 80) {
      onPullToRefresh?.();
    }

    // Reset states
    setIsPulling(false);
    setPullDistance(0);
    setTouchStart(null);
    setTouchEnd(null);
  }, [enabled, touchStart, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPullToRefresh, isPulling, pullDistance]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    elementRef,
    isPulling,
    pullDistance
  };
};

// Hook específico para pull-to-refresh
export const usePullToRefresh = (onRefresh?: () => void) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  const { elementRef, isPulling, pullDistance } = useTouchGestures({
    onPullToRefresh: handleRefresh,
    enabled: true
  });

  useEffect(() => {
    if (isPulling) {
      setPullProgress(Math.min(pullDistance / 100, 1));
    } else {
      setPullProgress(0);
    }
  }, [isPulling, pullDistance]);

  return {
    elementRef,
    isRefreshing,
    pullProgress,
    isPulling
  };
};

// Hook para swipe navigation
export const useSwipeNavigation = (onSwipeLeft?: () => void, onSwipeRight?: () => void) => {
  return useTouchGestures({
    onSwipeLeft,
    onSwipeRight,
    threshold: 80
  });
};

// Hook para pinch gestures
export const usePinchGesture = (onPinchIn?: () => void, onPinchOut?: () => void) => {
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [currentDistance, setCurrentDistance] = useState<number | null>(null);

  const calculateDistance = (touches: TouchList) => {
    if (touches.length < 2) return null;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = calculateDistance(e.touches);
      setInitialDistance(distance);
      setCurrentDistance(distance);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && initialDistance !== null) {
      const distance = calculateDistance(e.touches);
      setCurrentDistance(distance);
    }
  }, [initialDistance]);

  const handleTouchEnd = useCallback(() => {
    if (initialDistance !== null && currentDistance !== null) {
      const threshold = 50;
      const delta = currentDistance - initialDistance;
      
      if (Math.abs(delta) > threshold) {
        if (delta > 0) {
          onPinchOut?.();
        } else {
          onPinchIn?.();
        }
      }
    }
    
    setInitialDistance(null);
    setCurrentDistance(null);
  }, [initialDistance, currentDistance, onPinchIn, onPinchOut]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isPinching: initialDistance !== null,
    pinchProgress: initialDistance && currentDistance 
      ? Math.abs(currentDistance - initialDistance) / initialDistance 
      : 0
  };
}; 