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
            <div className="social-media-links" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a href="https://www.instagram.com/egrow_latam/" target="_blank" rel="noopener noreferrer" style={{ color: '#E4405F', fontSize: '1.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@egrow.lat" target="_blank" rel="noopener noreferrer" style={{ color: '#000000', fontSize: '1.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/egrowlat" target="_blank" rel="noopener noreferrer" style={{ color: '#0077B5', fontSize: '1.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="footer-column">
            <h4>Aprende</h4>
            <ul>
              <li><Link href="/cursos-gratuitos">Cursos Gratuitos</Link></li>
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
          <div className="footer-legal">
            <p>&copy; 2024 eGrow-academy. Todos los derechos reservados.</p>
            <div className="footer-links">
              <Link href="/terminos-condiciones" className="footer-link">
                Términos y Condiciones
              </Link>
              <span className="footer-separator">|</span>
              <Link href="/politica-privacidad" className="footer-link">
                Política de Privacidad
              </Link>
              <span className="footer-separator">|</span>
              <Link href="/facturacion" className="footer-link">
                Facturación
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 