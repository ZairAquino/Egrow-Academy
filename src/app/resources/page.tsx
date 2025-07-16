'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import Footer from '@/components/Footer';

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
      title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow',
      description: 'Guía práctica de machine learning con ejemplos de código y proyectos reales.',
      category: 'libros',
      author: 'Aurélien Géron',
      type: 'Libro',
      url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 2,
      title: 'Attention Is All You Need',
      description: 'Paper seminal que introduce la arquitectura Transformer.',
      category: 'papers',
      author: 'Vaswani et al.',
      type: 'Paper',
      url: 'https://arxiv.org/abs/1706.03762',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 3,
      title: 'Jupyter Notebook',
      description: 'Entorno de desarrollo interactivo para Python, ideal para data science.',
      category: 'herramientas',
      author: 'Jupyter Project',
      type: 'Herramienta',
      url: 'https://jupyter.org/',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 4,
      title: 'MNIST Dataset',
      description: 'Dataset clásico de dígitos escritos a mano para clasificación.',
      category: 'datasets',
      author: 'Yann LeCun',
      type: 'Dataset',
      url: 'http://yann.lecun.com/exdb/mnist/',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 5,
      title: 'Deep Learning Specialization - Coursera',
      description: 'Serie de cursos completos sobre deep learning por Andrew Ng.',
      category: 'tutoriales',
      author: 'Andrew Ng',
      type: 'Curso',
      url: 'https://www.coursera.org/specializations/deep-learning',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 6,
      title: 'Lex Fridman Podcast',
      description: 'Podcast sobre IA, ciencia y tecnología con expertos del sector.',
      category: 'podcasts',
      author: 'Lex Fridman',
      type: 'Podcast',
      url: 'https://lexfridman.com/podcast/',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 7,
      title: 'Pattern Recognition and Machine Learning',
      description: 'Libro fundamental sobre reconocimiento de patrones y machine learning.',
      category: 'libros',
      author: 'Christopher Bishop',
      type: 'Libro',
      url: 'https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 8,
      title: 'BERT: Pre-training of Deep Bidirectional Transformers',
      description: 'Paper que presenta BERT, modelo revolucionario en NLP.',
      category: 'papers',
      author: 'Devlin et al.',
      type: 'Paper',
      url: 'https://arxiv.org/abs/1810.04805',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 9,
      title: 'TensorFlow',
      description: 'Plataforma de código abierto para machine learning desarrollada por Google.',
      category: 'herramientas',
      author: 'Google',
      type: 'Framework',
      url: 'https://www.tensorflow.org/',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 10,
      title: 'PyTorch',
      description: 'Framework de deep learning flexible y fácil de usar desarrollado por Meta.',
      category: 'herramientas',
      author: 'Meta AI',
      type: 'Framework',
      url: 'https://pytorch.org/',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 11,
      title: 'ImageNet Dataset',
      description: 'Base de datos masiva de imágenes para investigación en visión computacional.',
      category: 'datasets',
      author: 'Stanford Vision Lab',
      type: 'Dataset',
      url: 'https://www.image-net.org/',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 12,
      title: 'The Elements of Statistical Learning',
      description: 'Texto fundamental sobre aprendizaje estadístico y machine learning.',
      category: 'libros',
      author: 'Hastie, Tibshirani & Friedman',
      type: 'Libro',
      url: 'https://hastie.su.domains/ElemStatLearn/',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 13,
      title: 'Hugging Face Transformers',
      description: 'Biblioteca de modelos pre-entrenados para NLP y más.',
      category: 'herramientas',
      author: 'Hugging Face',
      type: 'Biblioteca',
      url: 'https://huggingface.co/docs/transformers/index',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 14,
      title: 'OpenAI GPT-3 Paper',
      description: 'Language Models are Few-Shot Learners - El paper que introdujo GPT-3.',
      category: 'papers',
      author: 'Brown et al.',
      type: 'Paper',
      url: 'https://arxiv.org/abs/2005.14165',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 15,
      title: 'Scikit-learn',
      description: 'Biblioteca de machine learning más popular para Python.',
      category: 'herramientas',
      author: 'Scikit-learn Team',
      type: 'Biblioteca',
      url: 'https://scikit-learn.org/',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1509448642506-2b2b2c017c57?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 16,
      title: 'Fast.ai Practical Deep Learning Course',
      description: 'Curso práctico y accesible sobre deep learning.',
      category: 'tutoriales',
      author: 'Jeremy Howard',
      type: 'Curso',
      url: 'https://course.fast.ai/',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 17,
      title: 'Common Crawl',
      description: 'Archivo abierto de datos web utilizados para entrenar modelos de IA.',
      category: 'datasets',
      author: 'Common Crawl',
      type: 'Dataset',
      url: 'https://commoncrawl.org/',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 18,
      title: 'Machine Learning Yearning',
      description: 'Guía práctica de Andrew Ng para proyectos de machine learning.',
      category: 'libros',
      author: 'Andrew Ng',
      type: 'Libro',
      url: 'https://www.deeplearning.ai/machine-learning-yearning/',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 19,
      title: 'AI Podcast by Lex Fridman',
      description: 'Conversaciones profundas sobre IA con los mejores investigadores.',
      category: 'podcasts',
      author: 'Lex Fridman',
      type: 'Podcast',
      url: 'https://www.youtube.com/@lexfridman',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 20,
      title: 'Papers With Code',
      description: 'Repositorio de papers de ML con implementaciones de código.',
      category: 'papers',
      author: 'Papers With Code',
      type: 'Repositorio',
      url: 'https://paperswithcode.com/',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop&crop=center'
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

      </main>

      <Footer />
    </>
  );
} 