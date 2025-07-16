import { z } from 'zod'
import { router, publicProcedure } from '../../lib/trpc'

// Simulación de base de datos
let courses = [
  {
    id: '1',
    title: 'Desarrollo Web Full Stack',
    description: 'Aprende HTML, CSS, JavaScript y React',
    price: 0,
    duration: '12 semanas',
    level: 'Principiante',
    image: '/images/course-1.jpg',
    category: 'Desarrollo Web',
    source: 'YouTube - freeCodeCamp'
  },
  {
    id: '2',
    title: 'Data Science con Python',
    description: 'Análisis de datos y machine learning',
    price: 0,
    duration: '16 semanas',
    level: 'Intermedio',
    image: '/images/course-2.jpg',
    category: 'Data Science',
    source: 'YouTube - Krish Naik'
  },
  {
    id: '3',
    title: 'Marketing Digital',
    description: 'Estrategias de marketing online',
    price: 0,
    duration: '8 semanas',
    level: 'Principiante',
    image: '/images/course-3.jpg',
    category: 'Marketing',
    source: 'YouTube - HubSpot'
  },
  {
    id: '4',
    title: 'Machine Learning Fundamentals',
    description: 'Fundamentos de machine learning con Python y scikit-learn',
    price: 0,
    duration: '12 semanas',
    level: 'Principiante',
    image: '/images/course-4.jpg',
    category: 'Machine Learning',
    source: 'YouTube - Stanford CS229'
  },
  {
    id: '5',
    title: 'Deep Learning with PyTorch',
    description: 'Redes neuronales profundas con PyTorch',
    price: 0,
    duration: '8 semanas',
    level: 'Avanzado',
    image: '/images/course-5.jpg',
    category: 'Deep Learning',
    source: 'YouTube - PyTorch Official'
  },
  {
    id: '6',
    title: 'Natural Language Processing',
    description: 'Procesamiento de lenguaje natural con transformers',
    price: 0,
    duration: '6 semanas',
    level: 'Intermedio',
    image: '/images/course-6.jpg',
    category: 'NLP',
    source: 'YouTube - Hugging Face'
  },
  {
    id: '7',
    title: 'Computer Vision',
    description: 'Visión por computadora con OpenCV y CNN',
    price: 0,
    duration: '10 semanas',
    level: 'Intermedio',
    image: '/images/course-7.jpg',
    category: 'Computer Vision',
    source: 'YouTube - OpenCV Official'
  },
  {
    id: '8',
    title: 'TensorFlow 2.0 Tutorial',
    description: 'Aprende TensorFlow 2.0 desde cero',
    price: 0,
    duration: '4.5 horas',
    level: 'Intermedio',
    image: '/images/course-8.jpg',
    category: 'Deep Learning',
    source: 'YouTube - freeCodeCamp'
  },
  {
    id: '9',
    title: 'Scikit-learn Machine Learning',
    description: 'Master scikit-learn para machine learning',
    price: 0,
    duration: '3.5 horas',
    level: 'Principiante',
    image: '/images/course-9.jpg',
    category: 'Machine Learning',
    source: 'YouTube - Keith Galli'
  },
  {
    id: '10',
    title: 'Pandas Tutorial for Beginners',
    description: 'Manipulación y análisis de datos con pandas',
    price: 0,
    duration: '2.5 horas',
    level: 'Principiante',
    image: '/images/course-10.jpg',
    category: 'Data Science',
    source: 'YouTube - Alex The Analyst'
  },
  {
    id: '11',
    title: 'NumPy Tutorial for Beginners',
    description: 'Computación numérica eficiente con NumPy',
    price: 0,
    duration: '2 horas',
    level: 'Principiante',
    image: '/images/course-11.jpg',
    category: 'Data Science',
    source: 'YouTube - Programming with Mosh'
  },
  {
    id: '12',
    title: 'OpenCV Python Tutorial',
    description: 'Procesamiento de imágenes y visión por computadora',
    price: 0,
    duration: '3 horas',
    level: 'Intermedio',
    image: '/images/course-12.jpg',
    category: 'Computer Vision',
    source: 'YouTube - Pysource'
  },
  {
    id: '13',
    title: 'SQL for Data Science',
    description: 'Consultas SQL para análisis de datos',
    price: 0,
    duration: '3.5 horas',
    level: 'Principiante',
    image: '/images/course-13.jpg',
    category: 'Data Science',
    source: 'YouTube - Alex The Analyst'
  },
  {
    id: '14',
    title: 'Git and GitHub for Beginners',
    description: 'Control de versiones con Git y colaboración',
    price: 0,
    duration: '2.5 horas',
    level: 'Principiante',
    image: '/images/course-14.jpg',
    category: 'Desarrollo Web',
    source: 'YouTube - freeCodeCamp'
  },
  {
    id: '15',
    title: 'Docker for Data Science',
    description: 'Contenedores Docker para proyectos de ciencia de datos',
    price: 0,
    duration: '2 horas',
    level: 'Intermedio',
    image: '/images/course-15.jpg',
    category: 'DevOps',
    source: 'YouTube - Tech With Tim'
  },
  {
    id: '16',
    title: 'Big Data & Apache Spark',
    description: 'Procesamiento de big data con Apache Spark',
    price: 0,
    duration: '12 semanas',
    level: 'Intermedio',
    image: '/images/course-16.jpg',
    category: 'Big Data',
    source: 'YouTube - Sundog Education'
  },
  {
    id: '17',
    title: 'Reinforcement Learning',
    description: 'Aprendizaje por refuerzo con Q-learning',
    price: 0,
    duration: '10 semanas',
    level: 'Avanzado',
    image: '/images/course-17.jpg',
    category: 'Machine Learning',
    source: 'YouTube - DeepMind'
  },
  {
    id: '18',
    title: 'Time Series Analysis',
    description: 'Análisis de series temporales y forecasting',
    price: 0,
    duration: '8 semanas',
    level: 'Intermedio',
    image: '/images/course-18.jpg',
    category: 'Data Science',
    source: 'YouTube - Ritchie Ng'
  },
  {
    id: '19',
    title: 'AI for Healthcare',
    description: 'Aplicaciones de IA en medicina',
    price: 0,
    duration: '12 semanas',
    level: 'Intermedio',
    image: '/images/course-19.jpg',
    category: 'AI Applications',
    source: 'YouTube - Stanford Medicine'
  },
  {
    id: '20',
    title: 'Generative AI & GANs',
    description: 'Redes generativas adversarias',
    price: 0,
    duration: '10 semanas',
    level: 'Avanzado',
    image: '/images/course-20.jpg',
    category: 'Deep Learning',
    source: 'YouTube - MIT CSAIL'
  }
]

