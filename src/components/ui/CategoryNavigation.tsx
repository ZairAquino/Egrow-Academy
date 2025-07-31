'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export interface CourseCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  count: number;
}

const categories: CourseCategory[] = [
  {
    id: 'HABILIDADES_IRREMPLAZABLES',
    name: 'Habilidades Irremplazables',
    description: 'Competencias que la IA no puede reemplazar',
    icon: '🎯',
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
    count: 0,
  },
  {
    id: 'IA_PARA_EMPRENDER',
    name: 'IA para Emprender',
    description: 'Herramientas de IA para crear negocios',
    icon: '🚀',
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-purple-600',
    count: 0,
  },
  {
    id: 'DESARROLLO_WEB',
    name: 'Desarrollo Web',
    description: 'Crea sitios web y aplicaciones modernas',
    icon: '💻',
    color: 'bg-green-500',
    gradient: 'from-green-500 to-green-600',
    count: 0,
  },
  {
    id: 'MARKETING_DIGITAL',
    name: 'Marketing Digital',
    description: 'Estrategias para vender en internet',
    icon: '📈',
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-orange-600',
    count: 0,
  },
  {
    id: 'PRODUCTIVIDAD',
    name: 'Productividad',
    description: 'Optimiza tu tiempo y resultados',
    icon: '⚡',
    color: 'bg-yellow-500',
    gradient: 'from-yellow-500 to-yellow-600',
    count: 0,
  },
  {
    id: 'FINANZAS_PERSONALES',
    name: 'Finanzas Personales',
    description: 'Gestiona tu dinero de forma inteligente',
    icon: '💰',
    color: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-emerald-600',
    count: 0,
  },
  {
    id: 'LIDERAZGO',
    name: 'Liderazgo',
    description: 'Desarrolla habilidades de liderazgo',
    icon: '👑',
    color: 'bg-red-500',
    gradient: 'from-red-500 to-red-600',
    count: 0,
  },
  {
    id: 'INNOVACION_TECNOLOGICA',
    name: 'Innovación Tecnológica',
    description: 'Las últimas tendencias en tecnología',
    icon: '🔬',
    color: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-indigo-600',
    count: 0,
  },
];

interface CategoryNavigationProps {
  activeCategory?: string;
  showCounts?: boolean;
  layout?: 'grid' | 'list' | 'compact';
  onCategoryChange?: (category: string) => void;
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  activeCategory = 'all',
  showCounts = true,
  layout = 'grid',
  onCategoryChange,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    
    router.push(`/courses?${params.toString()}`);
    onCategoryChange?.(categoryId);
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'list':
        return 'grid-cols-1 gap-3';
      case 'compact':
        return 'grid-cols-2 md:grid-cols-4 gap-2';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
    }
  };

  return (
    <div className="category-navigation">
      {/* Categoría "Todos" */}
      <div className="mb-6">
        <motion.button
          onClick={() => handleCategoryClick('all')}
          className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
            activeCategory === 'all'
              ? 'border-blue-500 bg-blue-50 shadow-lg'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📚</div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900">Todos los Cursos</h3>
                <p className="text-sm text-gray-600">Explora todo nuestro catálogo</p>
              </div>
            </div>
            {activeCategory === 'all' && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </motion.button>
      </div>

      {/* Grid de categorías */}
      <div className={`grid ${getLayoutClasses()}`}>
        {categories.map((category) => (
          <motion.div
            key={category.id}
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setHoveredCategory(category.id)}
            onHoverEnd={() => setHoveredCategory(null)}
          >
            <button
              onClick={() => handleCategoryClick(category.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                activeCategory === category.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`text-2xl p-2 rounded-lg ${category.color} bg-opacity-10`}>
                  {category.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-gray-900 text-sm md:text-base">
                    {category.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    {category.description}
                  </p>
                  {showCounts && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        {category.count} curso{category.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
                {activeCategory === category.id && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </button>

            {/* Efecto de hover */}
            {hoveredCategory === category.id && (
              <motion.div
                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${category.gradient} opacity-10`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .category-navigation {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

// Componente compacto para sidebar
export const CategorySidebar: React.FC<{
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}> = ({ activeCategory = 'all', onCategoryChange }) => {
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams();
    if (categoryId !== 'all') {
      params.set('category', categoryId);
    }
    router.push(`/courses?${params.toString()}`);
    onCategoryChange?.(categoryId);
  };

  return (
    <div className="category-sidebar">
      <div className="mb-4">
        <h3 className="font-bold text-gray-900 mb-3">Categorías</h3>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={() => handleCategoryClick('all')}
          className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
            activeCategory === 'all'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">📚</span>
            <span className="font-medium">Todos</span>
          </div>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
              activeCategory === category.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{category.icon}</span>
              <span className="font-medium text-sm">{category.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}; 