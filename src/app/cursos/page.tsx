'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import DynamicLogo from '@/components/ui/DynamicLogo';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CourseCard from '@/components/courses/CourseCard';
import Footer from '@/components/layout/Footer';
import UserProfile from '@/components/auth/UserProfile';
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

export default function CursosPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
      id: 'introduccion-llms',
      title: 'Introducción a Large Language Models (LLMs)',
      description: 'Aprende los fundamentos de los modelos de lenguaje grandes, desde GPT hasta Claude, y cómo implementarlos en aplicaciones reales.',
      category: 'llms',
      duration: '2 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
      tag: 'eGrow Academy',
      link: '/curso/introduccion-llms',
      isFree: true,
      requiresAuth: false
    },
    {
      id: 'fundamentos-ml',
      title: 'Fundamentos de Machine Learning',
      description: 'Aprende los conceptos básicos de Machine Learning, desde algoritmos supervisados hasta no supervisados, y cómo implementarlos en Python.',
      category: 'machine-learning',
      duration: '2.5 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop&crop=center',
      tag: 'eGrow Academy',
      link: '/curso/fundamentos-ml',
      isFree: true,
      requiresAuth: false
    },
    {
      id: 'desarrollo-web-fullstack',
      title: 'Desarrollo Web Full Stack',
      description: 'Aprende a crear aplicaciones web completas desde el frontend hasta el backend, incluyendo bases de datos y despliegue.',
      category: 'desarrollo-web',
      duration: '4 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&crop=center',
      tag: 'eGrow Academy',
      link: '/curso/desarrollo-web-fullstack',
      isFree: true,
      requiresAuth: false
    },
    {
      id: 'computer-vision',
      title: 'Computer Vision con Python',
      description: 'Aprende a procesar y analizar imágenes y videos usando técnicas de visión por computadora y deep learning.',
      category: 'computer-vision',
      duration: '3.5 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop&crop=center',
      tag: 'eGrow Academy',
      link: '/curso/computer-vision',
      isFree: true,
      requiresAuth: false
    }
  ];

  const getFilteredCourses = () => {
    if (selectedCategory === 'todos') {
      return courses;
    }
    return courses.filter(course => course.category === selectedCategory);
  };

  const filteredCourses = getFilteredCourses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <DynamicLogo className="h-8 w-auto" />
            </div>
            <div className="flex items-center space-x-4">
              <UserProfile />
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">
                  Explora Nuestros Cursos
                </h1>
                <p className="text-xl mb-8 max-w-3xl mx-auto">
                  Descubre una amplia variedad de cursos en tecnología, inteligencia artificial y desarrollo web. 
                  Aprende a tu ritmo con contenido de alta calidad.
                </p>
              </div>
            </div>
          </section>

          {/* Categories Filter */}
          <section className="bg-white py-8 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Courses Grid */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              
              {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No se encontraron cursos en esta categoría.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Companies Marquee */}
          <Suspense fallback={<LoadingSpinner />}>
            <CompaniesMarquee />
          </Suspense>

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
} 