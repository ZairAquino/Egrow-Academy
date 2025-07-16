import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo-link">
              <h3 className="footer-logo">eGrow-academy</h3>
            </Link>
            <p>Haciendo la IA accesible para todos</p>
          </div>
          <div className="footer-column">
            <h4>Aprende</h4>
            <ul>
              <li><Link href="/cursos-cortos">Cursos Gratuitos</Link></li>
              <li><Link href="/courses">Todos los Cursos</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Comunidad</h4>
            <ul>
              <li><Link href="/community#forum">Foro</Link></li>
              <li><Link href="/community#events">Eventos</Link></li>
              <li><a href="https://egrow-theta.vercel.app/ai-news" target="_blank" rel="noopener noreferrer">Blog</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>AI Experts</h4>
            <ul>
              <li><a href="https://egrow.lat/ai-experts" target="_blank" rel="noopener noreferrer">Acerca de</a></li>
              <li><Link href="/contacto">Contacto</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 eGrow-academy. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
} 