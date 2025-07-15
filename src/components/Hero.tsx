import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero gradient-bg">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Aprende IA de los
            <span className="block">mejores expertos del mundo</span>
          </h1>
          <p className="hero-description">
            Domina el aprendizaje automático e inteligencia artificial con
            cursos diseñados por expertos de clase mundial. Comienza tu viaje
            en IA hoy mismo.
          </p>
          <div className="hero-buttons">
            <Link href="/courses" className="btn btn-white">
              Explorar Cursos
            </Link>
            <Link href="/the-batch" className="btn btn-outline">
              Leer Noticias IA
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 