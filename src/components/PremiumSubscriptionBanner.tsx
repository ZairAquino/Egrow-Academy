'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface PremiumSubscriptionBannerProps {
  onClose?: () => void;
  onTrack?: (action: 'impression' | 'click' | 'close') => void;
  skipDelay?: boolean;
}

export default function PremiumSubscriptionBanner({ 
  onClose, 
  onTrack, 
  skipDelay = false 
}: PremiumSubscriptionBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (skipDelay) {
      // Si skipDelay es true, mostrar inmediatamente
      setIsVisible(true);
      onTrack?.('impression');
    } else {
      // Mostrar banner después de 2 segundos
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
    router.push('/subscription');
  };

  if (!isVisible) return null;

  return (
    <div className={`w-full transition-all duration-500 ${
      isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-l from-[#0057b9] to-[#2eb6e4] rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-7">
              {/* Contenido del texto */}
              <div className="flex-1 text-center lg:text-left text-white">
                <h3 className="text-xl sm:text-2xl font-bold leading-tight mb-3 text-white">
                  Consigue acceso ilimitado a todos nuestros cursos con Plus
                </h3>
                
                <p className="text-base sm:text-lg text-white leading-relaxed">
                  Accede a todos los cursos, recursos exclusivos y certificados
                </p>
              </div>
              
              {/* Botón de acción */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                <button
                  onClick={handleClick}
                  className="bg-white text-emerald-600 px-7 py-3 rounded-xl text-lg font-bold hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Suscribirse Ahora
                </button>
                
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-white/10"
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
