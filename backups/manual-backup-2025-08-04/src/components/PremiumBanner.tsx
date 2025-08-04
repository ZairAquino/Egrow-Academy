'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface Promotion {
  id: string;
  type: 'PREMIUM_SUBSCRIPTION' | 'NEW_COURSE' | 'SPECIAL_OFFER';
  title: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl?: string;
}

interface PremiumBannerProps {
  promotion: Promotion;
  onClose?: () => void;
  onTrack?: (action: 'impression' | 'click' | 'close' | 'conversion') => void;
}

export default function PremiumBanner({ promotion, onClose, onTrack }: PremiumBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Mostrar banner después de 3 segundos
    const timer = setTimeout(() => {
      setIsVisible(true);
      onTrack?.('impression');
    }, 3000);

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
    <div className={`w-full transition-all duration-300 ${
      isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg rounded-lg mx-4 my-6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <span className="text-2xl">✨</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold leading-tight">
                  {promotion.title}
                </h3>
                {promotion.description && (
                  <p className="text-xs text-purple-100 mt-1">
                    {promotion.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleClick}
                className="bg-white text-purple-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-purple-50 transition-colors duration-200"
              >
                {promotion.ctaText}
              </button>
              <button
                onClick={handleClose}
                className="text-white hover:text-purple-200 transition-colors duration-200"
                aria-label="Cerrar banner"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 