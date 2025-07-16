import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="footer-logo">eGrow-academy</h3>
            <p>Haciendo la IA accesible para todos</p>
          </div>
          <div className="footer-column">
            <h4>Aprende</h4>
            <ul>
              <li><Link href="/cursos-cortos">Cursos Cortos</Link></li>
              <li><Link href="/especializaciones">Especializaciones</Link></li>
              <li><Link href="/courses">Proyectos Prácticos</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Comunidad</h4>
            <ul>
              <li><Link href="/community">Foro</Link></li>
              <li><Link href="/community">Eventos</Link></li>
              <li><Link href="/resources">Blog</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Empresa</h4>
            <ul>
              <li><Link href="/company">Acerca de</Link></li>
              <li><Link href="/company">Carreras</Link></li>
              <li><Link href="/company">Contacto</Link></li>
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