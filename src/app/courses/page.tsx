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
    { id: 'premium', name: 'Cursos Premium' },
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
      id: '1',
      title: 'Machine Learning por Andrew Ng - Stanford',
      description: 'El curso más completo de ML. Fundamentos matemáticos y prácticos de machine learning.',
      category: 'machine-learning',
      duration: '60 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop&crop=center',
      tag: 'Video Curso',
      link: 'https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU',
      isFree: true,
      requiresAuth: false
    },
    {
      id: '2',
      title: 'Deep Learning Specialization - Coursera',
      description: 'Especialización completa en deep learning con Andrew Ng. 5 cursos en uno.',
      category: 'deep-learning',
      duration: '80 horas',
      level: 'Intermedio',
      price: '$49/mes',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop&crop=center',
      tag: 'Coursera',
      link: 'https://www.coursera.org/specializations/deep-learning',
      isFree: false,
      requiresAuth: true
    },
    {
      id: '3',
      title: 'Natural Language Processing - Stanford',
      description: 'Curso avanzado de NLP. Transformers, BERT, GPT y más.',
      category: 'nlp',
      duration: '40 horas',
      level: 'Avanzado',
      price: '$49/mes',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center',
      tag: 'Coursera',
      link: 'https://www.coursera.org/learn/nlp-sequence-models',
      isFree: false,
      requiresAuth: true
    },
    {
      id: '4',
      title: 'Computer Vision - MIT',
      description: 'Fundamentos de visión por computadora. Detección de objetos, segmentación.',
      category: 'computer-vision',
      duration: '50 horas',
      level: 'Intermedio',
      price: '$49/mes',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center',
      tag: 'MIT OpenCourseWare',
      link: 'https://ocw.mit.edu/courses/6-801-machine-vision-fall-2020/',
      isFree: false,
      requiresAuth: true
    },
    {
      id: '5',
      title: 'Data Science Professional Certificate - IBM',
      description: 'Certificación completa en ciencia de datos. Python, SQL, ML, visualización.',
      category: 'data-science',
      duration: '100 horas',
      level: 'Principiante',
      price: '$39/mes',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
      tag: 'Coursera',
      link: 'https://www.coursera.org/professional-certificates/ibm-data-science',
      isFree: false,
      requiresAuth: true
    },
    {
      id: '6',
      title: 'Python para Data Science - freeCodeCamp',
      description: 'Aprende Python desde cero para ciencia de datos. Incluye proyectos prácticos.',
      category: 'data-science',
      duration: '30 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&crop=center',
      tag: 'freeCodeCamp',
      link: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
      isFree: true,
      requiresAuth: false
    },
    {
      id: '7',
      title: 'ChatGPT Prompt Engineering - DeepLearning.AI',
      description: 'Aprende a escribir prompts efectivos para ChatGPT y otros LLMs.',
      category: 'llms',
      duration: '2 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
      tag: 'DeepLearning.AI',
      link: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/',
      isFree: true,
      requiresAuth: false
    },
    {
      id: '8',
      title: 'Advanced Machine Learning - Google',
      description: 'Machine learning avanzado con TensorFlow. Redes neuronales, CNN, RNN.',
      category: 'machine-learning',
      duration: '45 horas',
      level: 'Avanzado',
      price: '$49/mes',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop&crop=center',
      tag: 'Coursera',
      link: 'https://www.coursera.org/specializations/tensorflow-advanced-techniques',
      isFree: false,
      requiresAuth: true
    },
    {
      id: '9',
      title: 'NLP con Transformers - Hugging Face',
      description: 'Curso oficial de Hugging Face sobre transformers y modelos de lenguaje.',
      category: 'nlp',
      duration: '20 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center',
      tag: 'Hugging Face',
      link: 'https://huggingface.co/course',
      isFree: true,
      requiresAuth: false
    },
    {
      id: '10',
      title: 'Computer Vision con PyTorch - Udacity',
      description: 'Aprende visión por computadora usando PyTorch. Detección, clasificación, segmentación.',
      category: 'computer-vision',
      duration: '35 horas',
      level: 'Intermedio',
      price: '$399',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center',
      tag: 'Udacity',
      link: 'https://www.udacity.com/course/computer-vision-nanodegree--nd891',
      isFree: false,
      requiresAuth: true
    },
    {
      id: '11',
      title: 'Data Science Bootcamp - DataCamp',
      description: 'Bootcamp intensivo de ciencia de datos. Python, R, SQL, ML, visualización.',
      category: 'data-science',
      duration: '120 horas',
      level: 'Principiante',
      price: '$39/mes',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
      tag: 'DataCamp',
      link: 'https://www.datacamp.com/tracks/data-scientist-with-python',
      isFree: false,
      requiresAuth: true
    },
    {
      id: '12',
      title: 'LLMs y ChatGPT - Stanford',
      description: 'Curso sobre grandes modelos de lenguaje. Arquitectura, entrenamiento, aplicaciones.',
      category: 'llms',
      duration: '25 horas',
      level: 'Avanzado',
      price: '$49/mes',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
      tag: 'Coursera',
      link: 'https://www.coursera.org/learn/natural-language-processing',
      isFree: false,
      requiresAuth: true
    },
    {
      id: '13',
      title: 'Machine Learning con Scikit-learn',
      description: 'Tutorial completo de machine learning con Python y scikit-learn.',
      category: 'machine-learning',
      duration: '15 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop&crop=center',
      tag: 'YouTube',
      link: 'https://www.youtube.com/watch?v=0B5eIE_1vpU',
      isFree: true,
      requiresAuth: false
    },
    {
      id: '14',
      title: 'Deep Learning con TensorFlow - Google',
      description: 'Curso oficial de Google sobre deep learning con TensorFlow.',
      category: 'deep-learning',
      duration: '30 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop&crop=center',
      tag: 'Google',
      link: 'https://developers.google.com/machine-learning/crash-course',
      isFree: true,
      requiresAuth: false
    },
    {
      id: '15',
      title: 'Deep Learning con PyTorch - Tutorial Completo',
      description: 'Aprende PyTorch desde cero. Tutorial de 10 horas por freeCodeCamp.',
      category: 'deep-learning',
      duration: '10 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop&crop=center',
      tag: 'Video Tutorial',
      link: 'https://www.youtube.com/watch?v=V_xro1bcAuA',
      isFree: true,
      requiresAuth: false
    },
    {
      id: '16',
      title: 'LangChain para Principiantes',
      description: 'Construye aplicaciones con LLMs usando LangChain. Tutorial paso a paso.',
      category: 'llms',
      duration: '5 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
      tag: 'Video Tutorial',
      link: 'https://www.youtube.com/watch?v=LbT1yp6quS8',
      isFree: true,
      requiresAuth: false
    },
    {
      id: '17',
      title: 'ChatGPT Prompt Engineering',
      description: 'Curso oficial de DeepLearning.AI y OpenAI sobre prompt engineering.',
      category: 'llms',
      duration: '1.5 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      link: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/',
      isFree: true,
      requiresAuth: false
    },
    {
      id: '18',
      title: 'Transformer y Atención - Explicado',
      description: 'Entiende la arquitectura Transformer que potencia ChatGPT y otros LLMs.',
      category: 'nlp',
      duration: '3 horas',
      level: 'Avanzado',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center',
      tag: 'Video Tutorial',
      link: 'https://www.youtube.com/watch?v=4Bdc55j80l8',
      isFree: true,
      requiresAuth: false
    },
    {
      id: '19',
      title: 'Fast.ai - Deep Learning Práctico',
      description: 'Aprende deep learning con el enfoque práctico de fast.ai. Sin matemáticas complejas.',
      category: 'deep-learning',
      duration: '24 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop&crop=center',
      tag: 'Video Curso',
      link: 'https://www.youtube.com/playlist?list=PLfYUBJiXbdtRL3FMB3GoWHRI8ieU6FhfM',
      isFree: true,
      requiresAuth: false
    },
    {
      id: '20',
      title: 'Python para Machine Learning',
      description: 'Curso completo de Python enfocado en ciencia de datos y ML.',
      category: 'machine-learning',
      duration: '12 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&crop=center',
      tag: 'Video Curso',
      link: 'https://www.youtube.com/watch?v=WGJJIrtnfpk',
      isFree: true,
      requiresAuth: false
    },
    {
      id: '21',
      title: 'Introducción a ChatGPT - Curso Corto',
      description: 'Aprende a usar ChatGPT de manera efectiva en solo 2 horas.',
      category: 'cursos-cortos',
      duration: '2 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      isFree: true,
      requiresAuth: true
    },
    {
      id: '22',
      title: 'Fundamentos de Machine Learning - Curso Corto',
      description: 'Conceptos básicos de ML en 3 horas. Ideal para principiantes.',
      category: 'cursos-cortos',
      duration: '3 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      isFree: true,
      requiresAuth: true
    },
    {
      id: '23',
      title: 'Python Básico para Data Science - Curso Corto',
      description: 'Aprende Python básico para análisis de datos en 4 horas.',
      category: 'cursos-cortos',
      duration: '4 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      isFree: true,
      requiresAuth: true
    }
  ];

  const getFilteredCourses = () => {
    if (selectedCategory === 'todos') {
      return courses;
    } else if (selectedCategory === 'gratuitos') {
      return courses.filter(course => course.isFree);
    } else if (selectedCategory === 'premium') {
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