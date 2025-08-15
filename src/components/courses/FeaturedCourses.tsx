'use client';

import { useState, useRef, useEffect } from 'react';
import CourseCard from './CourseCard';
import Link from 'next/link';

const featuredCourses = [
  {
    image: "/images/courses/monetiza-voz-ia.png",
    title: "Monetiza tu Voz con IA: ElevenLabs para anuncios, cursos y podcasts (sin curva técnica)",
    description: "Aprende a monetizar tu voz con IA usando ElevenLabs. Crea anuncios, cursos narrados y podcasts profesionales sin curva técnica.",
    tag: "⭐ Curso Destacado",
    duration: "8 horas",
    level: "Principiante",
    link: "/curso/monetiza-voz-ia-elevenlabs",
    isFree: false,
    slug: "monetiza-voz-ia-elevenlabs",
    // Datos reales de la página del curso
    studentsCount: 2863,
    likePercentage: 99,
    totalLikes: 450
  },
  {
    image: "/images/18.png",
    title: "Asistentes virtuales con IA",
    description: "Domina la creación de asistentes virtuales personalizados para potenciar tu negocio utilizando Google Gemini y ChatGPT",
    tag: "⭐ Curso Destacado",
    duration: "4 horas",
    level: "Intermedio",
    link: "/curso/asistentes-virtuales-ia",
    isFree: true,
    slug: "asistentes-virtuales-ia",
    // Datos reales de la página del curso (sin estadísticas visibles, usar datos por defecto)
    studentsCount: 1250,
    likePercentage: 97,
    totalLikes: 180
  },
  {
    image: "/images/19.png",
    title: "Crea Mockups con IA desde cero sin saber nada de diseño",
    description: "Diseñar presentaciones visuales atractivas usando inteligencia artificial. Aprende a crear mockups profesionales sin experiencia previa en diseño.",
    tag: "⭐ Curso Destacado",
    duration: "5 horas",
    level: "Principiante",
    link: "/curso/mockup-cero",
    isFree: true,
    slug: "mockup-cero",
    // Datos reales de la página del curso
    studentsCount: 3421,
    likePercentage: 98,
    totalLikes: 523
  },
];

export default function FeaturedCourses() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    }
    return num.toString();
  };

  // Auto-scroll del carrusel cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current && window.innerWidth < 768) {
        const maxSlides = featuredCourses.length - 1;
        const nextSlide = currentSlide >= maxSlides ? 0 : currentSlide + 1;
        setCurrentSlide(nextSlide);
        
        // Calcular ancho según el tamaño de pantalla
        const cardWidth = window.innerWidth <= 480 ? 220 + 12 : 250 + 16;
        carouselRef.current.scrollTo({
          left: nextSlide * cardWidth,
          behavior: 'smooth'
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const scrollToSlide = (index: number) => {
    if (carouselRef.current) {
      setCurrentSlide(index);
      // Calcular ancho según el tamaño de pantalla
      const cardWidth = window.innerWidth <= 480 ? 220 + 12 : 250 + 16;
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Cursos Destacados</h2>
          <p className="section-description">
            Comienza a aprender con nuestros cursos más populares de IA y
            aprendizaje automático
          </p>
        </div>

        {/* Grid para tablet y desktop */}
        <div className="courses-grid">
          {featuredCourses.map((course, index) => (
            <CourseCard
              key={index}
              id={`featured-${index}`}
              image={course.image}
              title={course.title}
              description={course.description}
              tag={course.tag}
              duration={course.duration}
              level={course.level}
              category={course.tag}
              isFree={course.isFree || course.tag === "Curso Gratuito"}
              requiresAuth={false}
              link={course.link}
              showTopSalesBadge={course.title.includes("Monetiza tu Voz con IA")}
              studentsCount={course.studentsCount}
              likePercentage={course.likePercentage}
              totalLikes={course.totalLikes}
              formatNumber={formatNumber}
            />
          ))}
        </div>

        {/* Carrusel para móviles */}
        <div className="carousel-container">
          <div className="courses-carousel" ref={carouselRef}>
            {featuredCourses.map((course, index) => (
              <CourseCard
                key={`carousel-${index}`}
                id={`featured-carousel-${index}`}
                image={course.image}
                title={course.title}
                description={course.description}
                tag={course.tag}
                duration={course.duration}
                level={course.level}
                category={course.tag}
                isFree={course.isFree || course.tag === "Curso Gratuito"}
                requiresAuth={false}
                link={course.link}
                showTopSalesBadge={course.title.includes("Monetiza tu Voz con IA")}
                studentsCount={course.studentsCount}
                likePercentage={course.likePercentage}
                totalLikes={course.totalLikes}
                formatNumber={formatNumber}
              />
            ))}
          </div>
          
          {/* Dots indicator */}
          <div className="carousel-dots">
            {featuredCourses.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => scrollToSlide(index)}
                aria-label={`Ir al curso ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="section-cta">
          <Link href="/courses" className="btn btn-primary">
            Ver Todos los Cursos
          </Link>
        </div>
      </div>
    </section>
  );
} 