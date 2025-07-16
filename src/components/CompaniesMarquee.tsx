'use client';

import { useEffect, useState } from 'react';

export default function CompaniesMarquee() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
      icon: '🤖',
      color: '#10a37f'
    },
    {
      name: 'Google AI',
      icon: '🧠',
      color: '#4285f4'
    },
    {
      name: 'Microsoft',
      icon: '💻',
      color: '#00a4ef'
    },
    {
      name: 'Meta AI',
      icon: '🔮',
      color: '#1877f2'
    },
    {
      name: 'Anthropic',
      icon: '🎯',
      color: '#ff6b35'
    },
    {
      name: 'DeepMind',
      icon: '🧬',
      color: '#00b4d8'
    },
    {
      name: 'NVIDIA',
      icon: '🚀',
      color: '#76b900'
    },
    {
      name: 'Hugging Face',
      icon: '🤗',
      color: '#ff6b6b'
    },
    {
      name: 'Stability AI',
      icon: '🎨',
      color: '#6c5ce7'
    },
    {
      name: 'Cohere',
      icon: '🔗',
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
              <span className="company-icon">{company.icon}</span>
              <span className="company-name">{company.name}</span>
            </div>
          ))}
          {/* Duplicated set for seamless loop */}
          {companies.map((company, index) => (
            <div key={`second-${index}`} className="company-logo" style={{ '--company-color': company.color } as React.CSSProperties}>
              <span className="company-icon">{company.icon}</span>
              <span className="company-name">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 