import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { CourseCategory, Difficulty, CourseStatus } from '@prisma/client';

// Tipo para los datos del formulario de creación de curso
interface CourseFormData {
  // Información Básica
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  mainVideoUrl: string;
  price: number;
  category: CourseCategory;
  difficulty: Difficulty;
  durationHours: number;
  language: string;
  
  // Instructor
  instructor: {
    name: string;
    title: string;
    image: string;
    bio: string;
  };
  
  // Objetivos y Contenido
  whatYouWillLearn: string[];
  tools: string[];
  prerequisites: string[];
  
  // Módulos y Lecciones  
  modules: {
    title: string;
    description: string;
    lessons: {
      title: string;
      description: string;
      content: string;
      videoUrl?: string;
      duration: number;
      type: string;
      order: number;
    }[];
  }[];
  
  // Reviews/Testimonios
  testimonials: {
    name: string;
    text: string;
  }[];
  
  // Configuración
  status: CourseStatus;
}

// Función para generar slug único
async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existingCourse = await prisma.course.findUnique({
      where: { slug }
    });
    
    if (!existingCourse) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// Función para validar URLs
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Función para validar datos del formulario
function validateCourseData(data: CourseFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validaciones básicas
  if (!data.title || data.title.trim().length < 5) {
    errors.push('El título debe tener al menos 5 caracteres');
  }
  
  if (!data.slug || data.slug.trim().length < 3) {
    errors.push('El slug debe tener al menos 3 caracteres');
  }
  
  if (!data.description || data.description.trim().length < 50) {
    errors.push('La descripción debe tener al menos 50 caracteres');
  }
  
  if (!data.shortDescription || data.shortDescription.trim().length < 20) {
    errors.push('La descripción corta debe tener al menos 20 caracteres');
  }
  
  if (data.imageUrl && !isValidUrl(data.imageUrl)) {
    errors.push('La URL de la imagen no es válida');
  }
  
  if (data.mainVideoUrl && !isValidUrl(data.mainVideoUrl)) {
    errors.push('La URL del video principal no es válida');
  }
  
  if (!data.price || data.price < 0) {
    errors.push('El precio debe ser mayor o igual a 0');
  }
  
  if (!data.durationHours || data.durationHours <= 0) {
    errors.push('La duración debe ser mayor a 0 horas');
  }
  
  // Validar instructor
  if (!data.instructor?.name || data.instructor.name.trim().length < 2) {
    errors.push('El nombre del instructor es requerido');
  }
  
  if (!data.instructor?.title || data.instructor.title.trim().length < 5) {
    errors.push('El título del instructor es requerido');
  }
  
  if (!data.instructor?.bio || data.instructor.bio.trim().length < 20) {
    errors.push('La biografía del instructor debe tener al menos 20 caracteres');
  }
  
  // Validar objetivos de aprendizaje
  if (!data.whatYouWillLearn || data.whatYouWillLearn.length < 6) {
    errors.push('Debe incluir al menos 6 objetivos de aprendizaje');
  }
  
  if (data.whatYouWillLearn && data.whatYouWillLearn.length > 12) {
    errors.push('No puede tener más de 12 objetivos de aprendizaje');
  }
  
  // Validar herramientas
  if (!data.tools || data.tools.length < 1) {
    errors.push('Debe incluir al menos 1 herramienta');
  }
  
  // Validar prerrequisitos
  if (!data.prerequisites || data.prerequisites.length < 1) {
    errors.push('Debe incluir al menos 1 prerrequisito');
  }
  
  // Validar módulos
  if (!data.modules || data.modules.length < 1) {
    errors.push('Debe incluir al menos 1 módulo');
  }
  
  if (data.modules) {
    data.modules.forEach((module, moduleIndex) => {
      if (!module.title || module.title.trim().length < 5) {
        errors.push(`El módulo ${moduleIndex + 1} debe tener un título de al menos 5 caracteres`);
      }
      
      if (!module.description || module.description.trim().length < 20) {
        errors.push(`El módulo ${moduleIndex + 1} debe tener una descripción de al menos 20 caracteres`);
      }
      
      if (!module.lessons || module.lessons.length < 1) {
        errors.push(`El módulo ${moduleIndex + 1} debe tener al menos 1 lección`);
      }
      
      if (module.lessons) {
        module.lessons.forEach((lesson, lessonIndex) => {
          if (!lesson.title || lesson.title.trim().length < 5) {
            errors.push(`La lección ${lessonIndex + 1} del módulo ${moduleIndex + 1} debe tener un título de al menos 5 caracteres`);
          }
          
          if (!lesson.content || lesson.content.trim().length < 50) {
            errors.push(`La lección ${lessonIndex + 1} del módulo ${moduleIndex + 1} debe tener contenido de al menos 50 caracteres`);
          }
          
          if (lesson.videoUrl && !isValidUrl(lesson.videoUrl)) {
            errors.push(`La URL del video de la lección ${lessonIndex + 1} del módulo ${moduleIndex + 1} no es válida`);
          }
          
          if (!lesson.duration || lesson.duration <= 0) {
            errors.push(`La lección ${lessonIndex + 1} del módulo ${moduleIndex + 1} debe tener una duración mayor a 0 minutos`);
          }
        });
      }
    });
  }
  
  // Validar testimonios
  if (data.testimonials) {
    data.testimonials.forEach((testimonial, index) => {
      if (!testimonial.name || testimonial.name.trim().length < 2) {
        errors.push(`El testimonio ${index + 1} debe tener un nombre`);
      }
      
      if (!testimonial.text || testimonial.text.trim().length < 10) {
        errors.push(`El testimonio ${index + 1} debe tener un texto de al menos 10 caracteres`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Iniciando creación de curso...');
    
    // Verificar autenticación (comentado por ahora para desarrollo)
    // const session = await getServerSession();
    // if (!session || !session.user) {
    //   return NextResponse.json(
    //     { error: 'No autorizado' },
    //     { status: 401 }
    //   );
    // }
    
    // Obtener datos del cuerpo de la petición
    const data: CourseFormData = await request.json();
    
    console.log('📝 Datos recibidos:', {
      title: data.title,
      slug: data.slug,
      modulesCount: data.modules?.length,
      lessonsCount: data.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0)
    });
    
    // Validar datos
    const validation = validateCourseData(data);
    if (!validation.valid) {
      console.log('❌ Errores de validación:', validation.errors);
      return NextResponse.json(
        { 
          error: 'Datos de validación incorrectos',
          errors: validation.errors 
        },
        { status: 400 }
      );
    }
    
    // Generar slug único
    const uniqueSlug = await generateUniqueSlug(data.slug);
    console.log('🔗 Slug generado:', uniqueSlug);
    
    // Crear curso en la base de datos
    const course = await prisma.course.create({
      data: {
        title: data.title.trim(),
        slug: uniqueSlug,
        description: data.description.trim(),
        shortDescription: data.shortDescription.trim(),
        imageUrl: data.imageUrl || null,
        price: data.price,
        category: data.category,
        difficulty: data.difficulty,
        durationHours: data.durationHours,
        lessonsCount: data.modules.reduce((total, module) => total + module.lessons.length, 0),
        status: data.status,
        // instructorId: session.user.id, // Descomentar cuando tengamos auth
        
        // Crear lecciones relacionadas
        lessons: {
          create: data.modules.flatMap((module, moduleIndex) => 
            module.lessons.map((lesson, lessonIndex) => ({
              title: lesson.title.trim(),
              content: lesson.content,
              videoUrl: lesson.videoUrl || null,
              duration: lesson.duration,
              order: (moduleIndex * 100) + lessonIndex + 1, // Sistema de ordenamiento: 101, 102, 201, 202, etc.
            }))
          )
        }
      },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    console.log('✅ Curso creado exitosamente:', {
      id: course.id,
      title: course.title,
      slug: course.slug,
      lessonsCreated: course.lessons.length
    });
    
    // Respuesta exitosa
    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
        url: `/curso/${course.slug}`,
        lessonsCount: course.lessons.length,
        status: course.status
      },
      message: 'Curso creado exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error creando curso:', error);
    
    // Manejo específico de errores de Prisma
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { 
            error: 'Ya existe un curso con ese slug o título',
            code: 'DUPLICATE_COURSE'
          },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}