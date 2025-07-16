import CourseCard from './CourseCard';
import Link from 'next/link';

const featuredCourses = [
  {
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
    title: "ChatGPT Prompt Engineering for Developers",
    description: "Aprende las mejores prácticas de prompt engineering para aplicaciones con LLMs.",
    tag: "Curso Corto",
    duration: "1.5 horas",
    level: "Principiante",
    link: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/"
  },
  {
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
    title: "Building Systems with the ChatGPT API",
    description: "Construye aplicaciones complejas usando el API de ChatGPT y mejores prácticas.",
    tag: "Curso Corto",
    duration: "1 hora",
    level: "Intermedio",
    link: "https://www.deeplearning.ai/short-courses/building-systems-with-chatgpt/"
  },
  {
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
    title: "LangChain for LLM Application Development",
    description: "Usa el framework LangChain para construir aplicaciones potentes con LLMs.",
    tag: "Curso Corto",
    duration: "1 hora",
    level: "Intermedio",
    link: "https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/"
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