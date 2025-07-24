'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import ResourceCard from '@/components/resources/ResourceCard';
import { useResources } from '@/hooks/useResources';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function ResourcesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const categories = [
    { id: 'todos', name: 'Todos los Recursos' },
    { id: 'WEBINAR', name: 'Webinars' },
    { id: 'MANUAL', name: 'Manuales' },
    { id: 'TUTORIAL', name: 'Tutoriales' },
    { id: 'PAPER', name: 'Papers' },
    { id: 'HERRAMIENTA', name: 'Herramientas' },
    { id: 'DATASET', name: 'Datasets' },
    { id: 'PODCAST', name: 'Podcasts' },
    { id: 'LIBRO', name: 'Libros' }
  ];

  const { resources, loading, error, pagination, loadMore } = useResources(selectedCategory);

  const filteredResources = selectedCategory === 'todos' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const featuredResources = [
    {
      title: 'Guía de Prompts para ChatGPT',
      description: 'Una guía completa y práctica para crear prompts efectivos en ChatGPT con técnicas avanzadas y ejemplos reales',
      category: 'Manual',
      url: '/resources/guia-prompts-chatgpt'
    },
    {
      title: 'Glosario de IA',
      description: 'Diccionario completo de términos y conceptos de inteligencia artificial',
      category: 'Referencia',
      url: 'https://www.ibm.com/topics/artificial-intelligence'
    },
    {
      title: 'Cheat Sheets',
      description: 'Hojas de referencia rápidas para Python, NumPy, Pandas y más',
      category: 'Referencia',
      url: 'https://github.com/FavioVazquez/ds-cheatsheets'
    }
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
                Recursos de
                <span className="block">Inteligencia Artificial</span>
              </h1>
              <p className="hero-description">
                Biblioteca completa de recursos cuidadosamente seleccionados para tu aprendizaje en IA. 
                Libros, papers, herramientas, datasets y mucho más.
              </p>
              
              {/* Logo blanco debajo del texto */}
              <div className="hero-bottom-logo">
                <div className="logo-animation-wrapper">
                  <Image 
                    src={user && user.membershipLevel === 'PREMIUM' ? "/images/logop.png" : "/images/logog.png"}
                    alt="eGrow Academy" 
                    width={95}
                    height={95}
                    priority
                    className="hero-bottom-logo-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Marquee */}
        <Suspense fallback={<LoadingSpinner />}>
          <CompaniesMarquee />
        </Suspense>

        {/* Featured Resources */}
        <section className="section featured-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Recursos Destacados</h2>
              <p className="section-description">
                Los recursos más populares y recomendados por nuestra comunidad
              </p>
            </div>

            <div className="featured-grid">
              {featuredResources.map((resource, index) => (
                <div key={index} className="featured-card">
                  <div className="featured-badge">{resource.category}</div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  {user ? (
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Acceder</a>
                  ) : (
                    <div className="auth-required-section">
                      <div className="auth-overlay">
                        <div className="auth-content">
                          <div className="lock-icon">🔒</div>
                          <p className="auth-message">Regístrate para acceder a este recurso</p>
                          <div className="auth-buttons">
                            <a href="/register" className="btn btn-primary">Registrarse</a>
                            <a href="/login" className="btn btn-outline">Iniciar Sesión</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Biblioteca de Recursos</h2>
              <p className="section-description">
                Explora nuestra colección completa de recursos organizados por categorías
              </p>
            </div>

            {/* Category Filters */}
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                >
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </div>

            {/* Resources Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">Error: {error}</p>
              </div>
            ) : (
              <>
                <div className="courses-grid">
                  {filteredResources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>

                {filteredResources.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No se encontraron recursos en esta categoría.</p>
                  </div>
                )}

                {pagination.hasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={loadMore}
                      className="btn btn-primary"
                    >
                      Cargar más recursos
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>



      </main>

      <Footer />
      
      <style jsx>{`
        .hero-bottom-logo {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }

        .hero-bottom-logo-image {
          height: auto;
          max-height: 71px;
          width: auto;
          max-width: 95px;
          opacity: 0.9;
          transition: all 0.3s ease;
        }

        .logo-animation-wrapper {
          animation: logoFloat 3s ease-in-out infinite;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo-animation-wrapper:hover {
          animation-play-state: paused;
        }

        .logo-animation-wrapper:hover .hero-bottom-logo-image {
          transform: scale(1.1) rotate(5deg);
          filter: brightness(1.2);
        }

        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @media (max-width: 768px) {
          .hero-bottom-logo-image {
            max-width: 76px;
            max-height: 57px;
          }
        }

        @media (max-width: 480px) {
          .hero-bottom-logo-image {
            max-width: 66px;
            max-height: 48px;
          }
        }

        .auth-required-section {
          margin-top: 16px;
        }

        .auth-overlay {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
          border: 2px dashed rgba(102, 126, 234, 0.3);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .auth-overlay:hover {
          border-color: rgba(102, 126, 234, 0.5);
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
        }

        .auth-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .lock-icon {
          font-size: 32px;
          opacity: 0.7;
        }

        .auth-message {
          color: #6b7280;
          font-weight: 500;
          margin: 0;
          font-size: 14px;
        }

        .auth-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .auth-buttons .btn {
          padding: 8px 16px;
          font-size: 14px;
          min-width: 100px;
        }

        @media (max-width: 480px) {
          .auth-buttons {
            flex-direction: column;
            width: 100%;
          }
          
          .auth-buttons .btn {
            width: 100%;
          }
        }

      `}</style>
    </>
  );
} 