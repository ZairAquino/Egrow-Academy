import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const courses = [
  {
    id: 'monetiza-ia',
    title: 'Monetiza con la IA',
    slug: 'monetiza-ia',
    description: 'Descubre cómo generar ingresos utilizando inteligencia artificial. Aprende estrategias prácticas para monetizar herramientas de IA y crear fuentes de ingresos pasivos.',
    shortDescription: 'Aprende a monetizar herramientas de IA y crear fuentes de ingresos pasivos',
    imageUrl: '/images/optimized/v-5.webp',
    price: 0,
    isFree: true,
    requiresAuth: false,
    difficulty: 'INTERMEDIATE',
    durationHours: 3,
    lessonsCount: 5,
    studentsCount: 0,
    rating: 0,
    status: 'PUBLISHED'
  },
  {
    id: 'introduccion-llms',
    title: 'Introducción a Large Language Models (LLMs)',
    slug: 'introduccion-llms',
    description: 'Aprende los fundamentos de los modelos de lenguaje grandes, desde GPT hasta Claude, y cómo implementarlos en aplicaciones reales.',
    shortDescription: 'Fundamentos de LLMs desde GPT hasta Claude',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
    price: 0,
    isFree: true,
    requiresAuth: false,
    difficulty: 'BEGINNER',
    durationHours: 2,
    lessonsCount: 4,
    studentsCount: 0,
    rating: 0,
    status: 'PUBLISHED'
  },
  {
    id: 'fundamentos-ml',
    title: 'Fundamentos de Machine Learning',
    slug: 'fundamentos-ml',
    description: 'Aprende los conceptos básicos de Machine Learning, desde algoritmos supervisados hasta no supervisados, y cómo implementarlos en Python.',
    shortDescription: 'Conceptos básicos de Machine Learning con Python',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop&crop=center',
    price: 0,
    isFree: true,
    requiresAuth: false,
    difficulty: 'BEGINNER',
    durationHours: 2.5,
    lessonsCount: 6,
    studentsCount: 0,
    rating: 0,
    status: 'PUBLISHED'
  },
  {
    id: 'computer-vision',
    title: 'Computer Vision con Python',
    slug: 'computer-vision',
    description: 'Aprende a procesar y analizar imágenes usando OpenCV, detectar objetos, reconocer rostros y crear aplicaciones de visión por computadora.',
    shortDescription: 'Procesamiento de imágenes con OpenCV y Python',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center',
    price: 0,
    isFree: true,
    requiresAuth: false,
    difficulty: 'INTERMEDIATE',
    durationHours: 3,
    lessonsCount: 7,
    studentsCount: 0,
    rating: 0,
    status: 'PUBLISHED'
  },
  {
    id: 'desarrollo-web-fullstack',
    title: 'Desarrollo Web Full Stack con React y Node.js',
    slug: 'desarrollo-web-fullstack',
    description: 'Aprende a crear aplicaciones web completas desde cero. Domina React, Node.js, Express, MongoDB y despliegue en la nube.',
    shortDescription: 'Desarrollo web completo con React, Node.js y MongoDB',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&crop=center',
    price: 99.99,
    isFree: false,
    requiresAuth: true,
    difficulty: 'INTERMEDIATE',
    durationHours: 25,
    lessonsCount: 15,
    studentsCount: 0,
    rating: 0,
    status: 'PUBLISHED'
  }
];

async function seedCourses() {
  console.log('🌱 Iniciando seed de cursos...');

  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    for (const courseData of courses) {
      // Verificar si el curso ya existe
      const existingCourse = await prisma.course.findUnique({
        where: { slug: courseData.slug }
      });

      if (existingCourse) {
        console.log(`⏭️ Curso "${courseData.title}" ya existe, saltando...`);
        continue;
      }

      // Crear el curso
      const course = await prisma.course.create({
        data: {
          id: courseData.id,
          title: courseData.title,
          slug: courseData.slug,
          description: courseData.description,
          shortDescription: courseData.shortDescription,
          imageUrl: courseData.imageUrl,
          price: courseData.price,
          isFree: courseData.isFree,
          requiresAuth: courseData.requiresAuth,
          difficulty: courseData.difficulty as any,
          durationHours: courseData.durationHours,
          lessonsCount: courseData.lessonsCount,
          studentsCount: courseData.studentsCount,
          rating: courseData.rating,
          status: courseData.status as any
        }
      });

      console.log(`✅ Curso creado: "${course.title}" (ID: ${course.id})`);

      // Crear lecciones básicas para cada curso
      const lessonTitles = [
        'Introducción al curso',
        'Conceptos fundamentales',
        'Implementación práctica',
        'Proyecto final',
        'Conclusiones y próximos pasos'
      ];

      for (let i = 0; i < Math.min(lessonTitles.length, courseData.lessonsCount); i++) {
        await prisma.lesson.create({
          data: {
            title: lessonTitles[i],
            content: `Contenido de la lección ${i + 1} del curso ${course.title}`,
            order: i + 1,
            courseId: course.id
          }
        });
      }

      console.log(`📚 ${Math.min(lessonTitles.length, courseData.lessonsCount)} lecciones creadas para "${course.title}"`);
    }

    console.log('\n🎉 Seed de cursos completado exitosamente!');
    
    // Mostrar resumen
    const totalCourses = await prisma.course.count();
    const totalLessons = await prisma.lesson.count();
    
    console.log(`\n📊 Resumen:`);
    console.log(`- Cursos totales: ${totalCourses}`);
    console.log(`- Lecciones totales: ${totalLessons}`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed si se llama directamente
if (require.main === module) {
  seedCourses()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { seedCourses }; 