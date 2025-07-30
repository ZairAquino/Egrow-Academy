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
}

export default function ElegantPromotionBanner({ promotion, onClose, onTrack }: ElegantPromotionBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Mostrar banner después de 2 segundos (más rápido que antes)
    const timer = setTimeout(() => {
      setIsVisible(true);
      onTrack?.('impression');
    }, 2000);

    return () => clearTimeout(timer);
  }, [onTrack]);

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
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {promotion.title}
                  </h3>
                  {promotion.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {promotion.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleClick}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {promotion.ctaText}
                </button>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                  aria-label="Cerrar banner"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 