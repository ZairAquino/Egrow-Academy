'use client';

import Link from 'next/link';

export default function Newsletter() {
  return (
    <section className="section newsletter-section">
      <div className="container">
        <div className="newsletter-content">
          <h3 className="newsletter-title">¡No te pierdas nuestros Webinars!</h3>
          <p className="newsletter-description">
            Únete a nuestros webinars gratuitos y aprende de expertos en Inteligencia Artificial
          </p>
          <Link href="/webinars" className="btn btn-secondary newsletter-btn">
            Ver Próximos Webinars
          </Link>
        </div>
      </div>
    </section>
  );
} 