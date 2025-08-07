import { PrismaClient } from '@prisma/client';
import { recordLessonCompletion, getUserStreakStats } from '../src/lib/streaks';

const prisma = new PrismaClient();

async function testLessonProgressAndStreaks() {
  try {
    console.log('🧪 Iniciando prueba del sistema de progreso de lecciones y rachas...\n');

    // 1. Crear un usuario de prueba
    const testUser = await prisma.user.upsert({
      where: { email: 'test-streaks@egrow.com' },
      update: {},
      create: {
        email: 'test-streaks@egrow.com',
        firstName: 'Test',
        lastName: 'Streaks',
        passwordHash: 'test-hash',
        membershipLevel: 'FREE'
      }
    });

    console.log(`✅ Usuario de prueba creado: ${testUser.email} (ID: ${testUser.id})`);

    // 2. Obtener el curso de guiones
    const course = await prisma.course.findUnique({
      where: { slug: 'guiones-videos-promocionales-ia' }
    });

    if (!course) {
      console.error('❌ Curso de guiones no encontrado');
      return;
    }

    console.log(`✅ Curso encontrado: ${course.title} (ID: ${course.id})`);

    // 3. Crear inscripción del usuario en el curso
    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: testUser.id,
          courseId: course.id
        }
      },
      update: {},
      create: {
        userId: testUser.id,
        courseId: course.id,
        enrolledAt: new Date(),
        status: 'ACTIVE',
        progressPercentage: 0
      }
    });

    console.log(`✅ Inscripción creada: ${enrollment.id}`);

    // 4. Crear progreso del curso
    const courseProgress = await prisma.courseProgress.upsert({
      where: { enrollmentId: enrollment.id },
      update: {},
      create: {
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

    console.log(`✅ Progreso del curso creado: ${courseProgress.id}`);

    // 5. Simular completar varias lecciones
    const lessonsToComplete = [
      { number: 1, title: '1.1 ¿Qué es un guión digital?' },
      { number: 2, title: '1.2 Estructura básica de un guión efectivo' },
      { number: 3, title: '1.3 Diferencias entre guiones por plataforma' },
      { number: 4, title: '2.1 Herramientas de IA para guiones' },
      { number: 5, title: '2.2 Prompts efectivos para ChatGPT' }
    ];

    console.log('\n📚 Simulando completar lecciones...');

    for (const lesson of lessonsToComplete) {
      console.log(`\n🎯 Completando lección: ${lesson.title}`);
      
      // Registrar en el sistema de rachas
      const streakResult = await recordLessonCompletion(
        testUser.id,
        course.id,
        lesson.number,
        lesson.title
      );

      console.log(`✅ Lección registrada en rachas:`, {
        weekProgress: streakResult.weekProgress,
        goalMet: streakResult.goalMet,
        currentStreak: streakResult.currentStreak,
        totalPoints: streakResult.totalPoints
      });

      // Actualizar progreso del curso
      await prisma.courseProgress.update({
        where: { id: courseProgress.id },
        data: {
          currentLesson: lesson.number,
          completedLessons: {
            push: `lesson-${lesson.number}`
          },
          progressPercentage: (lesson.number / 5) * 100,
          lastAccessed: new Date()
        }
      });

      console.log(`✅ Progreso del curso actualizado: ${lesson.number}/5 lecciones`);
    }

    // 6. Verificar estadísticas de rachas
    console.log('\n🏆 Verificando estadísticas de rachas...');
    
    const streakStats = await getUserStreakStats(testUser.id);
    console.log('📊 Estadísticas de rachas:', {
      currentStreak: streakStats.currentStreak,
      longestStreak: streakStats.longestStreak,
      totalPoints: streakStats.totalPoints,
      lifetimePoints: streakStats.lifetimePointsEarned,
      isCurrentWeekComplete: streakStats.isCurrentWeekComplete,
      currentWeekLessons: streakStats.currentWeekLessons
    });

    // 7. Verificar progreso del curso
    console.log('\n📈 Verificando progreso del curso...');
    
    const updatedProgress = await prisma.courseProgress.findUnique({
      where: { id: courseProgress.id },
      include: {
        lessonProgress: true
      }
    });

    console.log('📊 Progreso del curso:', {
      currentLesson: updatedProgress?.currentLesson,
      completedLessons: updatedProgress?.completedLessons.length,
      progressPercentage: updatedProgress?.progressPercentage,
      totalLessons: updatedProgress?.lessonProgress.length
    });

    // 8. Verificar lecciones completadas esta semana
    console.log('\n📅 Verificando lecciones de esta semana...');
    
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Lunes
    weekStart.setHours(0, 0, 0, 0);

    const weeklyCompletions = await prisma.weeklyLessonCompletion.findMany({
      where: {
        userId: testUser.id,
        weekStart: weekStart
      }
    });

    console.log('📅 Completaciones de esta semana:', weeklyCompletions.map(wc => ({
      courseId: wc.courseId,
      lessonsCompleted: wc.lessonsCompletedInWeek,
      lastLessonAt: wc.lastLessonAt
    })));

    // 9. Verificar badges ganados
    console.log('\n🏅 Verificando badges ganados...');
    
    const userBadges = await prisma.userStreakBadge.findMany({
      where: { userId: testUser.id }
    });

    console.log('🏅 Badges del usuario:', userBadges.map(badge => ({
      level: badge.badgeLevel,
      streakWhenEarned: badge.streakWhenEarned,
      earnedAt: badge.earnedAt
    })));

    console.log('\n✅ Prueba completada exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`- Usuario: ${testUser.email}`);
    console.log(`- Lecciones completadas: ${lessonsToComplete.length}`);
    console.log(`- Progreso del curso: ${updatedProgress?.progressPercentage}%`);
    console.log(`- Rachas actuales: ${streakStats.currentStreak} semanas`);
    console.log(`- Puntos totales: ${streakStats.totalPoints}`);

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testLessonProgressAndStreaks();
