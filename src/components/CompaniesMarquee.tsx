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
    'OpenAI',
    'Google AI',
    'Microsoft',
    'Meta AI',
    'Anthropic',
    'DeepMind',
    'NVIDIA',
    'Hugging Face',
    'Stability AI',
    'Cohere'
  ];

  return (
    <section className="companies-marquee">
      <div className="marquee-container">
        <div className={`marquee-content ${isVisible ? 'animate' : ''}`}>
          {/* First set of companies */}
          {companies.map((company, index) => (
            <div key={`first-${index}`} className="company-logo">
              <span>{company}</span>
            </div>
          ))}
          {/* Duplicated set for seamless loop */}
          {companies.map((company, index) => (
            <div key={`second-${index}`} className="company-logo">
              <span>{company}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 