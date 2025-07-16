'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para suscribir al newsletter
    console.log('Email suscrito:', email);
    setEmail('');
  };

  return (
    <section className="section newsletter-section">
      <div className="container">
        <div className="newsletter-content">
          <h2 className="section-title">The Batch Newsletter</h2>
          <p className="newsletter-description">
            Mantente actualizado con las últimas noticias de IA. Únete a más
            de 400,000 suscriptores y recibe actualizaciones semanales sobre
            investigación de IA, noticias de la industria y más.
          </p>
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="newsletter-input"
            />
            <button type="submit" className="btn btn-primary">
              Suscribirse
            </button>
          </form>
          <p className="newsletter-note">
            Al suscribirte, aceptas recibir comunicaciones de eGrow-academy.
          </p>
        </div>
      </div>
    </section>
  );
} 