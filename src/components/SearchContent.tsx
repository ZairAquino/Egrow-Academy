'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdvancedSearch } from '@/components/ui/AdvancedSearch';
import { useSearchEngine } from '@/hooks/useSearchEngine';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SkeletonGrid } from '@/components/ui/SkeletonLoader';
import CourseCard from '@/components/courses/CourseCard';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'resource' | 'community' | 'event';
  category: string;
  tags: string[];
  relevance: number;
  level?: string;
  duration?: string;
  price?: string;
  image?: string;
  tag?: string;
  isFree?: boolean;
  requiresAuth?: boolean;
  link?: string;
}

export default function SearchContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  
  const { 
    searchResults,
    searchSuggestions,
    isSearching,
    performSearch,
    clearSearch 
  } = useSearchEngine();

  // Get initial query from URL params
  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (query && query !== currentQuery) {
      setCurrentQuery(query);
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setCurrentQuery(query);
    if (query.trim()) {
      setIsLoading(true);
      
      // Mock data for search - replace with actual API call
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Desarrollo Web Full Stack con React y Node.js',
          description: 'Aprende a crear aplicaciones web completas desde cero',
          type: 'course',
          category: 'DESARROLLO_WEB',
          tags: ['react', 'nodejs', 'javascript', 'fullstack'],
          relevance: 0.95,
          level: 'Intermedio',
          duration: '12 semanas',
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
          description: 'Descubre cómo aplicar IA en tu negocio',
          type: 'course',
          category: 'IA_PARA_EMPRENDER',
          tags: ['ai', 'machine learning', 'emprendimiento'],
          relevance: 0.87,
          level: 'Principiante',
          duration: '8 semanas',
          price: 'Premium',
          image: '/images/courses/ai-entrepreneurs.jpg',
          tag: 'Nuevo',
          isFree: false,
          requiresAuth: true
        }
      ];

      // Filter results based on query
      const filtered = mockResults.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

      performSearch(query, filtered);
      setIsLoading(false);
    } else {
      clearSearch();
      setCurrentQuery('');
    }
  };

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Búsqueda', href: '/search' }
  ];

  const displayResults = searchResults || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Búsqueda Avanzada
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra exactamente lo que necesitas con nuestro motor de búsqueda inteligente
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <AdvancedSearch 
            onSearch={handleSearch}
            suggestions={searchSuggestions}
            isLoading={isSearching || isLoading}
            placeholder="Buscar cursos, recursos, eventos..."
            initialValue={currentQuery}
          />
        </div>

        {/* Results Summary */}
        {currentQuery && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {displayResults.length} resultados para "{currentQuery}"
              </p>
              <button 
                onClick={() => {
                  setCurrentQuery('');
                  clearSearch();
                  window.history.pushState({}, '', '/search');
                }}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Limpiar búsqueda
              </button>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {isLoading ? (
          <SkeletonGrid>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-64 animate-pulse">
                <div className="h-32 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </SkeletonGrid>
        ) : displayResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayResults.map((result) => (
              <CourseCard
                key={result.id}
                title={result.title}
                description={result.description}
                category={result.category}
                duration={result.duration || ''}
                level={result.level || ''}
                price={result.price || ''}
                image={result.image || '/images/courses/default.jpg'}
                tag={result.tag || ''}
                link={result.link}
                isFree={result.isFree || false}
                requiresAuth={result.requiresAuth || true}
                isAuthenticated={true}
              />
            ))}
          </div>
        ) : currentQuery ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-600 mb-4">
              No hay contenido que coincida con "{currentQuery}"
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Sugerencias:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Verifica la ortografía de tu búsqueda</li>
                <li>Intenta con términos más generales</li>
                <li>Usa palabras clave relacionadas</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Comienza tu búsqueda
            </h3>
            <p className="text-gray-600">
              Utiliza la barra de búsqueda para encontrar cursos, recursos y más
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}