export const coursesRouter = router({
  // Obtener todos los cursos
  getAll: publicProcedure.query(() => {
    return courses
  }),

  // Obtener curso por ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const course = courses.find(c => c.id === input.id)
      if (!course) throw new Error('Curso no encontrado')
      return course
    }),

  // Crear nuevo curso
  create: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      price: z.number().min(0),
      duration: z.string(),
      level: z.string(),
      category: z.string(),
      source: z.string().optional()
    }))
    .mutation(({ input }) => {
      const newCourse = {
        id: Date.now().toString(),
        ...input,
        image: '/images/default-course.jpg'
      }
      courses.push(newCourse)
      return newCourse
    }),

  // Actualizar curso
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      price: z.number().min(0).optional(),
      duration: z.string().optional(),
      level: z.string().optional(),
      category: z.string().optional(),
      source: z.string().optional()
    }))
    .mutation(({ input }) => {
      const index = courses.findIndex(c => c.id === input.id)
      if (index === -1) throw new Error('Curso no encontrado')
      
      courses[index] = { ...courses[index], ...input }
      return courses[index]
    }),

  // Eliminar curso
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const index = courses.findIndex(c => c.id === input.id)
      if (index === -1) throw new Error('Curso no encontrado')
      
      const deletedCourse = courses[index]
      courses = courses.filter(c => c.id !== input.id)
      return deletedCourse
    }),

  // Buscar cursos por categoría
  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(({ input }) => {
      return courses.filter(c => 
        c.category.toLowerCase().includes(input.category.toLowerCase())
      )
    }),

  // Obtener estadísticas de cursos
  getStats: publicProcedure.query(() => {
    return {
      total: courses.length,
      categories: [...new Set(courses.map(c => c.category))],
      averagePrice: courses.reduce((sum, c) => sum + c.price, 0) / courses.length,
      levels: [...new Set(courses.map(c => c.level))]
    }
  })
}) 