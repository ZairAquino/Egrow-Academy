import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listAllCourses() {
  console.log('📚 Listando todos los cursos y sus lecciones...');

  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Obtener todos los cursos
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'asc' }
    });

    console.log(`📋 Cursos encontrados: ${courses.length}`);

    for (const course of courses) {
      console.log(`\n🎓 CURSO: "${course.title}"`);
      console.log(`   - ID: ${course.id}`);
      console.log(`   - Slug: ${course.slug}`);
      console.log(`   - Estado: ${course.status}`);
      console.log(`   - Lecciones en BD: ${course.lessonsCount}`);
      console.log(`   - Duración: ${course.durationHours} horas`);

      // Obtener lecciones del curso
      const lessons = await prisma.lesson.findMany({
        where: { courseId: course.id },
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          order: true
        }
      });

      console.log(`   📚 Lecciones en BD: ${lessons.length}`);
      
      if (lessons.length > 0) {
        console.log('   📝 Detalles de lecciones:');
        lessons.forEach((lesson, index) => {
          console.log(`     ${index + 1}. ID: "${lesson.id}" | Order: ${lesson.order} | Título: "${lesson.title}"`);
        });
      } else {
        console.log('   ⚠️  No hay lecciones en la base de datos');
      }
    }

  } catch (error) {
    console.error('❌ Error durante la listado:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  listAllCourses()
    .then(() => {
      console.log('\n✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { listAllCourses }; 