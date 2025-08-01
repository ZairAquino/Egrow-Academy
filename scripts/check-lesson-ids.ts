import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLessonIds() {
  console.log('🔍 Verificando IDs de lecciones en la base de datos...');

  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Buscar el curso en la base de datos
    const course = await prisma.course.findUnique({
      where: { slug: 'asistentes-virtuales-ia' }
    });

    if (!course) {
      console.log('❌ Curso no encontrado');
      return;
    }

    console.log(`📋 Curso encontrado: "${course.title}"`);

    // Obtener todas las lecciones del curso
    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        order: true
      }
    });

    console.log(`📚 Lecciones encontradas: ${lessons.length}`);
    console.log('\n📝 Detalles de las lecciones:');
    
    lessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ID: ${lesson.id} | Order: ${lesson.order} | Título: ${lesson.title}`);
    });

    // Verificar si hay problemas con los IDs
    const expectedIds = [1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6];
    
    console.log('\n🔍 Verificando coincidencia de IDs:');
    lessons.forEach((lesson, index) => {
      const expectedId = expectedIds[index];
      const matches = lesson.id === expectedId;
      console.log(`Lección ${index + 1}: ID en BD (${lesson.id}) vs Esperado (${expectedId}) - ${matches ? '✅' : '❌'}`);
    });

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  checkLessonIds()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { checkLessonIds }; 