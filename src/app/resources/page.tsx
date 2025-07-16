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

export default function ResourcesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const categories = [
    { id: 'todos', name: 'Todos los Recursos', icon: '📚' },
    { id: 'libros', name: 'Libros', icon: '📖' },
    { id: 'papers', name: 'Papers', icon: '📄' },
    { id: 'herramientas', name: 'Herramientas', icon: '🛠️' },
    { id: 'datasets', name: 'Datasets', icon: '📊' },
    { id: 'tutoriales', name: 'Tutoriales', icon: '🎥' },
    { id: 'podcasts', name: 'Podcasts', icon: '🎧' }
  ];

  const resources = [
    {
      id: 1,
      title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow',
      description: 'Guía práctica de machine learning con ejemplos de código y proyectos reales.',
      category: 'libros',
      author: 'Aurélien Géron',
      type: 'Libro',
      url: '#',
      rating: 4.8,
      image: 'https://via.placeholder.com/400x250/667eea/ffffff?text=Hands-On+ML'
    },
    {
      id: 2,
      title: 'Attention Is All You Need',
      description: 'Paper seminal que introduce la arquitectura Transformer.',
      category: 'papers',
      author: 'Vaswani et al.',
      type: 'Paper',
      url: '#',
      rating: 4.9,
      image: 'https://via.placeholder.com/400x250/764ba2/ffffff?text=Transformer+Paper'
    },
    {
      id: 3,
      title: 'Jupyter Notebook',
      description: 'Entorno de desarrollo interactivo para Python, ideal para data science.',
      category: 'herramientas',
      author: 'Jupyter Project',
      type: 'Herramienta',
      url: '#',
      rating: 4.7,
      image: 'https://via.placeholder.com/400x250/f093fb/ffffff?text=Jupyter+Notebook'
    },
    {
      id: 4,
      title: 'MNIST Dataset',
      description: 'Dataset clásico de dígitos escritos a mano para clasificación.',
      category: 'datasets',
      author: 'Yann LeCun',
      type: 'Dataset',
      url: '#',
      rating: 4.6,
      image: 'https://via.placeholder.com/400x250/4facfe/ffffff?text=MNIST+Dataset'
    },
    {
      id: 5,
      title: 'Deep Learning Specialization - Coursera',
      description: 'Serie de cursos completos sobre deep learning por Andrew Ng.',
      category: 'tutoriales',
      author: 'Andrew Ng',
      type: 'Curso',
      url: '#',
      rating: 4.9,
      image: 'https://via.placeholder.com/400x250/43e97b/ffffff?text=Deep+Learning+Course'
    },
    {
      id: 6,
      title: 'Lex Fridman Podcast',
      description: 'Podcast sobre IA, ciencia y tecnología con expertos del sector.',
      category: 'podcasts',
      author: 'Lex Fridman',
      type: 'Podcast',
      url: '#',
      rating: 4.8,
      image: 'https://via.placeholder.com/400x250/fa709a/ffffff?text=Lex+Fridman+Podcast'
    },
    {
      id: 7,
      title: 'Pattern Recognition and Machine Learning',
      description: 'Libro fundamental sobre reconocimiento de patrones y machine learning.',
      category: 'libros',
      author: 'Christopher Bishop',
      type: 'Libro',
      url: '#',
      rating: 4.7,
      image: 'https://via.placeholder.com/400x250/667eea/ffffff?text=Pattern+Recognition'
    },
    {
      id: 8,
      title: 'BERT: Pre-training of Deep Bidirectional Transformers',
      description: 'Paper que presenta BERT, modelo revolucionario en NLP.',
      category: 'papers',
      author: 'Devlin et al.',
      type: 'Paper',
      url: '#',
      rating: 4.8,
      image: 'https://via.placeholder.com/400x250/764ba2/ffffff?text=BERT+Paper'
    }
  ];

  const filteredResources = selectedCategory === 'todos' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const featuredResources = [
    {
      title: 'Roadmap de Machine Learning',
      description: 'Guía paso a paso para aprender machine learning desde cero',
      icon: '🗺️',
      url: '#'
    },
    {
      title: 'Glosario de IA',
      description: 'Diccionario completo de términos y conceptos de inteligencia artificial',
      icon: '📖',
      url: '#'
    },
    {
      title: 'Cheat Sheets',
      description: 'Hojas de referencia rápidas para Python, NumPy, Pandas y más',
      icon: '📋',
      url: '#'
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
                  <div className="featured-icon">{resource.icon}</div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <a href={resource.url} className="btn btn-outline">Acceder</a>
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
                  <span className="category-icon">{category.icon}</span>
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
                      <span className="resource-rating">⭐ {resource.rating}</span>
                    </div>
                    <h3 className="resource-title">{resource.title}</h3>
                    <p className="resource-description">{resource.description}</p>
                    <a href={resource.url} className="resource-link">Ver Recurso →</a>
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

        {/* CTA Section */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>¿Tienes un Recurso para Compartir?</h2>
              <p>Ayuda a nuestra comunidad compartiendo recursos valiosos que hayas encontrado</p>
              <a href="#submit" className="btn btn-primary">Sugerir Recurso</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 