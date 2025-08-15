'use client';

import { useState, useEffect, useRef } from 'react';

export default function CompaniesMarquee() {
  const [isVisible, setIsVisible] = useState(false);
  const marqueeRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
            <div key={`first-${index}`} className="company-card">
              <span className="company-name">{company.name}</span>
            </div>
          ))}
          {/* Duplicated set for seamless loop */}
          {companies.map((company, index) => (
            <div key={`second-${index}`} className="company-card">
              <span className="company-name">{company.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .companies-marquee {
          width: 100%;
          overflow: hidden;
          background: white;
          padding: 2rem 0;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }

        .marquee-container {
          width: 100%;
          overflow: hidden;
        }

        .marquee-content {
          display: flex;
          gap: 1rem;
          padding: 0 1rem;
        }

        .marquee-content.animate {
          animation: marquee 30s linear infinite;
        }

        .company-card {
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          min-width: 140px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .company-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .company-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          white-space: nowrap;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .companies-marquee {
            padding: 1rem 0;
          }

          .marquee-content {
            gap: 0.5rem;
            padding: 0 0.5rem;
          }

          .company-card {
            min-width: 120px;
            padding: 0.5rem 1rem;
          }

          .company-name {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </section>
  );
} 