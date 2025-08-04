import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const vibeCodingLessons = [
  // MÓDULO 1 - Fundamentos del Vibe Coding
  {
    id: 'vcc-mod1-les1',
    title: '1.1 Introducción al Vibe Coding con IA',
    order: 1,
    duration: 15,
    videoUrl: 'https://www.youtube.com/watch?v=example1-1',
    content: 'Descubre el nuevo paradigma de programación asistida por IA y cómo transformará tu forma de codificar'
  },
  {
    id: 'vcc-mod1-les2',
    title: '1.2 Configuración del Entorno de Desarrollo',
    order: 2,
    duration: 20,
    videoUrl: 'https://www.youtube.com/watch?v=example1-2',
    content: 'Prepara tu máquina con todas las herramientas necesarias para comenzar tu viaje en el Vibe Coding'
  },
  {
    id: 'vcc-mod1-les3',
    title: '1.3 Principios del Desarrollo Asistido por IA',
    order: 3,
    duration: 18,
    videoUrl: 'https://www.youtube.com/watch?v=example1-3',
    content: 'Comprende los fundamentos y mejores prácticas para trabajar eficientemente con asistentes de IA'
  },
  {
    id: 'vcc-mod1-les4',
    title: '1.4 Tu Primera Sesión de Vibe Coding',
    order: 4,
    duration: 25,
    videoUrl: 'https://www.youtube.com/watch?v=example1-4',
    content: 'Experimenta tu primera sesión práctica creando una aplicación simple con asistencia de IA'
  },
  
  // MÓDULO 2 - Maestría en Claude Code
  {
    id: 'vcc-mod2-les1',
    title: '2.1 Dominio Avanzado de Claude Code',
    order: 5,
    duration: 22,
    videoUrl: 'https://www.youtube.com/watch?v=example2-1',
    content: 'Explora las capacidades avanzadas de Claude Code para proyectos complejos'
  },
  {
    id: 'vcc-mod2-les2',
    title: '2.2 Proyecto Final Integrado',
    order: 6,
    duration: 45,
    videoUrl: 'https://www.youtube.com/watch?v=example2-2',
    content: 'Construye una aplicación completa aplicando todo lo aprendido en el curso'
  }
];

async function seedVibeCodingLessons() {
  try {
    console.log('🌱 Iniciando seed de lecciones para Vibe Coding con Claude Code y Cursor...');
    
    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Buscar el curso por slug
    const course = await prisma.course.findUnique({
      where: { slug: 'vibe-coding-claude-cursor' },
      include: { lessons: true }
    });

    if (!course) {
      throw new Error('❌ Curso "vibe-coding-claude-cursor" no encontrado');
    }

    console.log(`✅ Curso encontrado: "${course.title}"`);

    // Eliminar todas las lecciones existentes del curso
    const deleteResult = await prisma.lesson.deleteMany({
      where: { courseId: course.id }
    });

    console.log(`🗑️ ${deleteResult.count} lecciones anteriores eliminadas`);

    // Crear las 6 nuevas lecciones
    for (const lessonData of vibeCodingLessons) {
      const lesson = await prisma.lesson.create({
        data: {
          id: lessonData.id,
          title: lessonData.title,
          content: lessonData.content,
          order: lessonData.order,
          duration: lessonData.duration,
          videoUrl: lessonData.videoUrl,
          courseId: course.id
        }
      });

      console.log(`✅ Lección creada: "${lesson.title}" (Orden: ${lesson.order})`);
    }

    // Actualizar el conteo de lecciones en el curso
    await prisma.course.update({
      where: { id: course.id },
      data: { lessonsCount: vibeCodingLessons.length }
    });

    console.log(`\n🎉 Seed completado exitosamente!`);
    console.log(`📚 ${vibeCodingLessons.length} lecciones creadas para el curso "${course.title}"`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed si se llama directamente
if (require.main === module) {
  seedVibeCodingLessons()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

export default seedVibeCodingLessons;