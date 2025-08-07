import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEnrollments() {
  try {
    console.log('🔍 Verificando inscripciones en el curso...');
    
    // Buscar el curso por slug
    const course = await prisma.course.findUnique({
      where: {
        slug: 'guiones-videos-promocionales-ia'
      },
      select: { id: true, title: true }
    });

    if (!course) {
      console.log('❌ Curso no encontrado');
      return;
    }

    console.log(`✅ Curso: ${course.title} (ID: ${course.id})`);

    // Buscar inscripciones
    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId: course.id
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        progress: {
          include: {
            lessonProgress: true
          }
        }
      }
    });

    console.log(`\n👥 Total de inscripciones: ${enrollments.length}`);

    if (enrollments.length > 0) {
      enrollments.forEach((enrollment, index) => {
        console.log(`\n${index + 1}. Usuario: ${enrollment.user.firstName} ${enrollment.user.lastName}`);
        console.log(`   Email: ${enrollment.user.email}`);
        console.log(`   Estado: ${enrollment.status}`);
        console.log(`   Progreso: ${enrollment.progressPercentage}%`);
        console.log(`   Fecha de inscripción: ${enrollment.enrolledAt}`);
        
        if (enrollment.progress) {
          console.log(`   Lección actual: ${enrollment.progress.currentLesson}`);
          console.log(`   Lecciones completadas: ${enrollment.progress.completedLessons.length}`);
          console.log(`   Tiempo total: ${enrollment.progress.totalTimeSpent} minutos`);
        }
      });
    } else {
      console.log('\n⚠️ No hay usuarios inscritos en este curso');
    }

    // Verificar lecciones del curso
    const lessons = await prisma.lesson.findMany({
      where: {
        courseId: course.id
      },
      select: {
        id: true,
        title: true,
        order: true,
        duration: true
      },
      orderBy: {
        order: 'asc'
      }
    });

    console.log(`\n📚 Total de lecciones: ${lessons.length}`);
    if (lessons.length > 0) {
      lessons.forEach((lesson, index) => {
        console.log(`${index + 1}. ${lesson.title} (Orden: ${lesson.order}, Duración: ${lesson.duration}min)`);
      });
    }

  } catch (error) {
    console.error('❌ Error al verificar inscripciones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEnrollments();
