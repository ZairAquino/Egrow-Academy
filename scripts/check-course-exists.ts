import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCourseExists() {
  try {
    console.log('🔍 Verificando si el curso existe en la base de datos...');
    
    // Buscar el curso por slug
    const course = await prisma.course.findUnique({
      where: {
        slug: 'guiones-videos-promocionales-ia'
      },
      include: {
        lessons: true
      }
    });

    if (course) {
      console.log('✅ Curso encontrado:');
      console.log(`- ID: ${course.id}`);
      console.log(`- Título: ${course.title}`);
      console.log(`- Slug: ${course.slug}`);
      console.log(`- Estado: ${course.status}`);
      console.log(`- Lecciones: ${course.lessons.length}`);
      console.log(`- Es gratis: ${course.isFree}`);
      
      if (course.lessons.length > 0) {
        console.log('\n📚 Lecciones encontradas:');
        course.lessons.forEach((lesson, index) => {
          console.log(`${index + 1}. ${lesson.title} (${lesson.duration}min)`);
        });
      } else {
        console.log('\n⚠️ No hay lecciones registradas para este curso');
      }
    } else {
      console.log('❌ El curso NO existe en la base de datos');
      console.log('Necesitas crear el curso en la base de datos');
    }

    // Verificar si hay otros cursos similares
    const similarCourses = await prisma.course.findMany({
      where: {
        title: {
          contains: 'guiones'
        }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true
      }
    });

    if (similarCourses.length > 0) {
      console.log('\n🔍 Cursos similares encontrados:');
      similarCourses.forEach(course => {
        console.log(`- ${course.title} (${course.slug}) - ${course.status}`);
      });
    }

  } catch (error) {
    console.error('❌ Error al verificar el curso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCourseExists(); 