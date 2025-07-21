'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CourseCard from '@/components/courses/CourseCard';
import Footer from '@/components/layout/Footer';
import UserProfile from '@/components/auth/UserProfile';

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

export default function CoursesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');

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
      id: 'desarrollo-web-fullstack',
      title: 'Desarrollo Web Full Stack con React y Node.js',
      description: 'Aprende a crear aplicaciones web completas desde cero. Domina React, Node.js, Express, MongoDB y despliegue en la nube.',
      category: 'desarrollo-web',
      duration: '25 horas',
      level: 'Intermedio',
      price: '$99.99',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&crop=center',
      tag: 'Especializado',
      link: '/curso/desarrollo-web-fullstack',
      isFree: false,
      requiresAuth: true
    }
  ];

  const getFilteredCourses = () => {
    if (selectedCategory === 'todos') {
      return courses;
    } else if (selectedCategory === 'gratuitos') {
      return courses.filter(course => course.isFree);
    } else if (selectedCategory === 'especializados') {
      return courses.filter(course => !course.isFree);
    } else if (selectedCategory === 'cursos-cortos') {
      return courses.filter(course => course.category === 'cursos-cortos');
    } else {
      return courses.filter(course => course.category === selectedCategory);
    }
  };

  const filteredCourses = getFilteredCourses();

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <UserProfile className="user-profile-top-right" />
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Hero Section */}
        <section className="hero gradient-bg">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Todos los Cursos
                <span className="block">de Inteligencia Artificial</span>
              </h1>
              <p className="hero-description">
                Descubre nuestra colección completa de cursos de IA. Desde principiantes hasta expertos, 
                encuentra el curso perfecto para tu nivel y objetivos.
              </p>
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
            {/* Filtros */}
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-filter ${
                    selectedCategory === category.id ? 'active' : ''
                  }`}
                >
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </div>

            {/* Grid de cursos */}
            <div className="courses-grid">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  image={course.image}
                  title={course.title}
                  description={course.description}
                  tag={course.tag}
                  duration={course.duration}
                  level={course.level}
                  category={course.category}
                  isFree={course.isFree}
                  requiresAuth={course.requiresAuth}
                  link={course.link}
                  onCourseClick={(courseId) => {
                    console.log('Curso clickeado:', courseId);
                    // Aquí puedes agregar la lógica para manejar el clic del curso
                  }}
                />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="no-courses">
                <p>No se encontraron cursos en esta categoría.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
} 