import CourseCard from './CourseCard';
import Link from 'next/link';

const featuredCourses = [
  {
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
    title: "Introducción Práctica a Machine Learning",
    description: "Curso completo de ML por Andrew Ng en Stanford. Aprende los fundamentos desde cero.",
    tag: "Video Curso",
    duration: "60 horas",
    level: "Principiante",
    link: "https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU"
  },
  {
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
    title: "Deep Learning con PyTorch",
    description: "Tutorial completo de PyTorch y redes neuronales por freeCodeCamp.",
    tag: "Video Tutorial",
    duration: "10 horas",
    level: "Intermedio",
    link: "https://www.youtube.com/watch?v=V_xro1bcAuA"
  },
  {
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
    title: "ChatGPT y LLMs: Guía Completa",
    description: "Aprende a construir aplicaciones con ChatGPT, Claude y otros LLMs modernos.",
    tag: "Curso Gratuito",
    duration: "3 horas",
    level: "Principiante",
    link: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/"
  }
];

export default function FeaturedCourses() {
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

        <div className="courses-grid">
          {featuredCourses.map((course, index) => (
            <CourseCard
              key={index}
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
        
        <div className="section-cta">
          <Link href="/courses" className="btn btn-primary">
            Ver Todos los Cursos
          </Link>
        </div>
      </div>
    </section>
  );
} 