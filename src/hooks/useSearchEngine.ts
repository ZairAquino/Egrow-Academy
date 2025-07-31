'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

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

interface SearchFilter {
  type: string[];
  category: string[];
  level: string[];
  duration: string[];
  price: string[];
}

interface SearchEngineOptions {
  enableVoiceSearch?: boolean;
  enableSuggestions?: boolean;
  enableFilters?: boolean;
  maxResults?: number;
  searchType?: 'all' | 'courses' | 'resources' | 'community';
}

export const useSearchEngine = (options: SearchEngineOptions = {}) => {
  const {
    enableVoiceSearch = true,
    enableSuggestions = true,
    enableFilters = true,
    maxResults = 50,
    searchType = 'all'
  } = options;

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter>({
    type: [],
    category: [],
    level: [],
    duration: [],
    price: []
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [voiceSearchSupported, setVoiceSearchSupported] = useState(false);

  const { trackEvent } = useAnalytics();

  // Detectar soporte de voz
  useEffect(() => {
    if (enableVoiceSearch && 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSearchSupported(true);
    }
  }, [enableVoiceSearch]);

  // Cargar historial de búsqueda
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }, []);

  // Algoritmo de búsqueda inteligente
  const searchAlgorithm = useCallback((query: string, data: SearchResult[], filters: SearchFilter) => {
    if (!query.trim() || !data || !Array.isArray(data)) return [];

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return data
      .map(item => {
        let score = 0;
        const searchableText = `${item.title} ${item.description} ${(item.tags || []).join(' ')} ${item.category}`.toLowerCase();

        // Búsqueda exacta
        if (searchableText.includes(query.toLowerCase())) {
          score += 100;
        }

        // Búsqueda por términos
        searchTerms.forEach(term => {
          if (searchableText.includes(term)) {
            score += 20;
          }
        });

        // Búsqueda en título
        if (item.title.toLowerCase().includes(query.toLowerCase())) {
          score += 50;
        }

        // Búsqueda en tags
        (item.tags || []).forEach(tag => {
          if (tag.toLowerCase().includes(query.toLowerCase())) {
            score += 30;
          }
        });

        // Aplicar filtros
        if (filters.type.length > 0 && !filters.type.includes(item.type)) {
          score = 0;
        }
        if (filters.category.length > 0 && !filters.category.includes(item.category)) {
          score = 0;
        }
        if (filters.level.length > 0 && item.level && !filters.level.includes(item.level)) {
          score = 0;
        }

        return { ...item, relevance: score };
      })
      .filter(item => item.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, maxResults);
  }, [maxResults]);

  // Realizar búsqueda
  const performSearch = useCallback(async (searchQuery: string, searchFilters: SearchFilter = filters) => {
    setIsSearching(true);
    
    try {
      // Buscar en el endpoint real con el tipo de búsqueda
      const searchParams = new URLSearchParams({
        q: searchQuery,
        type: searchType
      });
      
      const response = await fetch(`/api/search?${searchParams.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        let searchResults = data.results || [];
        
        // Filtrar por tipo si es necesario
        if (searchType !== 'all') {
          // Mapear tipos: 'courses' -> 'course', 'resources' -> 'resource', etc.
          const typeMapping: Record<string, string> = {
            'courses': 'course',
            'resources': 'resource', 
            'community': 'community'
          };
          
          const targetType = typeMapping[searchType] || searchType;
          searchResults = searchResults.filter((result: SearchResult) => result.type === targetType);
        }
        
        setResults(searchResults);

        // Guardar en historial
        if (searchQuery.trim()) {
          const newHistory = [searchQuery, ...searchHistory.filter(s => s !== searchQuery)].slice(0, 10);
          setSearchHistory(newHistory);
          localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        }

        // Track evento
        trackEvent('search_performed', {
          query: searchQuery,
          results_count: searchResults.length,
          filters_applied: Object.values(searchFilters).flat().length,
          search_type: searchType
        });
      } else {
        console.error('Error en búsqueda:', response.status);
        setResults([]);
      }

    } catch (error) {
      console.error('Error performing search:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchHistory, filters, trackEvent, searchType]);

  // Búsqueda por voz
  const startVoiceSearch = useCallback(() => {
    if (!voiceSearchSupported) {
      alert('La búsqueda por voz no está disponible en tu navegador');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log('Búsqueda por voz iniciada');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      performSearch(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Error en búsqueda por voz:', event.error);
    };

    recognition.start();
  }, [voiceSearchSupported, performSearch]);

  // Generar sugerencias
  const generateSuggestions = useCallback((partialQuery: string) => {
    if (!partialQuery.trim()) return [];

    const allSuggestions = [
      'Inteligencia Artificial',
      'Machine Learning',
      'Desarrollo Web',
      'Python',
      'React',
      'Deep Learning',
      'Data Science',
      'ChatGPT',
      'Monetización',
      'JavaScript'
    ];

    return allSuggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(partialQuery.toLowerCase())
      )
      .slice(0, 5);
  }, []);

  // Obtener recomendaciones basadas en historial
  const getRecommendations = useMemo(() => {
    const popularSearches = [
      'IA',
      'Machine Learning',
      'Desarrollo Web',
      'Python',
      'React'
    ];

    return [...new Set([...searchHistory, ...popularSearches])].slice(0, 8);
  }, [searchHistory]);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters: Partial<SearchFilter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    if (query.trim()) {
      performSearch(query, updatedFilters);
    }
  }, [filters, query, performSearch]);

  // Limpiar búsqueda
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsSearching(false);
  }, []);

  return {
    query,
    setQuery,
    filters,
    results,
    isSearching,
    searchHistory,
    voiceSearchSupported,
    performSearch,
    startVoiceSearch,
    generateSuggestions,
    getRecommendations,
    updateFilters,
    clearSearch
  };
}; 