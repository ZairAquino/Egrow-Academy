import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function simulateLessonCompletion() {
  try {
    console.log('🎯 [SIMULACIÓN] Iniciando simulación de completación de lección...');

    // Buscar un usuario de prueba
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: '@'
        }
      },
      select: {
        id: true,
        email: true
      }
    });

    if (!user) {
      console.log('❌ No se encontró ningún usuario para probar');
      return;
    }

    console.log(`👤 Usuario de prueba: ${user.email} (${user.id})`);

    // Buscar el curso de guiones
    const course = await prisma.course.findFirst({
      where: {
        slug: 'guiones-videos-promocionales-ia'
      },
      select: {
        id: true,
        title: true,
        slug: true
      }
    });

    if (!course) {
      console.log('❌ No se encontró el curso de guiones');
      return;
    }

    console.log(`📚 Curso: ${course.title} (${course.id})`);

    // Buscar la inscripción del usuario
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: course.id
      },
      include: {
        progress: true
      }
    });

    if (!enrollment) {
      console.log('❌ El usuario no está inscrito en el curso');
      return;
    }

    console.log('✅ Usuario inscrito encontrado');
    console.log(`📊 Estado actual:`);
    console.log(`   - Lección actual: ${enrollment.progress?.currentLesson || 0}`);
    console.log(`   - Lecciones completadas: ${enrollment.progress?.completedLessons?.length || 0}`);
    console.log(`   - Porcentaje: ${enrollment.progress?.progressPercentage || 0}%`);

    // Simular la completación de la primera lección
    const firstLessonId = 'cme1s4sft0003e5zoajkhytmn'; // ID de la primera lección
    const lessonNumber = 1;
    const lessonTitle = '1.1 ¿Qué es un guión digital?';

    console.log(`\n🎯 Simulando completación de lección:`);
    console.log(`   - ID: ${firstLessonId}`);
    console.log(`   - Número: ${lessonNumber}`);
    console.log(`   - Título: ${lessonTitle}`);

    // Actualizar el progreso
    const updatedProgress = await prisma.courseProgress.update({
      where: { id: enrollment.progress!.id },
      data: {
        currentLesson: 1,
        completedLessons: {
          push: firstLessonId
        },
        progressPercentage: 7, // 1/15 * 100
        status: 'IN_PROGRESS',
        lastAccessed: new Date()
      }
    });

    // Crear registro de progreso de lección individual
    await prisma.lessonProgress.upsert({
      where: {
        courseProgressId_lessonNumber: {
          courseProgressId: enrollment.progress!.id,
          lessonNumber: lessonNumber
        }
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
        lastAccessed: new Date(),
        accessCount: {
          increment: 1
        },
        completionAttempts: {
          increment: 1
        }
      },
      create: {
        courseProgressId: enrollment.progress!.id,
        lessonNumber: lessonNumber,
        lessonTitle: lessonTitle,
        isCompleted: true,
        completedAt: new Date(),
        timeSpent: 900, // 15 minutos
        accessCount: 1,
        completionAttempts: 1
      }
    });

    console.log('✅ Lección marcada como completada');

    // Verificar el resultado
    const updatedEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: course.id
      },
      include: {
        progress: {
          include: {
            lessonProgress: true
          }
        }
      }
    });

    console.log(`\n📊 Estado después de la completación:`);
    console.log(`   - Lección actual: ${updatedEnrollment?.progress?.currentLesson || 0}`);
    console.log(`   - Lecciones completadas: ${updatedEnrollment?.progress?.completedLessons?.length || 0}`);
    console.log(`   - Porcentaje: ${updatedEnrollment?.progress?.progressPercentage || 0}%`);
    console.log(`   - Estado: ${updatedEnrollment?.progress?.status || 'N/A'}`);
    
    if (updatedEnrollment?.progress?.completedLessons) {
      console.log(`   - IDs completados: ${updatedEnrollment.progress.completedLessons.join(', ')}`);
    }

    if (updatedEnrollment?.progress?.lessonProgress) {
      console.log(`   - Progreso de lecciones individuales: ${updatedEnrollment.progress.lessonProgress.length} registros`);
      updatedEnrollment.progress.lessonProgress.forEach((lp, index) => {
        console.log(`     ${index + 1}. Lección ${lp.lessonNumber}: ${lp.lessonTitle} - ${lp.isCompleted ? '✅ Completada' : '⏳ Pendiente'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error en la simulación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simulateLessonCompletion();
