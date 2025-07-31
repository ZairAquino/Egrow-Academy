'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewport } from '@/hooks/useViewport';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'resource' | 'community' | 'event';
  category: string;
  tags: string[];
  relevance: number;
}

interface SearchFilter {
  type: string[];
  category: string[];
  level: string[];
  duration: string[];
  price: string[];
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilter) => void;
  onSuggestionClick: (suggestion: string) => void;
  placeholder?: string;
  className?: string;
  showFilters?: boolean;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  onSuggestionClick,
  placeholder = 'Buscar cursos, recursos...',
  className = '',
  showFilters = true
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilter>({
    type: [],
    category: [],
    level: [],
    duration: [],
    price: []
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState([
    'Inteligencia Artificial',
    'Machine Learning',
    'Desarrollo Web',
    'Python',
    'React',
    'Deep Learning',
    'Data Science',
    'ChatGPT'
  ]);

  const { isMobile } = useViewport();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generar sugerencias basadas en la consulta
  const generateSuggestions = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const allSuggestions = [
      ...popularSearches,
      ...recentSearches,
      'Curso de IA',
      'Tutorial React',
      'Recursos Python',
      'Comunidad ML'
    ];

    const filtered = allSuggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);

    setSuggestions(filtered);
  }, [popularSearches, recentSearches]);

  // Manejar cambios en la consulta
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    generateSuggestions(value);
    setIsOpen(true);
  }, [generateSuggestions]);

  // Manejar búsqueda
  const handleSearch = useCallback(() => {
    if (query.trim()) {
      // Guardar en búsquedas recientes
      setRecentSearches(prev => {
        const newSearches = [query, ...prev.filter(s => s !== query)].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(newSearches));
        return newSearches;
      });

      onSearch(query, filters);
      setIsOpen(false);
    }
  }, [query, filters, onSearch]);

  // Manejar clic en sugerencia
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion);
    onSuggestionClick(suggestion);
    setIsOpen(false);
  }, [onSuggestionClick]);

  // Manejar filtros
  const handleFilterChange = useCallback((filterType: keyof SearchFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }));
  }, []);

  // Cargar búsquedas recientes
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar teclas
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, [handleSearch]);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Barra de búsqueda */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        
        {/* Icono de búsqueda */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Botón de búsqueda */}
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Buscar
        </button>
      </div>

      {/* Panel de sugerencias y filtros */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {/* Sugerencias */}
            {suggestions.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sugerencias</h3>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-150"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Búsquedas recientes */}
            {recentSearches.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Búsquedas recientes</h3>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-150"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Búsquedas populares */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Búsquedas populares</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.slice(0, 6).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-150"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros avanzados */}
            {showFilters && (
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Filtros</h3>
                
                {/* Tipo */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
                  <div className="flex flex-wrap gap-2">
                    {['Cursos', 'Recursos', 'Comunidad', 'Eventos'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleFilterChange('type', type)}
                        className={`px-2 py-1 text-xs rounded ${
                          filters.type.includes(type)
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } transition-colors duration-150`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categoría */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Categoría</label>
                  <div className="flex flex-wrap gap-2">
                    {['IA', 'Desarrollo Web', 'Data Science', 'Machine Learning'].map((category) => (
                      <button
                        key={category}
                        onClick={() => handleFilterChange('category', category)}
                        className={`px-2 py-1 text-xs rounded ${
                          filters.category.includes(category)
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } transition-colors duration-150`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nivel */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nivel</label>
                  <div className="flex flex-wrap gap-2">
                    {['Principiante', 'Intermedio', 'Avanzado'].map((level) => (
                      <button
                        key={level}
                        onClick={() => handleFilterChange('level', level)}
                        className={`px-2 py-1 text-xs rounded ${
                          filters.level.includes(level)
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } transition-colors duration-150`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 