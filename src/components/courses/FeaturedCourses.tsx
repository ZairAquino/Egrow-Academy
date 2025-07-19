import CourseCard from './CourseCard';
import Link from 'next/link';

const featuredCourses = [
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
              id={`featured-${index}`}
              image={course.image}
              title={course.title}
              description={course.description}
              tag={course.tag}
              duration={course.duration}
              level={course.level}
              category={course.tag}
              isFree={course.tag === "Curso Gratuito"}
              requiresAuth={false}
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