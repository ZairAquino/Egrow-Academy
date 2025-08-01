import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCourseNavigation() {
  console.log('🧪 Probando navegación del curso "Asistentes virtuales con IA"...');

  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Buscar el curso en la base de datos
    const course = await prisma.course.findUnique({
      where: { slug: 'asistentes-virtuales-ia' }
    });

    if (course) {
      console.log(`📋 Curso encontrado: "${course.title}"`);
      console.log(`📊 Lecciones en BD: ${course.lessonsCount}`);
      console.log(`📊 Estado: ${course.status}`);
      console.log(`📊 Duración: ${course.durationHours} horas`);
      
      // Verificar que tenga 21 lecciones
      if (course.lessonsCount === 21) {
        console.log('✅ Número de lecciones correcto (21)');
      } else {
        console.log(`❌ Número de lecciones incorrecto: ${course.lessonsCount} (debería ser 21)`);
      }
      
      // Verificar lecciones en la base de datos
      const lessons = await prisma.lesson.findMany({
        where: { courseId: course.id },
        orderBy: { order: 'asc' }
      });
      
      console.log(`📚 Lecciones encontradas en BD: ${lessons.length}`);
      
      if (lessons.length > 0) {
        console.log('📝 Primera lección:', lessons[0].title);
        console.log('📝 Última lección:', lessons[lessons.length - 1].title);
      }
      
    } else {
      console.log('❌ Curso no encontrado en la base de datos');
    }

    console.log('\n🎉 Prueba completada!');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  testCourseNavigation()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { testCourseNavigation }; 