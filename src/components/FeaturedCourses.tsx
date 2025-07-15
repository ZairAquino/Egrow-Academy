import CourseCard from './CourseCard';

const featuredCourses = [
  {
    image: "https://via.placeholder.com/400x250/667eea/ffffff?text=Course+1",
    title: "ChatGPT Prompt Engineering for Developers",
    description: "Aprende las mejores prácticas de prompt engineering para aplicaciones con LLMs.",
    tag: "Curso Corto",
    duration: "4 horas",
    level: "Intermedio"
  },
  {
    image: "https://via.placeholder.com/400x250/764ba2/ffffff?text=Course+2",
    title: "Machine Learning Fundamentals",
    description: "Fundamentos sólidos de machine learning con Python y scikit-learn.",
    tag: "Especialización",
    duration: "12 semanas",
    level: "Principiante"
  },
  {
    image: "https://via.placeholder.com/400x250/f093fb/ffffff?text=Course+3",
    title: "Deep Learning with PyTorch",
    description: "Construye redes neuronales profundas con PyTorch desde cero.",
    tag: "Especialización",
    duration: "16 semanas",
    level: "Avanzado"
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
            />
          ))}
        </div>
      </div>
    </section>
  );
} 