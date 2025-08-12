import { NextRequest, NextResponse } from 'next/server';
import { CourseCategory, Difficulty } from '@prisma/client';

// Interfaz para los datos del preview (misma estructura que CourseFormData pero sin validaciones estrictas)
interface PreviewData {
  // Información Básica
  title?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  imageUrl?: string;
  mainVideoUrl?: string;
  price?: number;
  category?: CourseCategory;
  difficulty?: Difficulty;
  durationHours?: number;
  language?: string;
  
  // Instructor
  instructor?: {
    name?: string;
    title?: string;
    image?: string;
    bio?: string;
  };
  
  // Objetivos y Contenido
  whatYouWillLearn?: string[];
  tools?: string[];
  prerequisites?: string[];
  
  // Módulos y Lecciones  
  modules?: {
    title?: string;
    description?: string;
    lessons?: {
      title?: string;
      description?: string;
      content?: string;
      videoUrl?: string;
      duration?: number;
      type?: string;
      order?: number;
    }[];
  }[];
  
  // Reviews/Testimonios
  testimonials?: {
    name?: string;
    text?: string;
  }[];
}

// Función para generar datos por defecto para campos vacíos
function fillDefaultData(data: PreviewData): any {
  const defaultData = {
    // Información básica con fallbacks
    title: data.title || 'Título del Curso',
    slug: data.slug || 'titulo-del-curso',
    description: data.description || 'Descripción detallada del curso. Aquí se explicará todo lo que el estudiante aprenderá y cómo este curso transformará sus habilidades profesionales.',
    shortDescription: data.shortDescription || 'Descripción corta que aparece en el hero section del curso.',
    imageUrl: data.imageUrl || '/images/courses/default-course.jpg',
    mainVideoUrl: data.mainVideoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    price: data.price ?? 97,
    category: data.category || 'HABILIDADES_IRREMPLAZABLES',
    difficulty: data.difficulty || 'BEGINNER',
    durationHours: data.durationHours || 8,
    language: data.language || 'Español',
    lessonsCount: 0, // Se calculará después
    studentsCount: 1000, // Valor por defecto para preview
    rating: 4.8, // Valor por defecto para preview
    
    // Instructor con fallbacks
    instructor: {
      name: data.instructor?.name || 'Instructor del Curso',
      title: data.instructor?.title || 'Especialista en la materia',
      image: data.instructor?.image || '/images/default-instructor.jpg',
      bio: data.instructor?.bio || 'Experto en el área con años de experiencia práctica y educativa.'
    },
    
    // Objetivos con ejemplos por defecto
    whatYouWillLearn: data.whatYouWillLearn?.length ? data.whatYouWillLearn : [
      'Dominar los conceptos fundamentales del tema',
      'Aplicar técnicas avanzadas en proyectos reales',
      'Desarrollar habilidades prácticas profesionales',
      'Crear tu propia metodología de trabajo',
      'Optimizar procesos y resultados',
      'Generar ingresos con las habilidades aprendidas'
    ],
    
    // Herramientas con ejemplos
    tools: data.tools?.length ? data.tools : [
      'Herramienta Principal',
      'Software Especializado'
    ],
    
    // Prerrequisitos con ejemplos
    prerequisites: data.prerequisites?.length ? data.prerequisites : [
      'No se requieren conocimientos previos',
      'Computadora con acceso a internet',
      'Ganas de aprender y aplicar los conocimientos'
    ],
    
    // Testimonios con ejemplos por defecto
    testimonials: data.testimonials?.length ? data.testimonials : [
      {
        name: 'María G.',
        text: 'Este curso cambió completamente mi perspectiva. Los resultados fueron inmediatos y aplicables.'
      },
      {
        name: 'Carlos R.',
        text: 'Excelente contenido y metodología. Lo recomiendo 100% para cualquiera que quiera aprender.'
      },
      {
        name: 'Ana L.',
        text: 'Paso a paso muy claro y con ejemplos prácticos. Ya estoy aplicando lo aprendido.'
      },
      {
        name: 'Diego M.',
        text: 'La mejor inversión que he hecho en educación online. Contenido de primera calidad.'
      },
      {
        name: 'Laura S.',
        text: 'Superó mis expectativas. El instructor explica de manera muy clara y directa.'
      },
      {
        name: 'Roberto T.',
        text: 'Resultados reales desde la primera semana. Definitivamente vale la pena.'
      }
    ]
  };
  
  // Procesar módulos y lecciones
  let totalLessons = 0;
  const processedModules = data.modules?.length ? data.modules.map((module, moduleIndex) => {
    const moduleData = {
      id: moduleIndex + 1,
      title: module.title || `Módulo ${moduleIndex + 1}: Tema Principal`,
      description: module.description || 'Descripción del módulo con los objetivos y contenido que se cubrirá.',
      duration: 0, // Se calculará
      type: 'Video',
      lessonsCount: 0, // Se calculará
      lessons: [] as any[]
    };
    
    // Procesar lecciones del módulo
    const lessons = module.lessons?.length ? module.lessons : [
      {
        title: `${moduleIndex + 1}.1 Introducción al tema`,
        description: 'Descripción de la primera lección del módulo',
        content: '<h2>Contenido de la lección</h2><p>Aquí va el contenido detallado de la lección...</p>',
        duration: 25,
        type: 'video'
      }
    ];
    
    moduleData.lessons = lessons.map((lesson, lessonIndex) => {
      totalLessons++;
      return {
        id: `module-${moduleIndex + 1}-lesson-${lessonIndex + 1}`,
        moduleId: moduleIndex + 1,
        title: lesson.title || `${moduleIndex + 1}.${lessonIndex + 1} Lección ${lessonIndex + 1}`,
        duration: `${lesson.duration || 25} min`,
        type: lesson.type || 'video',
        description: lesson.description || 'Descripción de la lección con los objetivos específicos.',
        videoUrl: lesson.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        content: lesson.content || '<h2>Contenido de la lección</h2><p>Aquí se desarrollará el contenido completo de la lección con ejemplos prácticos y ejercicios.</p>'
      };
    });
    
    // Calcular duración del módulo
    moduleData.duration = lessons.reduce((total, lesson) => total + (lesson.duration || 25), 0);
    moduleData.lessonsCount = lessons.length;
    
    return moduleData;
  }) : [
    {
      id: 1,
      title: 'Módulo 1: Fundamentos',
      description: 'Establecer las bases sólidas del conocimiento que desarrollaremos a lo largo del curso.',
      duration: 75,
      type: 'Video',
      lessonsCount: 3,
      lessons: [
        {
          id: 'module-1-lesson-1',
          moduleId: 1,
          title: '1.1 Introducción y objetivos',
          duration: '25 min',
          type: 'video',
          description: 'Conoce los objetivos del curso y la metodología que utilizaremos.',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          content: '<h2>Bienvenido al curso</h2><p>En esta primera lección estableceremos las bases y objetivos...</p>'
        },
        {
          id: 'module-1-lesson-2',
          moduleId: 1,
          title: '1.2 Conceptos fundamentales',
          duration: '30 min',
          type: 'video',
          description: 'Revisión de los conceptos clave que necesitas dominar.',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          content: '<h2>Conceptos fundamentales</h2><p>Aquí cubriremos todos los conceptos básicos...</p>'
        },
        {
          id: 'module-1-lesson-3',
          moduleId: 1,
          title: '1.3 Primeros pasos prácticos',
          duration: '20 min',
          type: 'video',
          description: 'Ejercicios prácticos para comenzar a aplicar lo aprendido.',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          content: '<h2>Práctica inicial</h2><p>Vamos a poner en práctica los conceptos aprendidos...</p>'
        }
      ]
    }
  ];
  
  // Calcular total de lecciones si no se calculó antes
  if (totalLessons === 0) {
    totalLessons = processedModules.reduce((total, module) => total + module.lessonsCount, 0);
  }
  
  defaultData.lessonsCount = totalLessons;
  
  return {
    ...defaultData,
    lessons: processedModules
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Generando preview del curso...');
    
    const data: PreviewData = await request.json();
    
    console.log('📝 Datos para preview:', {
      title: data.title,
      modulesCount: data.modules?.length || 0,
      hasInstructor: !!data.instructor?.name
    });
    
    // Generar datos completos para el preview
    const previewData = fillDefaultData(data);
    
    console.log('✅ Preview generado:', {
      title: previewData.title,
      lessonsCount: previewData.lessonsCount,
      modulesCount: previewData.lessons.length
    });
    
    // Respuesta con datos estructurados para renderizar el preview
    return NextResponse.json({
      success: true,
      preview: previewData,
      metadata: {
        generatedAt: new Date().toISOString(),
        totalDuration: previewData.lessons.reduce((total: number, module: any) => total + module.duration, 0),
        completionLevel: calculateCompletionLevel(data),
        warnings: generateWarnings(data)
      }
    });
    
  } catch (error) {
    console.error('❌ Error generando preview:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Función para calcular el nivel de completitud del formulario
function calculateCompletionLevel(data: PreviewData): number {
  const fields = [
    data.title,
    data.description,
    data.shortDescription,
    data.instructor?.name,
    data.instructor?.bio,
    data.whatYouWillLearn?.length,
    data.tools?.length,
    data.prerequisites?.length,
    data.modules?.length
  ];
  
  const filledFields = fields.filter(field => 
    field !== undefined && field !== null && field !== '' && 
    (typeof field === 'number' ? field > 0 : true)
  ).length;
  
  return Math.round((filledFields / fields.length) * 100);
}

// Función para generar advertencias sobre campos faltantes
function generateWarnings(data: PreviewData): string[] {
  const warnings: string[] = [];
  
  if (!data.title) warnings.push('Falta título del curso');
  if (!data.description || data.description.length < 50) warnings.push('Descripción muy corta o faltante');
  if (!data.instructor?.name) warnings.push('Falta información del instructor');
  if (!data.whatYouWillLearn?.length || data.whatYouWillLearn.length < 6) warnings.push('Faltan objetivos de aprendizaje (mínimo 6)');
  if (!data.modules?.length) warnings.push('No hay módulos definidos');
  if (data.modules?.some(module => !module.lessons?.length)) warnings.push('Algunos módulos no tienen lecciones');
  
  return warnings;
}