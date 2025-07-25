'use client';

import { useEffect, useState } from 'react';

export default function CompaniesMarquee() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Detectar Safari
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsSafari(isSafariBrowser);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // Fix específico para Safari
          if (isSafariBrowser) {
            setTimeout(() => {
              const marqueeContent = document.querySelector('.marquee-content');
              if (marqueeContent) {
                (marqueeContent as HTMLElement).style.webkitTransform = 'translate3d(0, 0, 0)';
                (marqueeContent as HTMLElement).style.transform = 'translate3d(0, 0, 0)';
              }
            }, 100);
          }
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.companies-marquee');
    if (element) {
      observer.observe(element);
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
    <section className="companies-marquee">
      <div className="marquee-container">
        <div className={`marquee-content ${isVisible ? 'animate' : ''}`}>
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