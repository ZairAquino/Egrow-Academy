import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testWebLessonCompletion() {
  try {
    console.log('🌐 Simulando guardado de lecciones desde la interfaz web...\n');

    // 1. Obtener el usuario de prueba
    const testUser = await prisma.user.findUnique({
      where: { email: 'test-streaks@egrow.com' }
    });

    if (!testUser) {
      console.error('❌ Usuario de prueba no encontrado');
      return;
    }

    console.log(`✅ Usuario encontrado: ${testUser.email}`);

    // 2. Obtener el curso de guiones
    const course = await prisma.course.findUnique({
      where: { slug: 'guiones-videos-promocionales-ia' }
    });

    if (!course) {
      console.error('❌ Curso de guiones no encontrado');
      return;
    }

    console.log(`✅ Curso encontrado: ${course.title}`);

    // 3. Simular llamada a la API de progreso (como lo haría el frontend)
    console.log('\n📡 Simulando llamada a la API de progreso...');

    // Simular datos que enviaría el frontend
    const lessonData = {
      courseId: 'guiones-videos-promocionales-ia',
      currentLesson: 6,
      completedLessons: [
        'gvp-mod1-les1',
        'gvp-mod1-les2', 
        'gvp-mod1-les3',
        'gvp-mod2-les1',
        'gvp-mod2-les2',
        'gvp-mod2-les3'
      ],
      lessonNumber: 6,
      lessonTitle: '2.3 Optimización de guiones con IA',
      action: 'complete',
      timeSpent: 15
    };

    console.log('📤 Datos enviados a la API:', lessonData);

    // 4. Simular la lógica de la API
    console.log('\n🔧 Procesando en el backend...');

    // Buscar enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: testUser.id,
        courseId: course.id
      }
    });

    if (!enrollment) {
      console.error('❌ Enrollment no encontrado');
      return;
    }

    console.log(`✅ Enrollment encontrado: ${enrollment.id}`);

    // Buscar o crear CourseProgress
    let courseProgress = await prisma.courseProgress.findUnique({
      where: { enrollmentId: enrollment.id }
    });

    if (!courseProgress) {
      courseProgress = await prisma.courseProgress.create({
        data: {
          enrollmentId: enrollment.id,
          currentLesson: 0,
          completedLessons: [],
          progressPercentage: 0,
          status: 'IN_PROGRESS',
          totalTimeSpent: 0,
          totalSessions: 0,
          averageSessionTime: 0,
          longestSession: 0
        }
      });
    }

    console.log(`✅ CourseProgress encontrado: ${courseProgress.id}`);

    // 5. Actualizar progreso del curso
    const newProgressPercentage = (lessonData.completedLessons.length / 15) * 100; // 15 lecciones totales

    await prisma.courseProgress.update({
      where: { id: courseProgress.id },
      data: {
        currentLesson: lessonData.currentLesson,
        completedLessons: lessonData.completedLessons,
        progressPercentage: newProgressPercentage,
        lastAccessed: new Date(),
        status: newProgressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS'
      }
    });

    console.log(`✅ Progreso actualizado: ${newProgressPercentage.toFixed(1)}%`);

    // 6. Registrar lección en el sistema de rachas
    console.log('\n🏆 Registrando en sistema de rachas...');

    // Importar la función de rachas
    const { recordLessonCompletion } = await import('../src/lib/streaks');

    const streakResult = await recordLessonCompletion(
      testUser.id,
      course.id,
      lessonData.lessonNumber,
      lessonData.lessonTitle
    );

    console.log('✅ Resultado del sistema de rachas:', {
      weekProgress: streakResult.weekProgress,
      goalMet: streakResult.goalMet,
      currentStreak: streakResult.currentStreak,
      totalPoints: streakResult.totalPoints
    });

    // 7. Verificar estado final
    console.log('\n📊 Verificando estado final...');

    const finalProgress = await prisma.courseProgress.findUnique({
      where: { id: courseProgress.id }
    });

    const finalStreak = await prisma.userStreak.findFirst({
      where: { userId: testUser.id }
    });

    const weeklyCompletions = await prisma.weeklyLessonCompletion.findMany({
      where: { userId: testUser.id }
    });

    console.log('📈 Estado final del progreso:', {
      currentLesson: finalProgress?.currentLesson,
      completedLessons: finalProgress?.completedLessons.length,
      progressPercentage: finalProgress?.progressPercentage,
      status: finalProgress?.status
    });

    console.log('🏆 Estado final de rachas:', {
      currentStreak: finalStreak?.currentStreak,
      longestStreak: finalStreak?.longestStreak,
      totalPoints: finalStreak?.totalPoints,
      currentWeekLessons: finalStreak?.currentWeekLessons
    });

    console.log('📅 Completaciones semanales:', weeklyCompletions.map(wc => ({
      courseId: wc.courseId,
      lessonsCompleted: wc.lessonsCompletedInWeek,
      weekStart: wc.weekStart
    })));

    console.log('\n✅ Simulación completada exitosamente!');
    console.log('\n🎯 Resumen de la simulación:');
    console.log(`- Lección completada: ${lessonData.lessonTitle}`);
    console.log(`- Progreso del curso: ${newProgressPercentage.toFixed(1)}%`);
    console.log(`- Lecciones completadas: ${lessonData.completedLessons.length}/15`);
    console.log(`- Rachas actuales: ${finalStreak?.currentStreak || 0} semanas`);
    console.log(`- Puntos totales: ${finalStreak?.totalPoints || 0}`);

  } catch (error) {
    console.error('❌ Error en la simulación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la simulación
testWebLessonCompletion();
