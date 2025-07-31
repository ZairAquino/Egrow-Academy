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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'courses' | 'resources' | 'community'>('all');

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
    maxResults: 50
  });

  useEffect(() => {
    // Obtener parámetros de búsqueda de la URL
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
      setQuery(queryParam);
      performSearch(queryParam, filters);
    }
    
    setIsLoading(false);
  }, [searchParams, setQuery, performSearch, filters]);

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

  // Filtrar resultados por tipo
  const getFilteredResults = () => {
    if (activeTab === 'all') {
      return searchResults;
    }
    return searchResults.filter(result => result.type === activeTab);
  };

  const filteredResults = getFilteredResults();
  const isSearchingOrLoading = isSearching || isLoading;

  return (
    <>
      <Navbar />
      
      <main className="main-content pt-16">
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
                placeholder="Buscar en toda la plataforma..."
                className="max-w-2xl mx-auto"
                showFilters={true}
              />
            </div>

            {/* Información de búsqueda */}
            {searchQuery && (
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Resultados de búsqueda
                </h1>
                <p className="text-gray-600">
                  {isSearchingOrLoading 
                    ? 'Buscando...' 
                    : `Encontrados ${filteredResults.length} resultado${filteredResults.length !== 1 ? 's' : ''} para "${searchQuery}"`
                  }
                </p>
              </div>
            )}

            {/* Tabs de filtros */}
            {searchQuery && !isSearchingOrLoading && (
              <div className="mb-6">
                <div className="flex justify-center space-x-1 bg-gray-100 p-1 rounded-lg">
                  {[
                    { id: 'all', label: 'Todo', count: searchResults.length },
                    { id: 'courses', label: 'Cursos', count: searchResults.filter(r => r.type === 'course').length },
                    { id: 'resources', label: 'Recursos', count: searchResults.filter(r => r.type === 'resource').length },
                    { id: 'community', label: 'Comunidad', count: searchResults.filter(r => r.type === 'community').length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resultados */}
            {isSearchingOrLoading ? (
              <SkeletonGrid items={6} className="courses-grid" />
            ) : (
              <div className="courses-grid">
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <div key={result.id} className="course-card-new">
                      <div className="course-image-new">
                        <img 
                          src={result.image || '/images/course-default.jpg'} 
                          alt={result.title} 
                          className="course-image"
                        />
                        <span className="course-type-badge">
                          {result.type === 'course' ? 'Curso' : 
                           result.type === 'resource' ? 'Recurso' : 
                           result.type === 'community' ? 'Comunidad' : 'Evento'}
                        </span>
                      </div>
                      <div className="course-content-new">
                        <div className="course-meta">
                          <span className="course-instructor">eGrow Academy</span>
                        </div>
                        <h3 className="course-title-new">
                          {result.title}
                        </h3>
                        <p className="course-description-new">
                          {result.description}
                        </p>
                        <div className="course-link">
                          Ver {result.type === 'course' ? 'Curso' : 
                               result.type === 'resource' ? 'Recurso' : 
                               result.type === 'community' ? 'Comunidad' : 'Evento'} →
                        </div>
                      </div>
                    </div>
                  ))
                ) : searchQuery ? (
                  <div className="no-courses">
                    <p>No se encontraron resultados para "{searchQuery}"</p>
                    <p className="text-gray-500 mt-2">
                      Intenta con otros términos o revisa la ortografía
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Busca en toda la plataforma
                    </h2>
                    <p className="text-gray-600">
                      Encuentra cursos, recursos, contenido de la comunidad y más
                    </p>
                  </div>
                )}
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

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .course-card-new {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .course-card-new:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
        }

        .course-image-new {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .course-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .course-type-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(59, 130, 246, 0.9);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .course-content-new {
          padding: 1.5rem;
        }

        .course-meta {
          margin-bottom: 0.5rem;
        }

        .course-instructor {
          font-size: 14px;
          color: #6b7280;
        }

        .course-title-new {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .course-description-new {
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .course-link {
          color: #3b82f6;
          font-weight: 500;
          font-size: 14px;
        }

        .no-courses {
          text-align: center;
          padding: 3rem 1rem;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .courses-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
} 