import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const lessons = [
  // MÓDULO 1
  { id: 1.1, title: '1.1 Introducción a los Asistentes Virtuales con IA', order: 1 },
  { id: 1.2, title: '1.2 Beneficios Empresariales Clave', order: 2 },
  { id: 1.3, title: '1.3 Casos de Uso Empresariales', order: 3 },
  { id: 1.4, title: '1.4 Planificación Estratégica', order: 4 },
  
  // MÓDULO 2
  { id: 2.1, title: '2.1 Preparación de Documentación Empresarial', order: 5 },
  { id: 2.2, title: '2.2 Configuración de Procesos', order: 6 },
  { id: 2.3, title: '2.3 Establecimiento de Metodologías', order: 7 },
  
  // MÓDULO 3
  { id: 3.1, title: '3.1 Introducción a Google Gemini', order: 8 },
  { id: 3.2, title: '3.2 Configuración de Gemini', order: 9 },
  { id: 3.3, title: '3.3 Creación de Asistente con Gemini', order: 10 },
  { id: 3.4, title: '3.4 Optimización de Prompts', order: 11 },
  
  // MÓDULO 4
  { id: 4.1, title: '4.1 Introducción a ChatGPT', order: 12 },
  { id: 4.2, title: '4.2 Configuración de ChatGPT', order: 13 },
  { id: 4.3, title: '4.3 Creación de Asistente con ChatGPT', order: 14 },
  { id: 4.4, title: '4.4 GPTs Personalizados', order: 15 },
  
  // MÓDULO 5
  { id: 5.1, title: '5.1 Optimización de Rendimiento', order: 16 },
  { id: 5.2, title: '5.2 Pruebas y Validación', order: 17 },
  { id: 5.3, title: '5.3 Mantenimiento Continuo', order: 18 },
  { id: 5.4, title: '5.4 Escalabilidad y Mejoras', order: 19 },
  { id: 5.5, title: '5.5 Monitoreo y Analytics', order: 20 },
  { id: 5.6, title: '5.6 Conclusiones y Próximos Pasos', order: 21 }
];

async function createAsistentesLessons() {
  console.log('🔧 Creando lecciones para el curso "Asistentes virtuales con IA"...');

  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Buscar el curso en la base de datos
    const course = await prisma.course.findUnique({
      where: { slug: 'asistentes-virtuales-ia' }
    });

    if (!course) {
      console.log('❌ Curso no encontrado. Ejecuta primero update-asistentes-course.ts');
      return;
    }

    console.log(`📋 Curso encontrado: "${course.title}"`);

    // Eliminar lecciones existentes
    await prisma.lesson.deleteMany({
      where: { courseId: course.id }
    });
    console.log('🗑️ Lecciones existentes eliminadas');

    // Crear las 21 lecciones
    for (const lessonData of lessons) {
      await prisma.lesson.create({
        data: {
          title: lessonData.title,
          content: `Contenido de la lección ${lessonData.id}: ${lessonData.title}`,
          order: lessonData.order,
          courseId: course.id
        }
      });
      console.log(`✅ Lección creada: ${lessonData.title}`);
    }

    // Verificar que se crearon todas las lecciones
    const createdLessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' }
    });

    console.log(`\n📊 Resumen:`);
    console.log(`- Lecciones creadas: ${createdLessons.length}`);
    console.log(`- Primera lección: ${createdLessons[0]?.title}`);
    console.log(`- Última lección: ${createdLessons[createdLessons.length - 1]?.title}`);

    console.log('\n🎉 Lecciones creadas exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la creación:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  createAsistentesLessons()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { createAsistentesLessons }; 