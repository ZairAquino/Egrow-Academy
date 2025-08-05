import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCourseExists() {
  try {
    console.log('🔍 Verificando existencia del curso mockup-cero...');
    
    // Buscar el curso por slug
    const course = await prisma.course.findUnique({
      where: { slug: 'mockup-cero' },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!course) {
      console.log('❌ El curso mockup-cero NO existe en la base de datos');
      return;
    }

    console.log('✅ Curso encontrado:');
    console.log(`   ID: ${course.id}`);
    console.log(`   Título: ${course.title}`);
    console.log(`   Slug: ${course.slug}`);
    console.log(`   Estado: ${course.status}`);
    console.log(`   Lecciones: ${course.lessons.length}`);

    // Verificar lecciones
    if (course.lessons.length > 0) {
      console.log('\n📚 Lecciones del curso:');
      course.lessons.forEach((lesson, index) => {
        console.log(`   ${index + 1}. ${lesson.title} (Orden: ${lesson.order})`);
      });
    } else {
      console.log('⚠️ El curso no tiene lecciones');
    }

    // Verificar inscripciones
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: course.id },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true }
        },
        progress: true
      }
    });

    console.log(`\n👥 Inscripciones: ${enrollments.length}`);
    enrollments.forEach((enrollment, index) => {
      console.log(`   ${index + 1}. ${enrollment.user.firstName} ${enrollment.user.lastName} (${enrollment.user.email})`);
      console.log(`      Estado: ${enrollment.status}`);
      console.log(`      Progreso: ${enrollment.progressPercentage}%`);
      console.log(`      Completado: ${enrollment.completedAt ? 'Sí' : 'No'}`);
    });

  } catch (error) {
    console.error('❌ Error verificando curso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCourseExists(); 