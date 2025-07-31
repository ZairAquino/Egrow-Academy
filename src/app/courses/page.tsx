'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import DynamicLogo from '@/components/ui/DynamicLogo';
import { SkeletonGrid, SkeletonCourseCard } from '@/components/ui/SkeletonLoader';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AdvancedSearch } from '@/components/ui/AdvancedSearch';
import { useSearchEngine } from '@/hooks/useSearchEngine';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CourseCard from '@/components/courses/CourseCard';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: string;
  price: string;
  image: string;
  tag: string;
  link?: string;
  isFree: boolean;
  requiresAuth: boolean;
  priceId?: string; // ID de Stripe para el precio
}

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // Motor de búsqueda
  const {
    query,
    setQuery,
    filters,
    results: searchResults,
    isSearching,
    performSearch,
    generateSuggestions
  } = useSearchEngine({
    enableVoiceSearch: true,
    enableSuggestions: true,
    enableFilters: true,
    maxResults: 20
  });

  useEffect(() => {
    setIsClient(true);
    // Simular carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: 'todos', name: 'Todos los Cursos' },
    { id: 'cursos-cortos', name: 'Cursos Cortos' },
    { id: 'gratuitos', name: 'Cursos Gratuitos' },
    { id: 'especializados', name: 'Cursos Especializados' },
    { id: 'desarrollo-web', name: 'Desarrollo Web' },
    { id: 'machine-learning', name: 'Machine Learning' },
    { id: 'deep-learning', name: 'Deep Learning' },
    { id: 'nlp', name: 'NLP' },
    { id: 'computer-vision', name: 'Computer Vision' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'llms', name: 'LLMs & ChatGPT' }
  ];

  const courses: Course[] = [
    {
      id: 'monetiza-ia',
      title: 'Monetiza con la IA',
      description: 'Descubre cómo generar ingresos utilizando inteligencia artificial. Aprende estrategias prácticas para monetizar herramientas de IA y crear fuentes de ingresos pasivos.',
      category: 'llms',
      duration: '3 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: '/images/optimized/v-5.webp',
      tag: 'eGrow Academy',
      link: '/curso/monetiza-ia',
      isFree: true,
      requiresAuth: false
    },
    {
      id: 'desarrollo-web-fullstack',
      title: 'Desarrollo Web Full Stack con React y Node.js',
      description: 'Aprende a crear aplicaciones web completas desde cero. Domina React, Node.js, Express, MongoDB y despliegue en la nube.',
      category: 'desarrollo-web',
      duration: '25 horas',
      level: 'Intermedio',
      price: '$99.99',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&crop=center',
      tag: 'Especializado',
      link: '/curso/desarrollo-web-fullstack',
      isFree: false,
      requiresAuth: true
    }
  ];

  const getFilteredCourses = () => {
    if (selectedCategory === 'todos') {
      return courses;
    } else if (selectedCategory === 'gratuitos') {
      return courses.filter(course => course.isFree);
    } else if (selectedCategory === 'especializados') {
      return courses.filter(course => !course.isFree);
    } else if (selectedCategory === 'cursos-cortos') {
      return courses.filter(course => course.category === 'cursos-cortos');
    } else {
      return courses.filter(course => course.category === selectedCategory);
    }
  };

  const filteredCourses = getFilteredCourses();

  // Manejar búsqueda
  const handleSearch = (query: string, searchFilters: any) => {
    setSearchQuery(query);
    performSearch(query, searchFilters);
  };

  // Manejar clic en sugerencia
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion, filters);
  };

  // Determinar qué cursos mostrar
  const displayCourses = searchQuery.trim() ? searchResults : filteredCourses;
  const isSearchingOrLoading = isSearching || isLoading;

  return (
    <>
      <Navbar />
      
      <main className="main-content pt-16">
        {/* Hero Section */}
        <section className="hero gradient-bg">
          {/* Imagen de fondo - solo renderizar en el cliente */}
          {isClient && (
            <img
              src="/images/background.png"
              alt="Header background"
              className="hero-background"
            />
          )}
          
          <div className="container" style={{ position: 'relative', zIndex: 10 }}>
            <div className="hero-content">
              <h1 className="hero-title">
                Todos los cursos de
                <span className="block">Inteligencia Artificial</span>
              </h1>
              <p className="hero-description">
                Cada curso diseñado para un objetivo específico. Desde introducción hasta especialización, 
              construye tu expertise en IA paso a paso.
              </p>
              
              {/* Logo blanco debajo del texto */}
              <div className="hero-bottom-logo">
                <div className="logo-animation-wrapper">
                  <DynamicLogo width={95} height={95} priority className="hero-bottom-logo-image" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Marquee */}
        <Suspense fallback={<LoadingSpinner />}>
          <CompaniesMarquee />
        </Suspense>

        {/* Courses Section */}
        <section className="section">
          <div className="container">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumbs className="breadcrumbs-container" />
            </div>

            {/* Búsqueda avanzada */}
            <div className="mb-8">
              <AdvancedSearch
                onSearch={handleSearch}
                onSuggestionClick={handleSuggestionClick}
                placeholder="Buscar cursos, recursos, contenido..."
                className="max-w-2xl mx-auto"
                showFilters={true}
              />
            </div>

            {/* Filtros de categoría */}
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-filter ${
                    selectedCategory === category.id ? 'active' : ''
                  }`}
                >
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </div>

            {/* Resultados de búsqueda o grid de cursos */}
            {isSearchingOrLoading ? (
              <SkeletonGrid items={6} className="courses-grid" />
            ) : (
              <div className="courses-grid">
                {displayCourses.length > 0 ? (
                  displayCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      image={course.image || ''}
                      title={course.title}
                      description={course.description}
                      tag={course.tag || ''}
                      duration={course.duration || ''}
                      level={course.level || ''}
                      category={course.category}
                      isFree={course.isFree || false}
                      requiresAuth={course.requiresAuth || false}
                      link={course.link}
                      onCourseClick={(courseId) => {
                        console.log('Curso clickeado:', courseId);
                        // Aquí puedes agregar la lógica para manejar el clic del curso
                      }}
                    />
                  ))
                ) : (
                  <div className="no-courses">
                    <p>
                      {searchQuery.trim() 
                        ? `No se encontraron resultados para "${searchQuery}"`
                        : 'No se encontraron cursos en esta categoría.'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Información de búsqueda */}
            {searchQuery.trim() && !isSearchingOrLoading && (
              <div className="mt-6 text-center text-gray-600">
                <p>
                  Mostrando {displayCourses.length} resultado{displayCourses.length !== 1 ? 's' : ''} 
                  para "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      
      <style jsx>{`
        .breadcrumbs-container {
          padding: 16px 0;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 24px;
        }

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
      `}</style>
    </>
  );
} 