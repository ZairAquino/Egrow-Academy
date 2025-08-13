import { CourseFormData, ModuleFormData, LessonFormData } from '@/types/course-admin';

export interface CourseTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  estimatedDuration: number;
  data: Partial<CourseFormData>;
}

export const COURSE_TEMPLATES: CourseTemplate[] = [
  {
    id: 'ai-fundamentals',
    name: 'Fundamentos de IA',
    description: 'Plantilla para cursos de introducción a la inteligencia artificial',
    category: 'HABILIDADES_IRREMPLAZABLES',
    icon: '🤖',
    estimatedDuration: 8,
    data: {
      category: 'HABILIDADES_IRREMPLAZABLES',
      difficulty: 'BEGINNER',
      durationHours: 8,
      language: 'Español',
      price: 97,
      whatYouWillLearn: [
        'Comprender los conceptos fundamentales de la inteligencia artificial',
        'Identificar aplicaciones prácticas de IA en diferentes industrias',
        'Dominar las herramientas básicas de IA más utilizadas',
        'Crear tu primer proyecto práctico con IA',
        'Desarrollar una estrategia de implementación de IA',
        'Evaluar el ROI y beneficios de proyectos de IA'
      ],
      tools: [
        'ChatGPT',
        'Claude',
        'Gemini',
        'Herramientas de automatización'
      ],
      prerequisites: [
        'Conocimientos básicos de computación',
        'Curiosidad por la tecnología',
        'Acceso a internet estable',
        'Computadora o dispositivo móvil'
      ],
      modules: [
        {
          title: 'MÓDULO 1: Introducción a la IA',
          description: 'Conceptos fundamentales y panorama actual de la inteligencia artificial.',
          lessons: [
            {
              title: '¿Qué es la inteligencia artificial?',
              description: 'Definición, historia y tipos de IA.',
              content: '# Introducción a la IA\n\nLa inteligencia artificial es...',
              duration: 25,
              type: 'Video',
              order: 1
            },
            {
              title: 'IA vs Machine Learning vs Deep Learning',
              description: 'Diferencias y relaciones entre conceptos clave.',
              content: '# Diferencias clave\n\nEs importante entender...',
              duration: 30,
              type: 'Video',
              order: 2
            },
            {
              title: 'Aplicaciones prácticas de IA',
              description: 'Casos de uso reales en diferentes industrias.',
              content: '# Aplicaciones en el mundo real\n\nLa IA se utiliza en...',
              duration: 35,
              type: 'Video',
              order: 3
            }
          ]
        },
        {
          title: 'MÓDULO 2: Herramientas de IA',
          description: 'Exploración hands-on de las principales herramientas de IA.',
          lessons: [
            {
              title: 'ChatGPT: Prompting efectivo',
              description: 'Técnicas para obtener los mejores resultados.',
              content: '# Dominando ChatGPT\n\nLos prompts efectivos...',
              duration: 40,
              type: 'Lab',
              order: 1
            },
            {
              title: 'Automatización con IA',
              description: 'Crear flujos de trabajo automatizados.',
              content: '# Automatización inteligente\n\nLa automatización...',
              duration: 45,
              type: 'Project',
              order: 2
            }
          ]
        },
        {
          title: 'MÓDULO 3: Proyecto Final',
          description: 'Aplica todo lo aprendido en un proyecto real.',
          lessons: [
            {
              title: 'Definición del proyecto',
              description: 'Planifica tu proyecto de IA.',
              content: '# Tu proyecto de IA\n\nElige un problema real...',
              duration: 30,
              type: 'Project',
              order: 1
            },
            {
              title: 'Implementación y resultados',
              description: 'Ejecuta y evalúa tu proyecto.',
              content: '# Implementación\n\nPone en práctica...',
              duration: 50,
              type: 'Project',
              order: 2
            }
          ]
        }
      ],
      testimonials: [
        {
          name: 'Ana García',
          text: 'Este curso me abrió las puertas al mundo de la IA. Ahora uso estas herramientas en mi trabajo diario.'
        },
        {
          name: 'Carlos Mendoza',
          text: 'Excelente introducción a la IA. Los proyectos prácticos realmente ayudan a consolidar el aprendizaje.'
        }
      ]
    }
  },
  {
    id: 'content-creation',
    name: 'Creación de Contenido Digital',
    description: 'Plantilla para cursos de marketing digital y creación de contenido',
    category: 'MARKETING_DIGITAL',
    icon: '📱',
    estimatedDuration: 10,
    data: {
      category: 'MARKETING_DIGITAL',
      difficulty: 'INTERMEDIATE',
      durationHours: 10,
      language: 'Español',
      price: 127,
      whatYouWillLearn: [
        'Crear contenido viral y atractivo para redes sociales',
        'Dominar herramientas de diseño y edición profesional',
        'Desarrollar una estrategia de contenido coherente',
        'Analizar métricas y optimizar el rendimiento',
        'Monetizar tu contenido de forma efectiva',
        'Construir una audiencia fiel y comprometida'
      ],
      tools: [
        'Canva',
        'Figma',
        'CapCut',
        'Photoshop',
        'Analytics',
        'Herramientas de programación'
      ],
      prerequisites: [
        'Conocimientos básicos de redes sociales',
        'Creatividad y ganas de aprender',
        'Computadora con acceso a internet',
        'Smartphone para contenido móvil'
      ]
    }
  },
  {
    id: 'programming-basics',
    name: 'Programación desde Cero',
    description: 'Plantilla para cursos de introducción a la programación',
    category: 'PROGRAMACION',
    icon: '💻',
    estimatedDuration: 15,
    data: {
      category: 'PROGRAMACION',
      difficulty: 'BEGINNER',
      durationHours: 15,
      language: 'Español',
      price: 197,
      whatYouWillLearn: [
        'Dominar los fundamentos de la programación',
        'Escribir código limpio y eficiente',
        'Resolver problemas con lógica de programación',
        'Crear aplicaciones web funcionales',
        'Trabajar con bases de datos',
        'Implementar buenas prácticas de desarrollo'
      ],
      tools: [
        'JavaScript',
        'HTML/CSS',
        'Visual Studio Code',
        'Git/GitHub',
        'Node.js',
        'React'
      ],
      prerequisites: [
        'Conocimientos básicos de computación',
        'Lógica matemática básica',
        'Computadora con al menos 8GB RAM',
        'Muchas ganas de programar'
      ]
    }
  },
  {
    id: 'business-strategy',
    name: 'Estrategia de Negocios',
    description: 'Plantilla para cursos de emprendimiento y estrategia empresarial',
    category: 'NEGOCIOS',
    icon: '📈',
    estimatedDuration: 12,
    data: {
      category: 'NEGOCIOS',
      difficulty: 'INTERMEDIATE',
      durationHours: 12,
      language: 'Español',
      price: 247,
      whatYouWillLearn: [
        'Desarrollar estrategias de negocio ganadoras',
        'Analizar mercados y competencia efectivamente',
        'Crear modelos de negocio innovadores',
        'Gestionar equipos de alto rendimiento',
        'Optimizar operaciones y procesos',
        'Escalar negocios de forma sostenible'
      ],
      tools: [
        'Business Model Canvas',
        'Excel/Google Sheets',
        'Herramientas de análisis',
        'CRM',
        'Software de gestión',
        'Analytics empresariales'
      ],
      prerequisites: [
        'Experiencia básica en negocios',
        'Conocimientos de administración',
        'Computadora con software de oficina',
        'Mentalidad emprendedora'
      ]
    }
  }
];

