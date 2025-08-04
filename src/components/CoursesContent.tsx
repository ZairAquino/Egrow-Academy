'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
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
  priceId?: string;
}

// Categorías disponibles
const categories = [
  { id: 'all', name: 'Todos los Cursos', icon: '📚', count: 4 },
  { id: 'IA_PARA_EMPRENDER', name: 'IA para Emprender', icon: '🚀', count: 2 },
  { id: 'DESARROLLO_WEB', name: 'Desarrollo Web', icon: '💻', count: 2 },
  { id: 'MARKETING_DIGITAL', name: 'Marketing Digital', icon: '📈', count: 1 },
  { id: 'PRODUCTIVIDAD', name: 'Productividad', icon: '⚡', count: 0 },
  { id: 'FINANZAS_PERSONALES', name: 'Finanzas Personales', icon: '💰', count: 0 },
  { id: 'LIDERAZGO', name: 'Liderazgo', icon: '👑', count: 0 },
  { id: 'INNOVACION_TECNOLOGICA', name: 'Innovación Tecnológica', icon: '🔬', count: 0 },
];

export default function CoursesContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  // Estado simple para categoría activa
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Motor de búsqueda
  const { 
    results: searchResults,
    generateSuggestions,
    isSearching,
    performSearch,
    clearSearch 
  } = useSearchEngine({ searchType: 'courses' });

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Estado para cursos de la base de datos
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  // Obtener cursos de la base de datos
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('🔄 Intentando obtener cursos de la base de datos...');
        const response = await fetch('/api/courses');
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Cursos obtenidos exitosamente:', data.courses?.length || 0);
          
          const formattedCourses: Course[] = (data.courses || []).map((course: any) => ({
            id: course.id,
            title: course.title,
            description: course.description || '',
            category: course.category || 'OTRO',
            duration: course.durationHours ? `${course.durationHours} horas` : 'N/A',
            level: course.difficulty || 'N/A',
            price: course.isFree ? 'Gratis' : 'Premium',
            image: course.imageUrl || '/images/courses/default.jpg',
            tag: course.isFree ? 'Gratis' : 'Premium',
            isFree: course.isFree || false,
            requiresAuth: course.requiresAuth || true,
            link: `/curso/${course.slug}`
          }));
          
          if (formattedCourses.length > 0) {
            setCourses(formattedCourses);
          } else {
            console.log('⚠️ No se encontraron cursos en la base de datos, usando fallback');
            setCourses(getFallbackCourses());
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ Error fetching courses:', response.status, errorData);
          setCourses(getFallbackCourses());
        }
      } catch (error) {
        console.error('❌ Error fetching courses:', error);
        setCourses(getFallbackCourses());
      } finally {
        setCoursesLoading(false);
      }
    };

    // Función para obtener cursos de fallback
    const getFallbackCourses = (): Course[] => [
      {
        id: 'monetiza-ia',
        title: 'Monetiza con la IA',
        description: 'Descubre cómo generar ingresos utilizando inteligencia artificial. Aprende estrategias prácticas para monetizar herramientas de IA y crear fuentes de ingresos pasivos.',
        category: 'IA_PARA_EMPRENDER',
        duration: '3 horas',
        level: 'Intermedio',
        price: 'Gratis',
        image: '/images/optimized/v-5.webp',
        tag: 'Gratis',
        isFree: true,
        requiresAuth: false,
        link: '/curso/monetiza-ia'
      },
      {
        id: 'asistentes-virtuales-ia',
        title: 'Asistentes virtuales con IA',
        description: 'Descubre cómo crear y configurar asistentes virtuales inteligentes para automatizar tareas y mejorar la productividad en tu organización.',
        category: 'IA_PARA_EMPRENDER',
        duration: '4 horas',
        level: 'Intermedio',
        price: 'Gratis',
        image: '/images/18.png',
        tag: 'Gratis',
        isFree: true,
        requiresAuth: false,
        link: '/curso/asistentes-virtuales-ia'
      },
      {
        id: 'desarrollo-web-fullstack',
        title: 'Desarrollo Web Full Stack con React y Node.js',
        description: 'Aprende a crear aplicaciones web completas desde cero. Domina React, Node.js, Express, MongoDB y despliegue en la nube.',
        category: 'DESARROLLO_WEB',
        duration: '25 horas',
        level: 'Intermedio',
        price: 'Premium',
        image: '/images/16.png',
        tag: 'Premium',
        isFree: false,
        requiresAuth: true,
        priceId: 'price_web_dev_fullstack',
        link: '/curso/desarrollo-web-fullstack'
      },
      {
        id: 'vibe-coding-claude-cursor',
        title: 'Vibe coding con Claude code y Cursor',
        description: 'Domina el desarrollo de código con inteligencia artificial. Aprende a usar Claude Code y Cursor para acelerar tu productividad como desarrollador y crear código más eficiente.',
        category: 'DESARROLLO_WEB',
        duration: '20 horas',
        level: 'Intermedio',
        price: 'Premium',
        image: '/images/17.png',
        tag: 'Premium',
        isFree: false,
        requiresAuth: true,
        priceId: 'price_vibe_coding_claude',
        link: '/curso/vibe-coding-claude-cursor'
      },
      {
        id: 'videos-profesionales-ia',
        title: 'Aprende a crear videos profesionales con IA',
        description: 'Domina las herramientas de IA para crear contenido audiovisual profesional. Aprende a generar videos, editar con inteligencia artificial y optimizar para diferentes plataformas.',
        category: 'MARKETING_DIGITAL',
        duration: '18 horas',
        level: 'Intermedio',
        price: 'Premium',
        image: '/images/15.png',
        tag: 'Premium',
        isFree: false,
        requiresAuth: true,
        priceId: 'price_videos_profesionales_ia',
        link: '/curso/videos-profesionales-ia'
      }
    ];

    fetchCourses();
  }, []);

  // Función simple de filtrado
  const getFilteredCourses = () => {
    if (selectedCategory === 'all') {
      return courses;
    }
    return courses.filter(course => course.category === selectedCategory);
  };

  // Cursos a mostrar
  const displayCourses = searchResults && searchResults.length > 0 ? searchResults : getFilteredCourses();

  // Función para cambiar categoría
  const handleCategoryClick = (categoryId: string) => {
    console.log('🎯 Cambiando a categoría:', categoryId);
    setSelectedCategory(categoryId);
    
    // Limpiar búsqueda si hay una activa
    if (searchQuery) {
      setSearchQuery('');
      clearSearch();
    }
  };

  const handleSearch = (query: string, filters?: any) => {
    setSearchQuery(query);
    if (query.trim()) {
      performSearch(query);
    } else {
      clearSearch();
    }
  };

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Cursos', href: '/courses' }
  ];

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero">
        {/* Imagen de fondo del header */}
        {isClient && (
          <>
            <img
              src="/images/background.png"
              alt="Header background"
              className="hero-background"
            />      
          </>
        )}
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-content">
            <h1 className="hero-title">
              Nuestros Cursos
            </h1>
            <p className="hero-description">
              Descubre nuestra selección de cursos diseñados para acelerar tu crecimiento profesional
            </p>
            
            {/* Logo blanco debajo del texto */}
            <div className="hero-bottom-logo">
              <div className="logo-animation-wrapper">
                <DynamicLogo 
                  width={95}
                  height={95}
                  priority={true}
                  className="hero-bottom-logo-image"
                />
              </div>
            </div>
          </div>
        </div>

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
            animation: float 3s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @media (max-width: 768px) {
            .hero-bottom-logo-image {
              max-height: 60px;
              max-width: 80px;
            }
          }
        `}</style>
      </section>

      {/* Companies Marquee */}
      <CompaniesMarquee />

      {/* Main Content */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <AdvancedSearch 
              onSearch={handleSearch}
              onSuggestionClick={handleSearch}
              showFilters={false}
              searchType="courses"
              placeholder="Busca por nombre de curso"
            />
          </div>

          {/* Category Navigation */}
          <div className="mb-8">
            {/* Categoría "Todos" */}
            <div className="mb-6">
              <button
                onClick={() => handleCategoryClick('all')}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📚</div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900">Todos los Cursos</h3>
                      <p className="text-sm text-gray-600">Explora todo nuestro catálogo</p>
                    </div>
                  </div>
                  {selectedCategory === 'all' && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </button>
            </div>

            {/* Grid de categorías */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.slice(1).map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl p-2 rounded-lg bg-gray-100">
                      {category.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-gray-900 text-sm md:text-base">
                        {category.name}
                      </h3>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">
                          {category.count} curso{category.count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    {selectedCategory === category.id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          {(searchQuery || selectedCategory !== 'all') && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {searchQuery && (
                    <p className="text-gray-600">
                      {displayCourses.length} resultados para "{searchQuery}"
                    </p>
                  )}
                  {selectedCategory !== 'all' && (
                    <p className="text-gray-600">
                      {displayCourses.length} cursos en {selectedCategory.replace(/_/g, ' ').toLowerCase()}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {searchQuery && (
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        clearSearch();
                      }}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                  {selectedCategory !== 'all' && (
                    <button 
                      onClick={() => handleCategoryClick('all')}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Ver todos
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Courses Grid */}
          {isLoading || coursesLoading ? (
            <SkeletonGrid>
              {[...Array(6)].map((_, i) => (
                <SkeletonCourseCard key={i} />
              ))}
            </SkeletonGrid>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  description={course.description}
                  category={course.category}
                  duration={course.duration}
                  level={course.level}
                  price={course.price}
                  image={course.image}
                  tag={course.tag}
                  link={course.link}
                  isFree={course.isFree}
                  requiresAuth={course.requiresAuth}
                  priceId={course.priceId}
                  isAuthenticated={!!user}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && displayCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                No se encontraron cursos
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? `No hay cursos que coincidan con "${searchQuery}"`
                  : selectedCategory !== 'all' 
                    ? `No hay cursos disponibles en la categoría "${selectedCategory}"`
                    : 'No hay cursos disponibles'
                }
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    clearSearch();
                    setSelectedCategory('all');
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver todos los cursos
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}