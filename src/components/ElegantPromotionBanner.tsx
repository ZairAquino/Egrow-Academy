'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

interface Promotion {
  id: string;
  type: 'PREMIUM_SUBSCRIPTION' | 'NEW_COURSE' | 'SPECIAL_OFFER';
  title: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl?: string;
}

interface ElegantPromotionBannerProps {
  promotion: Promotion;
  onClose?: () => void;
  onTrack?: (action: 'impression' | 'click' | 'close' | 'conversion') => void;
  skipDelay?: boolean;
}

export default function ElegantPromotionBanner({ promotion, onClose, onTrack, skipDelay = false }: ElegantPromotionBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (skipDelay) {
      // Si skipDelay es true, mostrar inmediatamente
      setIsVisible(true);
      onTrack?.('impression');
    } else {
      // Mostrar banner después de 2 segundos (comportamiento original)
      const timer = setTimeout(() => {
        setIsVisible(true);
        onTrack?.('impression');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [onTrack, skipDelay]);

  const handleClose = () => {
    setIsClosing(true);
    onTrack?.('close');
    
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const handleClick = () => {
    onTrack?.('click');
    // La redirección se maneja en el hook usePromotions
  };

  if (!isVisible) return null;

  return (
    <div className={`w-full transition-all duration-500 ${
      isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}>
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight line-clamp-2">
                    {promotion.title}
                  </h3>
                  {promotion.description && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                      {promotion.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                <button
                  onClick={handleClick}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
                >
                  {promotion.ctaText}
                </button>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 flex-shrink-0"
                  aria-label="Cerrar banner"
                >
                  <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 