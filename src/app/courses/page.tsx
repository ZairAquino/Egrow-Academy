'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import DynamicLogo from '@/components/ui/DynamicLogo';
import { SkeletonGrid, SkeletonCourseCard } from '@/components/ui/SkeletonLoader';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AdvancedSearch } from '@/components/ui/AdvancedSearch';
import { CategoryNavigation } from '@/components/ui/CategoryNavigation';
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
  priceId?: string;
}

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // Obtener categoría activa de los parámetros de URL
  const activeCategory = searchParams.get('category') || 'all';

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

  const courses: Course[] = [
    {
      id: 'monetiza-ia',
      title: 'Monetiza con la IA',
      description: 'Descubre cómo generar ingresos utilizando inteligencia artificial. Aprende estrategias prácticas para monetizar herramientas de IA y crear fuentes de ingresos pasivos.',
      category: 'IA_PARA_EMPRENDER',
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
      category: 'DESARROLLO_WEB',
      duration: '25 horas',
      level: 'Intermedio',
      price: '$99.99',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&crop=center',
      tag: 'Especializado',
      link: '/curso/desarrollo-web-fullstack',
      isFree: false,
      requiresAuth: true
    },
    {
      id: 'liderazgo-digital',
      title: 'Liderazgo en la Era Digital',
      description: 'Desarrolla habilidades de liderazgo adaptadas al mundo digital. Aprende a gestionar equipos remotos y liderar proyectos tecnológicos.',
      category: 'LIDERAZGO',
      duration: '8 horas',
      level: 'Avanzado',
      price: '$49.99',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop&crop=center',
      tag: 'Liderazgo',
      link: '/curso/liderazgo-digital',
      isFree: false,
      requiresAuth: true
    },
    {
      id: 'productividad-ia',
      title: 'Productividad con IA',
      description: 'Optimiza tu trabajo diario con herramientas de inteligencia artificial. Automatiza tareas repetitivas y aumenta tu eficiencia.',
      category: 'PRODUCTIVIDAD',
      duration: '5 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop&crop=center',
      tag: 'Productividad',
      link: '/curso/productividad-ia',
      isFree: true,
      requiresAuth: false
    }
  ];

  const getFilteredCourses = () => {
    if (activeCategory === 'all') {
      return courses;
    } else {
      return courses.filter(course => course.category === activeCategory);
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

  // Manejar cambio de categoría
  const handleCategoryChange = (category: string) => {
    setSearchQuery('');
    setQuery('');
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
                Cursos Organizados por
                <span className="block">Categorías Específicas</span>
              </h1>
              <p className="hero-description">
                Encuentra exactamente lo que necesitas. Nuestros cursos están organizados en categorías claras 
                para que puedas elegir el camino de aprendizaje perfecto para ti.
              </p>
              
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

            {/* Navegación por categorías */}
            <div className="mb-8">
              <CategoryNavigation
                activeCategory={activeCategory}
                showCounts={true}
                layout="grid"
                onCategoryChange={handleCategoryChange}
              />
            </div>

            {/* Información de categoría activa */}
            {activeCategory !== 'all' && !searchQuery.trim() && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">
                  Categoría: {getCategoryName(activeCategory)}
                </h2>
                <p className="text-blue-700">
                  {getCategoryDescription(activeCategory)}
                </p>
              </div>
            )}

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
                      }}
                    />
                  ))
                ) : (
                  <div className="no-courses">
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📚</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {searchQuery.trim() 
                          ? `No se encontraron resultados para "${searchQuery}"`
                          : 'No hay cursos en esta categoría aún'
                        }
                      </h3>
                      <p className="text-gray-600">
                        {searchQuery.trim() 
                          ? 'Intenta con otros términos de búsqueda'
                          : 'Estamos trabajando en agregar más contenido. ¡Vuelve pronto!'
                        }
                      </p>
                    </div>
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

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .no-courses {
          grid-column: 1 / -1;
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

// Funciones auxiliares para obtener información de categorías
function getCategoryName(categoryId: string): string {
  const categoryMap: Record<string, string> = {
    'HABILIDADES_IRREMPLAZABLES': 'Habilidades Irremplazables',
    'IA_PARA_EMPRENDER': 'IA para Emprender',
    'DESARROLLO_WEB': 'Desarrollo Web',
    'MARKETING_DIGITAL': 'Marketing Digital',
    'PRODUCTIVIDAD': 'Productividad',
    'FINANZAS_PERSONALES': 'Finanzas Personales',
    'LIDERAZGO': 'Liderazgo',
    'INNOVACION_TECNOLOGICA': 'Innovación Tecnológica',
  };
  return categoryMap[categoryId] || categoryId;
}

function getCategoryDescription(categoryId: string): string {
  const descriptionMap: Record<string, string> = {
    'HABILIDADES_IRREMPLAZABLES': 'Competencias que la IA no puede reemplazar y que serán más valiosas que nunca.',
    'IA_PARA_EMPRENDER': 'Herramientas de IA para crear negocios y generar ingresos de forma inteligente.',
    'DESARROLLO_WEB': 'Crea sitios web y aplicaciones modernas con las tecnologías más demandadas.',
    'MARKETING_DIGITAL': 'Estrategias para vender en internet y hacer crecer tu negocio online.',
    'PRODUCTIVIDAD': 'Optimiza tu tiempo y resultados con técnicas y herramientas avanzadas.',
    'FINANZAS_PERSONALES': 'Gestiona tu dinero de forma inteligente y construye riqueza a largo plazo.',
    'LIDERAZGO': 'Desarrolla habilidades de liderazgo para el mundo digital y tecnológico.',
    'INNOVACION_TECNOLOGICA': 'Las últimas tendencias en tecnología que están transformando el mundo.',
  };
  return descriptionMap[categoryId] || 'Descubre cursos especializados en esta área.';
} 