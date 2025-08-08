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
    isFree: false
  },
  {
    image: "/images/18.png",
    title: "Asistentes virtuales con IA",
    description: "Domina la creación de asistentes virtuales personalizados para potenciar tu negocio utilizando Google Gemini y ChatGPT",
    tag: "⭐ Curso Destacado",
    duration: "4 horas",
    level: "Intermedio",
    link: "/curso/asistentes-virtuales-ia",
    isFree: true
  },
  {
    image: "/images/19.png",
    title: "Crea Mockups con IA desde cero sin saber nada de diseño",
    description: "Diseñar presentaciones visuales atractivas usando inteligencia artificial. Aprende a crear mockups profesionales sin experiencia previa en diseño.",
    tag: "⭐ Curso Destacado",
    duration: "5 horas",
    level: "Principiante",
    link: "/curso/mockup-cero",
    isFree: true
  },
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
              isFree={course.isFree || course.tag === "Curso Gratuito"}
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