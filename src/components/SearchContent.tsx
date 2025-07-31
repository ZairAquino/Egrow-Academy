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
  type: 'course' | 'resource' | 'community' | 'event' | 'page';
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
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  const { 
    searchSuggestions,
    isSearching,
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

  const handleSearch = async (query: string) => {
    setCurrentQuery(query);
    if (query.trim()) {
      setIsLoading(true);
      
      try {
        console.log('Buscando:', query);
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Resultados del API:', data.results);
          setSearchResults(data.results || []);
        } else {
          console.error('Error en API:', response.status);
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error en búsqueda:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
      setCurrentQuery('');
    }
  };

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Búsqueda', href: '/search' }
  ];

  const displayResults = searchResults || [];
  
  // Debug log
  console.log('SearchContent - currentQuery:', currentQuery);
  console.log('SearchContent - searchResults:', searchResults);
  console.log('SearchContent - displayResults:', displayResults);

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
            onSearch={(query, filters) => handleSearch(query)}
            onSuggestionClick={(suggestion) => handleSearch(suggestion)}
            placeholder="Buscar cursos, recursos, eventos..."
            showFilters={false}
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
                  setSearchResults([]);
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
              <div key={i} className="bg-white rounded-lg shadow-md h-48 animate-pulse">
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </SkeletonGrid>
        ) : displayResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayResults.map((result) => {
              // Renderizar diferentes tipos de resultados
              if (result.type === 'course') {
                return (
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
                );
              } else if (result.type === 'resource') {
                return (
                  <div key={result.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded mr-2">📖 Recurso</span>
                        <span className="text-sm text-gray-500">{result.category}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{result.title}</h3>
                      <p className="text-gray-600 mb-4">{result.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{result.price || 'Gratis'}</span>
                        <a 
                          href={result.link} 
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Ver Recurso
                        </a>
                      </div>
                    </div>
                  </div>
                );
              } else if (result.type === 'event') {
                return (
                  <div key={result.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded mr-2">🎯 Evento</span>
                        <span className="text-sm text-gray-500">{result.category}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{result.title}</h3>
                      <p className="text-gray-600 mb-4">{result.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{result.duration || 'Evento'}</span>
                        <a 
                          href={result.link} 
                          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                        >
                          Ver Evento
                        </a>
                      </div>
                    </div>
                  </div>
                );
              } else if (result.type === 'community') {
                return (
                  <div key={result.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded mr-2">💬 Comunidad</span>
                        <span className="text-sm text-gray-500">{result.category}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{result.title}</h3>
                      <p className="text-gray-600 mb-4">{result.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Discusión</span>
                        <a 
                          href={result.link} 
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                          Ver Post
                        </a>
                      </div>
                    </div>
                  </div>
                );
              } else if (result.type === 'page') {
                return (
                  <div key={result.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded mr-2">📄 Página</span>
                        <span className="text-sm text-gray-500">{result.category}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{result.title}</h3>
                      <p className="text-gray-600 mb-4">{result.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{result.price || 'Gratis'}</span>
                        <a 
                          href={result.link} 
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          Ir a Página
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }
              
              // Fallback para tipos no reconocidos
              return (
                <div key={result.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{result.title}</h3>
                    <p className="text-gray-600 mb-4">{result.description}</p>
                    <a 
                      href={result.link} 
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Ver Más
                    </a>
                  </div>
                </div>
              );
            })}
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