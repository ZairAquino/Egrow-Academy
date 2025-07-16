'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function TheBatchPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      // Aquí se integraría con tRPC para guardar el email
    }
  };

  const latestNews = [
    {
      id: 1,
      title: 'OpenAI lanza GPT-5 con capacidades multimodales avanzadas',
      excerpt: 'La nueva versión incluye mejoras significativas en razonamiento, creatividad y comprensión contextual.',
      category: 'Tecnología',
      date: '2024-01-15',
      readTime: '5 min',
      image: 'https://via.placeholder.com/400x250/667eea/ffffff?text=GPT-5+Launch'
    },
    {
      id: 2,
      title: 'Google presenta Gemini Ultra: El modelo más potente hasta la fecha',
      excerpt: 'Gemini Ultra supera a GPT-4 en múltiples benchmarks y establece nuevos estándares en IA.',
      category: 'Investigación',
      date: '2024-01-12',
      readTime: '7 min',
      image: 'https://via.placeholder.com/400x250/764ba2/ffffff?text=Gemini+Ultra'
    },
    {
      id: 3,
      title: 'Meta revoluciona la realidad aumentada con nuevos avances en IA',
      excerpt: 'Nuevas tecnologías de IA para mejorar la experiencia de realidad aumentada y virtual.',
      category: 'Innovación',
      date: '2024-01-10',
      readTime: '6 min',
      image: 'https://via.placeholder.com/400x250/f093fb/ffffff?text=Meta+AR+AI'
    },
    {
      id: 4,
      title: 'NVIDIA anuncia nuevos chips especializados para IA generativa',
      excerpt: 'Los nuevos procesadores están optimizados para entrenar y ejecutar modelos de IA generativa.',
      category: 'Hardware',
      date: '2024-01-08',
      readTime: '4 min',
      image: 'https://via.placeholder.com/400x250/4facfe/ffffff?text=NVIDIA+Chips'
    },
    {
      id: 5,
      title: 'DeepMind logra avances en razonamiento matemático con IA',
      excerpt: 'Nuevo modelo capaz de resolver problemas matemáticos complejos con mayor precisión.',
      category: 'Investigación',
      date: '2024-01-05',
      readTime: '8 min',
      image: 'https://via.placeholder.com/400x250/43e97b/ffffff?text=DeepMind+Math'
    },
    {
      id: 6,
      title: 'Anthropic presenta Claude 3: Más seguro y más inteligente',
      excerpt: 'La nueva versión de Claude mejora significativamente en seguridad y capacidades de razonamiento.',
      category: 'Tecnología',
      date: '2024-01-03',
      readTime: '6 min',
      image: 'https://via.placeholder.com/400x250/fa709a/ffffff?text=Claude+3'
    }
  ];

  const featuredTopics = [
    'Machine Learning',
    'Deep Learning',
    'Natural Language Processing',
    'Computer Vision',
    'AI Ethics',
    'MLOps',
    'AI in Business',
    'Research Papers'
  ];

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Hero Section */}
        <section className="hero gradient-bg">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                The Batch
                <span className="block">Newsletter de IA</span>
              </h1>
              <p className="hero-description">
                Mantente actualizado con las últimas noticias, investigaciones y tendencias 
                en inteligencia artificial. Recibe análisis profundos y perspectivas expertas.
              </p>
              
              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="newsletter-form">
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Tu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="email-input"
                    />
                    <button type="submit" className="btn btn-white">
                      Suscribirse
                    </button>
                  </div>
                  <p className="form-note">
                    📧 Recibe las noticias más importantes de IA cada semana
                  </p>
                </form>
              ) : (
                <div className="success-message">
                  <p>✅ ¡Gracias por suscribirte! Pronto recibirás nuestro primer newsletter.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Companies Marquee */}
        <Suspense fallback={<LoadingSpinner />}>
          <CompaniesMarquee />
        </Suspense>

        {/* Newsletter Stats */}
        <section className="section stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Suscriptores</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">200+</div>
                <div className="stat-label">Ediciones Publicadas</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">95%</div>
                <div className="stat-label">Tasa de Apertura</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">4.9/5</div>
                <div className="stat-label">Valoración Promedio</div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Últimas Noticias</h2>
              <p className="section-description">
                Las noticias más importantes y relevantes del mundo de la IA
              </p>
            </div>

            <div className="news-grid">
              {latestNews.map((news) => (
                <article key={news.id} className="news-card">
                  <div className="news-image">
                    <img src={news.image} alt={news.title} />
                    <span className="news-category">{news.category}</span>
                  </div>
                  <div className="news-content">
                    <div className="news-meta">
                      <span className="news-date">{news.date}</span>
                      <span className="news-read-time">{news.readTime}</span>
                    </div>
                    <h3 className="news-title">{news.title}</h3>
                    <p className="news-excerpt">{news.excerpt}</p>
                    <a href="#" className="read-more">Leer más →</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Topics Section */}
        <section className="section topics-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Temas que Cubrimos</h2>
              <p className="section-description">
                Análisis profundo de las áreas más importantes de la IA
              </p>
            </div>
            
            <div className="topics-grid">
              {featuredTopics.map((topic, index) => (
                <div key={index} className="topic-card">
                  <h3>{topic}</h3>
                  <p>Análisis y noticias sobre {topic.toLowerCase()}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>¿No te quieres perder nada?</h2>
              <p>Únete a nuestra comunidad de profesionales de IA y recibe las noticias más importantes directamente en tu inbox</p>
              <a href="#newsletter" className="btn btn-primary">Suscribirse al Newsletter</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 