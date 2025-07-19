import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCourseAccess() {
  try {
    console.log('🧪 Probando acceso al curso...');

    // Buscar el usuario
    const user = await prisma.user.findFirst({
      where: {
        email: 'aquinozair3@gmail.com'
      }
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log('✅ Usuario encontrado:', user.email);

    // Verificar inscripción
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: 'introduccion-llms'
      }
    });

    if (!enrollment) {
      console.log('❌ Usuario no inscrito en el curso');
      return;
    }

    console.log('✅ Usuario inscrito en el curso');

    // Verificar progreso
    const progress = await prisma.courseProgress.findFirst({
      where: {
        enrollmentId: enrollment.id
      },
      include: {
        lessonProgress: {
          orderBy: {
            lessonNumber: 'asc'
          }
        }
      }
    });

    if (!progress) {
      console.log('❌ No hay progreso registrado');
      return;
    }

    console.log('✅ Progreso encontrado');
    console.log('📊 Detalles del progreso:', {
      currentLesson: progress.currentLesson,
      completedLessons: progress.completedLessons,
      progressPercentage: progress.progressPercentage,
      status: progress.status,
      totalLessons: progress.lessonProgress.length
    });

    // Verificar lecciones completadas
    const completedLessons = progress.lessonProgress.filter(lesson => lesson.isCompleted);
    console.log('✅ Lecciones completadas:', completedLessons.length);

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCourseAccess(); 