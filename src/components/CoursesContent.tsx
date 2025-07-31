'use client';

import { useState, useEffect } from 'react';
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

export default function CoursesContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // Obtener categoría activa de los parámetros de URL
  const activeCategory = searchParams.get('category') || 'all';

  // Motor de búsqueda
  const { 
    searchResults,
    searchSuggestions,
    isSearching,
    performSearch,
    clearSearch 
  } = useSearchEngine();

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Simulated courses data (replace with actual API call)
  const courses: Course[] = [
    {
      id: '1',
      title: 'Desarrollo Web Full Stack con React y Node.js',
      description: 'Aprende a crear aplicaciones web completas desde cero con las tecnologías más demandadas del mercado.',
      category: 'DESARROLLO_WEB',
      duration: '12 semanas',
      level: 'Intermedio',
      price: 'Gratis',
      image: '/images/courses/fullstack-react-node.jpg',
      tag: 'Más Popular',
      isFree: true,
      requiresAuth: true,
      link: '/courses/desarrollo-web-fullstack'
    },
    {
      id: '2',
      title: 'Inteligencia Artificial para Emprendedores',
      description: 'Descubre cómo aplicar IA en tu negocio para automatizar procesos y tomar mejores decisiones.',
      category: 'IA_PARA_EMPRENDER',
      duration: '8 semanas',
      level: 'Principiante',
      price: 'Premium',
      image: '/images/courses/ai-entrepreneurs.jpg',
      tag: 'Nuevo',
      isFree: false,
      requiresAuth: true,
      priceId: 'price_ai_entrepreneurs'
    },
    {
      id: '3',
      title: 'Marketing Digital Avanzado',
      description: 'Estrategias avanzadas de marketing digital para hacer crecer tu negocio online.',
      category: 'MARKETING_DIGITAL',
      duration: '10 semanas',
      level: 'Avanzado',
      price: 'Premium',
      image: '/images/courses/marketing-digital.jpg',
      tag: 'Destacado',
      isFree: false,
      requiresAuth: true,
      priceId: 'price_marketing_digital'
    },
    {
      id: '4',
      title: 'Productividad y Gestión del Tiempo',
      description: 'Técnicas probadas para maximizar tu productividad y gestionar mejor tu tiempo.',
      category: 'PRODUCTIVIDAD',
      duration: '6 semanas',
      level: 'Principiante',
      price: 'Gratis',
      image: '/images/courses/productivity.jpg',
      tag: 'Esencial',
      isFree: true,
      requiresAuth: false
    },
    {
      id: '5',
      title: 'Finanzas Personales e Inversión',
      description: 'Aprende a manejar tus finanzas personales e invertir de manera inteligente.',
      category: 'FINANZAS_PERSONALES',
      duration: '8 semanas',
      level: 'Intermedio',
      price: 'Premium',
      image: '/images/courses/personal-finance.jpg',
      tag: 'Trending',
      isFree: false,
      requiresAuth: true,
      priceId: 'price_personal_finance'
    },
    {
      id: '6',
      title: 'Liderazgo y Gestión de Equipos',
      description: 'Desarrolla habilidades de liderazgo para gestionar equipos de alto rendimiento.',
      category: 'LIDERAZGO',
      duration: '10 semanas',
      level: 'Avanzado',
      price: 'Premium',
      image: '/images/courses/leadership.jpg',
      tag: 'Recomendado',
      isFree: false,
      requiresAuth: true,
      priceId: 'price_leadership'
    }
  ];

  // Filtrar cursos por categoría
  const filteredCourses = activeCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  // Cursos finales (resultados de búsqueda o filtrados)
  const displayCourses = searchResults && searchResults.length > 0 ? searchResults : filteredCourses;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      performSearch(query, courses);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <DynamicLogo />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Nuestros Cursos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre nuestra selección de cursos diseñados para acelerar tu crecimiento profesional
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <AdvancedSearch 
            onSearch={handleSearch}
            suggestions={searchSuggestions}
            isLoading={isSearching}
            placeholder="Buscar cursos, tecnologías, habilidades..."
          />
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <CategoryNavigation activeCategory={activeCategory} />
        </div>

        {/* Results Summary */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-gray-600">
              {displayCourses.length} resultados para "{searchQuery}"
              {displayCourses.length > 0 && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    clearSearch();
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Limpiar búsqueda
                </button>
              )}
            </p>
          </div>
        )}

        {/* Courses Grid */}
        {isLoading ? (
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
                : 'No hay cursos disponibles en esta categoría'
              }
            </p>
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  clearSearch();
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver todos los cursos
              </button>
            )}
          </div>
        )}

        {/* Companies Marquee */}
        <div className="mt-16">
          <CompaniesMarquee />
        </div>
      </main>

      <Footer />
    </div>
  );
}