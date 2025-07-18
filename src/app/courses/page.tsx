'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CourseCard from '@/components/courses/CourseCard';
import Footer from '@/components/layout/Footer';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
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
    { id: 'todos', name: 'Todos los Cursos' },
    { id: 'cortos', name: 'Cursos Cortos' },
    { id: 'videos', name: 'Video Tutoriales' },
    { id: 'especializaciones', name: 'Especializaciones' },
    { id: 'machine-learning', name: 'Machine Learning' },
    { id: 'deep-learning', name: 'Deep Learning' },
    { id: 'nlp', name: 'NLP' },
    { id: 'computer-vision', name: 'Computer Vision' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'llms', name: 'LLMs & ChatGPT' }
  ];

  const courses = [
    {
      id: 1,
      title: 'Machine Learning por Andrew Ng - Stanford',
      description: 'El curso más completo de ML. Fundamentos matemáticos y prácticos de machine learning.',
      category: 'videos',
      duration: '60 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop&crop=center',
      tag: 'Video Curso',
      link: 'https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU'
    },
    {
      id: 15,
      title: 'Deep Learning con PyTorch - Tutorial Completo',
      description: 'Aprende PyTorch desde cero. Tutorial de 10 horas por freeCodeCamp.',
      category: 'videos',
      duration: '10 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop&crop=center',
      tag: 'Video Tutorial',
      link: 'https://www.youtube.com/watch?v=V_xro1bcAuA'
    },
    {
      id: 16,
      title: 'LangChain para Principiantes',
      description: 'Construye aplicaciones con LLMs usando LangChain. Tutorial paso a paso.',
      category: 'llms',
      duration: '5 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
      tag: 'Video Tutorial',
      link: 'https://www.youtube.com/watch?v=LbT1yp6quS8'
    },
    {
      id: 17,
      title: 'ChatGPT Prompt Engineering',
      description: 'Curso oficial de DeepLearning.AI y OpenAI sobre prompt engineering.',
      category: 'llms',
      duration: '1.5 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      link: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/'
    },
    {
      id: 18,
      title: 'Transformer y Atención - Explicado',
      description: 'Entiende la arquitectura Transformer que potencia ChatGPT y otros LLMs.',
      category: 'videos',
      duration: '3 horas',
      level: 'Avanzado',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center',
      tag: 'Video Tutorial',
      link: 'https://www.youtube.com/watch?v=4Bdc55j80l8'
    },
    {
      id: 19,
      title: 'Fast.ai - Deep Learning Práctico',
      description: 'Aprende deep learning con el enfoque práctico de fast.ai. Sin matemáticas complejas.',
      category: 'videos',
      duration: '24 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop&crop=center',
      tag: 'Video Curso',
      link: 'https://www.youtube.com/playlist?list=PLfYUBJiXbdtRL3FMB3GoWHRI8ieU6FhfM'
    },
    {
      id: 20,
      title: 'Python para Machine Learning',
      description: 'Curso completo de Python enfocado en ciencia de datos y ML.',
      category: 'videos',
      duration: '12 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&crop=center',
      tag: 'Video Curso',
      link: 'https://www.youtube.com/watch?v=7eh4d6sabA0'
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
                  link={course.link}
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