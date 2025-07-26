import { Metadata } from 'next';
import { ampConfig, ampUtils, ampStyles } from '@/lib/amp-config';
import AMPImage from '@/components/amp/AMPImage';
import AMPCarousel, { AMPCourseCarousel } from '@/components/amp/AMPCarousel';
import AMPAnalytics, { AMPHomeAnalytics } from '@/components/amp/AMPAnalytics';

// Datos de ejemplo
const featuredCourses = [
  {
    id: '1',
    title: 'Machine Learning Fundamentals',
    shortDescription: 'Aprende los fundamentos del machine learning',
    image: '/images/courses/ml-fundamentals.jpg',
    slug: 'machine-learning-fundamentals',
  },
  {
    id: '2',
    title: 'Deep Learning con Python',
    shortDescription: 'Domina las redes neuronales profundas',
    image: '/images/courses/deep-learning.jpg',
    slug: 'deep-learning-python',
  },
  {
    id: '3',
    title: 'Data Science Completo',
    shortDescription: 'Curso completo de ciencia de datos',
    image: '/images/courses/data-science.jpg',
    slug: 'data-science-completo',
  },
];

const testimonials = [
  {
    id: '1',
    name: 'Carlos Rodríguez',
    quote: 'Excelente plataforma para aprender IA. Los cursos son muy prácticos.',
    avatar: '/images/testimonials/carlos.jpg',
  },
  {
    id: '2',
    name: 'Ana Martínez',
    quote: 'Los instructores son expertos y el contenido es de alta calidad.',
    avatar: '/images/testimonials/ana.jpg',
  },
  {
    id: '3',
    name: 'Luis García',
    quote: 'He mejorado significativamente mis habilidades en machine learning.',
    avatar: '/images/testimonials/luis.jpg',
  },
];

export const metadata: Metadata = {
  title: 'eGrow Academy - Página AMP',
  description: 'Plataforma de aprendizaje de Inteligencia Artificial optimizada para móviles',
  keywords: 'AMP, mobile, IA, machine learning, cursos online',
};

export default function AMPPage() {
  return (
    <>
        {/* Analytics AMP */}
        <AMPHomeAnalytics />
        
        {/* Header */}
        <header className="amp-header">
          <div className="amp-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AMPImage
                  src="/images/optimized/logo.webp"
                  alt="eGrow Academy"
                  width={120}
                  height={40}
                  layout="fixed"
                  priority={true}
                />
              </div>
              
              <nav>
                <a href="/cursos" className="amp-button">Cursos</a>
                <a href="/blog" className="amp-button">Blog</a>
                <a href="/contacto" className="amp-button">Contacto</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="amp-hero">
          <div className="amp-container">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              Aprende Inteligencia Artificial
            </h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
              Domina las tecnologías del futuro con nuestros cursos expertos
            </p>
            <a href="/cursos" className="amp-button amp-browse-courses">
              Explorar Cursos
            </a>
          </div>
        </section>

        {/* Featured Courses */}
        <section style={{ padding: '4rem 0' }}>
          <div className="amp-container">
            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>
              Cursos Destacados
            </h2>
            
            <AMPCourseCarousel courses={featuredCourses} />
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ padding: '4rem 0', backgroundColor: '#f9fafb' }}>
          <div className="amp-container">
            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>
              Lo que dicen nuestros estudiantes
            </h2>
            
            <AMPCarousel
              items={testimonials.map(t => ({
                id: t.id,
                src: t.avatar,
                alt: t.name,
                title: t.name,
                description: t.quote,
              }))}
              width={600}
              height={200}
              type="slides"
              autoplay={true}
              delay={4000}
              className="amp-testimonial-carousel"
            />
          </div>
        </section>

        {/* Newsletter Signup */}
        <section style={{ padding: '4rem 0', backgroundColor: '#2563eb', color: 'white' }}>
          <div className="amp-container">
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ marginBottom: '1rem' }}>
                Mantente Actualizado
              </h2>
              <p style={{ marginBottom: '2rem' }}>
                Recibe las últimas noticias sobre IA y nuevos cursos
              </p>
              
              <form
                method="POST"
                action="/api/newsletter"
                target="_top"
                className="amp-newsletter-form"
              >
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Tu email"
                    required
                    style={{
                      padding: '0.75rem',
                      border: 'none',
                      borderRadius: '4px',
                      minWidth: '250px',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'white',
                      color: '#2563eb',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Suscribirse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{ padding: '4rem 0' }}>
          <div className="amp-container">
            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>
              Preguntas Frecuentes
            </h2>
            
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <section>
                <h3 style={{ padding: '1rem', margin: 0, backgroundColor: '#f3f4f6' }}>
                  ¿Qué nivel de experiencia necesito?
                </h3>
                <div style={{ padding: '1rem' }}>
                  Nuestros cursos están diseñados para todos los niveles, desde principiantes hasta avanzados. 
                  Cada curso incluye material introductorio para asegurar que todos puedan seguir.
                </div>
              </section>
              
              <section>
                <h3 style={{ padding: '1rem', margin: 0, backgroundColor: '#f3f4f6' }}>
                  ¿Los cursos incluyen certificados?
                </h3>
                <div style={{ padding: '1rem' }}>
                  Sí, todos nuestros cursos incluyen certificados de finalización que puedes compartir 
                  en LinkedIn y agregar a tu CV.
                </div>
              </section>
              
              <section>
                <h3 style={{ padding: '1rem', margin: 0, backgroundColor: '#f3f4f6' }}>
                  ¿Puedo acceder al contenido sin conexión?
                </h3>
                <div style={{ padding: '1rem' }}>
                  Sí, puedes descargar el contenido de los cursos para verlo sin conexión 
                  desde nuestra aplicación móvil.
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* Social Share */}
        <section style={{ padding: '2rem 0', backgroundColor: '#f9fafb' }}>
          <div className="amp-container">
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '1rem' }}>Comparte eGrow Academy</h3>
              <button
                style={{
                  width: '60px',
                  height: '44px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'eGrow Academy',
                      text: 'Aprende Inteligencia Artificial',
                      url: window.location.href,
                    });
                  }
                }}
              >
                Compartir
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ backgroundColor: '#1f2937', color: 'white', padding: '2rem 0' }}>
          <div className="amp-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              <div>
                <h4 style={{ marginBottom: '1rem' }}>eGrow Academy</h4>
                <p>Plataforma líder en educación de Inteligencia Artificial</p>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '1rem' }}>Enlaces</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}><a href="/cursos" style={{ color: 'white' }}>Cursos</a></li>
                  <li style={{ marginBottom: '0.5rem' }}><a href="/blog" style={{ color: 'white' }}>Blog</a></li>
                  <li style={{ marginBottom: '0.5rem' }}><a href="/sobre-nosotros" style={{ color: 'white' }}>Sobre Nosotros</a></li>
                  <li style={{ marginBottom: '0.5rem' }}><a href="/contacto" style={{ color: 'white' }}>Contacto</a></li>
                </ul>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '1rem' }}>Contacto</h4>
                <p>Email: info@egrow-academy.com</p>
                <p>Teléfono: +52 55 1234 5678</p>
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid #374151', marginTop: '2rem', paddingTop: '1rem', textAlign: 'center' }}>
              <p>&copy; 2024 eGrow Academy. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
    </>
  );
} 