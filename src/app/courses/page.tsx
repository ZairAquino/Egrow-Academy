'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import CourseCard from '@/components/CourseCard';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function CoursesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const categories = [
    { id: 'todos', name: 'Todos los Cursos', icon: '🚀' },
    { id: 'cortos', name: 'Cursos Cortos', icon: '⚡' },
    { id: 'especializaciones', name: 'Especializaciones', icon: '🎓' },
    { id: 'machine-learning', name: 'Machine Learning', icon: '🤖' },
    { id: 'deep-learning', name: 'Deep Learning', icon: '🧠' },
    { id: 'nlp', name: 'NLP', icon: '💬' },
    { id: 'computer-vision', name: 'Computer Vision', icon: '👁️' },
    { id: 'data-science', name: 'Data Science', icon: '📊' },
    { id: 'ai-ethics', name: 'AI Ethics', icon: '⚖️' },
    { id: 'mlops', name: 'MLOps', icon: '🔧' }
  ];

  const courses = [
    {
      id: 1,
      title: 'ChatGPT Prompt Engineering for Developers',
      description: 'Aprende las mejores prácticas de prompt engineering para aplicaciones con LLMs.',
      category: 'cortos',
      duration: '4 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto'
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals',
      description: 'Fundamentos sólidos de machine learning con Python y scikit-learn.',
      category: 'especializaciones',
      duration: '12 semanas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop&crop=center',
      tag: 'Especialización'
    },
    {
      id: 3,
      title: 'Deep Learning with PyTorch',
      description: 'Construye redes neuronales profundas con PyTorch desde cero.',
      category: 'deep-learning',
      duration: '8 semanas',
      level: 'Avanzado',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop&crop=center',
      tag: 'Especialización'
    },
    {
      id: 4,
      title: 'Natural Language Processing',
      description: 'Procesamiento de lenguaje natural con transformers y BERT.',
      category: 'nlp',
      duration: '6 semanas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center',
      tag: 'Especialización'
    },
    {
      id: 5,
      title: 'Computer Vision & Image Processing',
      description: 'Introducción a visión por computadora con OpenCV y CNN.',
      category: 'computer-vision',
      duration: '5 semanas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto'
    },
    {
      id: 6,
      title: 'AI Ethics and Responsible AI',
      description: 'Aprende sobre ética en IA y desarrollo responsable de sistemas de IA.',
      category: 'ai-ethics',
      duration: '3 horas',
      level: 'Todos los niveles',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto'
    },
    {
      id: 7,
      title: 'Data Science with Python',
      description: 'Análisis de datos, visualización y machine learning con Python.',
      category: 'data-science',
      duration: '10 semanas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&crop=center',
      tag: 'Especialización'
    },
    {
      id: 8,
      title: 'TensorFlow 2.0 Tutorial',
      description: 'Aprende TensorFlow 2.0 desde cero con ejemplos prácticos.',
      category: 'deep-learning',
      duration: '4.5 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto'
    },
    {
      id: 9,
      title: 'MLOps & AI Engineering',
      description: 'Ingeniería de sistemas de IA en producción y mejores prácticas.',
      category: 'mlops',
      duration: '10 semanas',
      level: 'Avanzado',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
      tag: 'Especialización'
    },
    {
      id: 10,
      title: 'Scikit-learn Machine Learning',
      description: 'Master scikit-learn para machine learning con Python.',
      category: 'machine-learning',
      duration: '3.5 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto'
    },
    {
      id: 11,
      title: 'Pandas & NumPy for Data Science',
      description: 'Manipulación y análisis de datos con pandas y NumPy.',
      category: 'data-science',
      duration: '2.5 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto'
    },
    {
      id: 12,
      title: 'OpenCV Computer Vision',
      description: 'Procesamiento de imágenes y visión por computadora con OpenCV.',
      category: 'computer-vision',
      duration: '3 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto'
    }
  ];

  const filteredCourses = selectedCategory === 'todos' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Hero Section */}
        <section className="hero gradient-bg">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Explora nuestros
                <span className="block">cursos de IA</span>
              </h1>
              <p className="hero-description">
                Descubre nuestra colección completa de cursos diseñados por expertos 
                para ayudarte a dominar la inteligencia artificial.
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
            <div className="section-header">
              <h2 className="section-title">Todos los Cursos</h2>
              <p className="section-description">
                Filtra por categoría para encontrar el curso perfecto para ti
              </p>
            </div>

            {/* Category Filters */}
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </div>

            {/* Courses Grid */}
            <div className="courses-grid">
              {filteredCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  image={course.image}
                  title={course.title}
                  description={course.description}
                  tag={course.tag}
                  duration={course.duration}
                  level={course.level}
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
    </>
  );
} 