export function getTemplateById(id: string): CourseTemplate | null {
  return COURSE_TEMPLATES.find(template => template.id === id) || null;
}

export function getTemplatesByCategory(category: string): CourseTemplate[] {
  return COURSE_TEMPLATES.filter(template => template.data.category === category);
}

export function searchTemplates(query: string): CourseTemplate[] {
  const lowercaseQuery = query.toLowerCase();
  return COURSE_TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.category.toLowerCase().includes(lowercaseQuery)
  );
}

// Función para aplicar template a formulario
export function applyTemplate(template: CourseTemplate, currentData?: Partial<CourseFormData>): Partial<CourseFormData> {
  return {
    ...currentData,
    ...template.data,
    // Preservar algunos campos si ya existen
    title: currentData?.title || '',
    slug: currentData?.slug || '',
    description: currentData?.description || '',
    shortDescription: currentData?.shortDescription || '',
    imageUrl: currentData?.imageUrl || '',
    mainVideoUrl: currentData?.mainVideoUrl || ''
  };
}

// Generar estructura de lecciones predeterminada
export function generateDefaultLessons(moduleCount: number = 3, lessonsPerModule: number = 3): ModuleFormData[] {
  const modules: ModuleFormData[] = [];
  
  for (let i = 1; i <= moduleCount; i++) {
    const lessons: LessonFormData[] = [];
    
    for (let j = 1; j <= lessonsPerModule; j++) {
      lessons.push({
        title: `${i}.${j} Lección ${j} del Módulo ${i}`,
        description: `Descripción de la lección ${i}.${j}`,
        content: `# Lección ${i}.${j}\n\nContenido de la lección...`,
        videoUrl: '',
        duration: 25 + (j * 5), // Duración variable
        type: j === lessonsPerModule ? 'Project' : 'Video',
        order: j
      });
    }
    
    modules.push({
      title: `MÓDULO ${i}: Título del Módulo ${i}`,
      description: `Descripción del módulo ${i}`,
      lessons
    });
  }
  
  return modules;
}