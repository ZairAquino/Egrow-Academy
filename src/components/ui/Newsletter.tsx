'use client';

import Link from 'next/link';

export default function Newsletter() {
  return (
    <section className="section newsletter-section">
      <div className="container">
        <div className="newsletter-content">
          {/* Botón de suscripción a planes premium */}
          <div className="premium-subscription-section">
            <h3 className="premium-title">¿Quieres acceso completo?</h3>
            <p className="premium-description">
              Obtén acceso a todos nuestros cursos premium y recursos exclusivos
            </p>
            <Link href="/subscription" className="btn btn-secondary premium-btn">
              Ver Planes de Suscripción
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 