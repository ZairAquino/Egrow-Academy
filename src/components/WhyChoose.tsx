import Link from 'next/link';

export default function WhyChoose() {
  return (
    <section className="section bg-gray">
      <div className="container">
        <div className="why-choose-grid">
          <div className="why-choose-content">
            <h2 className="section-title">¿Por qué elegir eGrow-academy?</h2>
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <span>✓</span>
                </div>
                <div className="feature-text">
                  <h3>Instructores de Clase Mundial</h3>
                  <p>
                    Aprende de los mejores expertos en IA y aprendizaje
                    automático
                  </p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <span>✓</span>
                </div>
                <div className="feature-text">
                  <h3>Proyectos Prácticos</h3>
                  <p>
                    Construye aplicaciones reales de IA y gana experiencia
                    práctica
                  </p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <span>✓</span>
                </div>
                <div className="feature-text">
                  <h3>Reconocimiento Industrial</h3>
                  <p>
                    Certificados valorados por las mejores empresas
                    tecnológicas del mundo
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="cta-card">
            <h3>¿Listo para comenzar?</h3>
            <p>
              Únete a millones de estudiantes desarrollando habilidades en IA
              con eGrow-academy
            </p>
            <Link href="/courses" className="btn btn-primary btn-block">
              Comenzar Hoy
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 