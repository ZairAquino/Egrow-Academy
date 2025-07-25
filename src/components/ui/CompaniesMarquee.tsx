'use client';

import { useEffect, useState, useRef } from 'react';

export default function CompaniesMarquee() {
  const [isVisible, setIsVisible] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detectar Safari y dispositivos móviles
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafariMobile = (isSafari || isIOS) && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // Fix específico para Safari/iOS móvil
          if (isSafariMobile && contentRef.current) {
            const element = contentRef.current;
            
            // Método más agresivo para Safari móvil
            setTimeout(() => {
              // Limpiar clases
              element.classList.remove('animate');
              element.style.animation = 'none';
              element.style.webkitAnimation = 'none';
              
              // Forzar reflow
              element.offsetHeight;
              
              // Aplicar estilos de hardware acceleration
              element.style.webkitTransform = 'translate3d(0, 0, 0)';
              element.style.transform = 'translate3d(0, 0, 0)';
              element.style.webkitBackfaceVisibility = 'hidden';
              element.style.backfaceVisibility = 'hidden';
              element.style.willChange = 'transform';
              
              // Re-aplicar la animación con JavaScript
              element.style.webkitAnimation = 'marquee 25s linear infinite';
              element.style.animation = 'marquee 25s linear infinite';
              element.classList.add('animate');
              
              // Double-check después de un segundo
              setTimeout(() => {
                if (element.style.animationPlayState !== 'running') {
                  element.style.animationPlayState = 'running';
                  element.style.webkitAnimationPlayState = 'running';
                }
              }, 1000);
            }, 100);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (marqueeRef.current) {
      observer.observe(marqueeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const companies = [
    {
      name: 'OpenAI',
      color: '#10a37f'
    },
    {
      name: 'Google AI',
      color: '#4285f4'
    },
    {
      name: 'Microsoft',
      color: '#00a4ef'
    },
    {
      name: 'Meta AI',
      color: '#1877f2'
    },
    {
      name: 'Anthropic',
      color: '#ff6b35'
    },
    {
      name: 'DeepMind',
      color: '#00b4d8'
    },
    {
      name: 'NVIDIA',
      color: '#76b900'
    },
    {
      name: 'Hugging Face',
      color: '#ff6b6b'
    },
    {
      name: 'Stability AI',
      color: '#6c5ce7'
    },
    {
      name: 'Cohere',
      color: '#fd79a8'
    }
  ];

  return (
    <section ref={marqueeRef} className="companies-marquee">
      <div className="marquee-container">
        <div ref={contentRef} className={`marquee-content ${isVisible ? 'animate' : ''}`}>
          {/* First set of companies */}
          {companies.map((company, index) => (
            <div key={`first-${index}`} className="company-logo" style={{ '--company-color': company.color } as React.CSSProperties}>
              <span className="company-name">{company.name}</span>
            </div>
          ))}
          {/* Duplicated set for seamless loop */}
          {companies.map((company, index) => (
            <div key={`second-${index}`} className="company-logo" style={{ '--company-color': company.color } as React.CSSProperties}>
              <span className="company-name">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 