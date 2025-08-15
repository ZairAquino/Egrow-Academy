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
    console.log('🎯 PremiumSubscriptionBanner - Estado inicial:', { isVisible, skipDelay });
    
    if (skipDelay) {
      // Si skipDelay es true, mostrar inmediatamente
      console.log('🚀 Banner mostrando inmediatamente (skipDelay)');
      setIsVisible(true);
      onTrack?.('impression');
    } else {
      // Mostrar banner después de 2 segundos
      console.log('⏰ Banner programado para mostrar en 2 segundos');
      const timer = setTimeout(() => {
        console.log('✨ Banner mostrando después del delay');
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
    <div className={`w-full transition-all duration-700 banner-container ${
      isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}>
      <div className="max-w-7xl mx-auto px-0 sm:px-8 lg:px-10">
                 <div className={`bg-gradient-to-l from-[#0057b9] to-[#2eb6e4] rounded-none shadow-xl overflow-hidden transition-all duration-700 ${
           isVisible ? 'animate-slide-down' : 'animate-slide-up'
         }`}>
           <div className="p-4 sm:p-6 md:p-4 lg:p-6 banner-content">
            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-3 md:gap-7">
              {/* Contenido del texto */}
              <div className="flex-1 text-left text-white">
                <h3 className="text-lg sm:text-xl md:text-lg lg:text-2xl font-bold leading-tight mb-2 md:mb-3 text-white">
                  Consigue acceso ilimitado a todos nuestros cursos con Plus
                </h3>
                
                <p className="text-sm sm:text-base md:text-sm lg:text-lg text-white leading-relaxed">
                  Accede a todos los cursos, recursos exclusivos y certificados
                </p>
              </div>
              
              {/* Botón de acción */}
              <div className="flex items-center justify-center lg:justify-end space-x-2 md:space-x-4 flex-shrink-0">
                <button
                  onClick={handleClick}
                  className="bg-white text-emerald-600 px-4 py-2 md:px-7 md:py-3 rounded-xl text-sm md:text-lg font-bold hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Suscribirse Ahora
                </button>
                
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white transition-colors duration-200 p-1 md:p-2 rounded-full hover:bg-white/10"
                  aria-label="Cerrar banner"
                >
                  <X size={16} className="md:w-[18px] md:h-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
             <style jsx>{`
         /* Posicionamiento para que esté detrás del background del hero */
         .banner-container {
           position: relative;
           z-index: -2;
         }
         
         /* Animaciones de deslizamiento */
         @keyframes slideDown {
           from {
             transform: translateY(-100%);
             opacity: 0;
           }
           to {
             transform: translateY(0);
             opacity: 1;
           }
         }
         
         @keyframes slideUp {
           from {
             transform: translateY(0);
             opacity: 1;
           }
           to {
             transform: translateY(-100%);
             opacity: 0;
           }
         }
         
         .animate-slide-down {
           animation: slideDown 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
         }
         
         .animate-slide-up {
           animation: slideUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
         }
        
                 /* Estilos responsivos para móviles */
         @media (max-width: 768px) {
           .banner-content {
             padding: 0.3rem 0.8rem !important;
           }
          
          .banner-content h3 {
            font-size: 0.9rem !important;
            margin-bottom: 0.2rem !important;
            line-height: 1.2 !important;
          }
          
          .banner-content p {
            font-size: 0.75rem !important;
            margin-bottom: 0.3rem !important;
            line-height: 1.2 !important;
          }
          
          .banner-content button {
            padding: 0.3rem 0.8rem !important;
            font-size: 0.75rem !important;
          }
          
          .banner-content .flex {
            gap: 0.3rem !important;
          }
        }
        
                 @media (max-width: 480px) {
           .banner-content {
             padding: 0.2rem 0.6rem !important;
           }
          
          .banner-content h3 {
            font-size: 0.8rem !important;
            margin-bottom: 0.15rem !important;
          }
          
          .banner-content p {
            font-size: 0.7rem !important;
            margin-bottom: 0.2rem !important;
          }
          
          .banner-content button {
            padding: 0.25rem 0.6rem !important;
            font-size: 0.7rem !important;
          }
        }
      `}</style>
    </div>
  );
}
