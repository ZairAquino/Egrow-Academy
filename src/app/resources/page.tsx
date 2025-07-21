'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function ResourcesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const categories = [
    { id: 'todos', name: 'Todos los Recursos' },
    { id: 'libros', name: 'Libros' },
    { id: 'papers', name: 'Papers' },
    { id: 'herramientas', name: 'Herramientas' },
    { id: 'datasets', name: 'Datasets' },
    { id: 'tutoriales', name: 'Tutoriales' },
    { id: 'podcasts', name: 'Podcasts' }
  ];

  const resources = [
    {
      id: 1,
      title: 'Manual GEM',
      description: 'Manual completo sobre Google Gemini (GEM) - Guía práctica para el uso y desarrollo con modelos de IA de Google.',
      category: 'papers',
      author: 'Google AI',
      type: 'Manual',
      url: '/resources/Manual GEM.pdf',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 2,
      title: 'Manual GPT',
      description: 'Manual completo sobre GPT (Generative Pre-trained Transformer) - Guía práctica para el uso y desarrollo con modelos de lenguaje.',
      category: 'papers',
      author: 'OpenAI',
      type: 'Manual',
      url: '/resources/Manual GPT.pdf',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center'
    }
  ];

  const filteredResources = selectedCategory === 'todos' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const featuredResources = [
    {
      title: 'Roadmap de Machine Learning',
      description: 'Guía paso a paso para aprender machine learning desde cero',
      category: 'Guía',
      url: 'https://roadmap.sh/ai-data-scientist'
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
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Acceder</a>
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
            <div className="resources-grid">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-image">
                    <img src={resource.image} alt={resource.title} />
                    <span className="resource-type">{resource.type}</span>
                  </div>
                  <div className="resource-content">
                    <div className="resource-meta">
                      <span className="resource-author">{resource.author}</span>
                      <span className="resource-rating">{resource.rating}/5</span>
                    </div>
                    <h3 className="resource-title">{resource.title}</h3>
                    <p className="resource-description">{resource.description}</p>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">Ver Recurso →</a>
                  </div>
                </div>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="no-resources">
                <p>No se encontraron recursos en esta categoría.</p>
              </div>
            )}
          </div>
        </section>

        {/* Resource Stats */}
        <section className="section stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">500+</div>
                <div className="stat-label">Recursos Disponibles</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">Autores Expertos</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Descargas Mensuales</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">4.8/5</div>
                <div className="stat-label">Valoración Promedio</div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
} 