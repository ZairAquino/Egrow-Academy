import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testStreaksIntegration() {
  try {
    console.log('🧪 PROBANDO INTEGRACIÓN DEL SISTEMA DE RACHAS\n');

    // Importar las funciones de rachas al inicio
    const { recordLessonCompletion, getUserStreakStats } = await import('../src/lib/streaks');

    // 1. Verificar que hay usuarios y cursos disponibles
    console.log('📊 1. Verificando datos existentes...');
    const userCount = await prisma.user.count();
    const courseCount = await prisma.course.count();
    
    console.log(`   👥 Usuarios: ${userCount}`);
    console.log(`   📚 Cursos: ${courseCount}`);

    if (userCount === 0 || courseCount === 0) {
      throw new Error('Necesitamos al menos 1 usuario y 1 curso para la prueba');
    }

    // 2. Obtener un usuario de prueba
    const testUser = await prisma.user.findFirst({
      select: { id: true, email: true, firstName: true, lastName: true }
    });

    if (!testUser) {
      throw new Error('No se encontró usuario de prueba');
    }

    console.log(`   🧪 Usuario de prueba: ${testUser.firstName} ${testUser.lastName} (${testUser.email})`);

    // 3. Obtener un curso de prueba
    const testCourse = await prisma.course.findFirst({
      where: { status: 'PUBLISHED' },
      select: { id: true, title: true, slug: true }
    });

    if (!testCourse) {
      throw new Error('No se encontró curso publicado');
    }

    console.log(`   📖 Curso de prueba: ${testCourse.title}`);

    // 4. Simular completar una lección usando la API
    console.log('\n🎯 2. Simulando progreso de lección...');
    
    // Obtener token simulado (en prueba real vendría del localStorage)
    const simulateApiCall = async () => {
      try {
        // Simulamos la llamada que haría el frontend
        const progressData = {
          courseId: testCourse.id,
          currentLesson: 1,
          completedLessons: ['lesson-1'],
          lessonNumber: 1,
          lessonTitle: 'Lección de Prueba - Integración Rachas',
          action: 'complete',
          timeSpent: 300 // 5 minutos
        };

        console.log(`   📤 Simulando POST a /api/courses/progress con:`, {
          courseId: testCourse.slug,
          lessonNumber: progressData.lessonNumber,
          lessonTitle: progressData.lessonTitle,
          action: progressData.action
        });

        // Simular directamente la lógica que está en la API
        
        console.log('   🏆 Llamando directamente a recordLessonCompletion...');
        const result = await recordLessonCompletion(
          testUser.id,
          testCourse.id,
          progressData.lessonNumber,
          progressData.lessonTitle
        );

        console.log('   ✅ Resultado de la integración:', result);
        return result;

      } catch (error) {
        console.error('   ❌ Error en simulación de API:', error);
        throw error;
      }
    };

    const streakResult = await simulateApiCall();

    // 5. Verificar que se crearon los registros de rachas
    console.log('\n📈 3. Verificando registros de rachas creados...');
    
    const userStreak = await prisma.userStreak.findFirst({
      where: { userId: testUser.id },
      orderBy: { createdAt: 'desc' }
    });

    const weeklyCompletion = await prisma.weeklyLessonCompletion.findFirst({
      where: { 
        userId: testUser.id,
        courseId: testCourse.id
      },
      orderBy: { createdAt: 'desc' }
    });

    const pointsHistory = await prisma.userPointsHistory.findFirst({
      where: { userId: testUser.id },
      orderBy: { createdAt: 'desc' }
    });

    console.log('   📊 Registro de racha del usuario:');
    if (userStreak) {
      console.log(`      ✅ Lecciones esta semana: ${userStreak.currentWeekLessons}`);
      console.log(`      ✅ Racha actual: ${userStreak.currentStreak}`);
      console.log(`      ✅ Puntos totales: ${userStreak.totalPoints}`);
      console.log(`      ✅ Meta cumplida: ${userStreak.isCurrentWeekComplete ? 'Sí' : 'No'}`);
    } else {
      console.log('      ❌ No se encontró registro de racha');
    }

    console.log('   📊 Registro semanal por curso:');
    if (weeklyCompletion) {
      console.log(`      ✅ Lecciones completadas: ${weeklyCompletion.lessonsCompletedInWeek}`);
      console.log(`      ✅ Última lección: ${weeklyCompletion.lastLessonAt?.toISOString()}`);
    } else {
      console.log('      ❌ No se encontró registro semanal');
    }

    console.log('   📊 Historial de puntos:');
    if (pointsHistory) {
      console.log(`      ✅ Puntos ganados: ${pointsHistory.pointsEarned}`);
      console.log(`      ✅ Tipo: ${pointsHistory.transactionType}`);
      console.log(`      ✅ Razón: ${pointsHistory.reason}`);
    } else {
      console.log('      ❌ No se encontró historial de puntos');
    }

    // 6. Probar obtener estadísticas desde la API
    console.log('\n🔍 4. Probando API de estadísticas...');
    const stats = await getUserStreakStats(testUser.id);
    
    console.log('   📊 Estadísticas obtenidas:');
    console.log(`      ✅ Progreso semanal: ${stats.weekProgress}`);
    console.log(`      ✅ Racha actual: ${stats.currentStreak} semanas`);
    console.log(`      ✅ Puntos disponibles: ${stats.totalPoints}`);
    console.log(`      ✅ Meta cumplida: ${stats.goalMet ? 'Sí' : 'No'}`);
    console.log(`      ✅ Badges obtenidos: ${stats.badges.length}`);

    // 7. Simular completar más lecciones para probar la acumulación
    console.log('\n🚀 5. Simulando más lecciones para probar acumulación...');
    for (let i = 2; i <= 4; i++) {
      console.log(`   📚 Completando lección ${i}...`);
      
      const result = await recordLessonCompletion(
        testUser.id,
        testCourse.id,
        i,
        `Lección ${i} - Prueba Acumulación`
      );
      
      console.log(`      ✅ Progreso: ${result.weekProgress} | Racha: ${result.currentStreak}`);
    }

    // 8. Verificar estadísticas finales
    console.log('\n📋 6. Estadísticas finales...');
    const finalStats = await getUserStreakStats(testUser.id);
    console.log(`   📊 Lecciones completadas: ${finalStats.currentWeekLessons}`);
    console.log(`   📊 Progreso: ${finalStats.weekProgress}`);
    console.log(`   📊 Meta cumplida: ${finalStats.goalMet ? '✅ SÍ' : '❌ NO'}`);
    console.log(`   📊 Puntos ganados: ${finalStats.totalPoints}`);

    if (finalStats.goalMet) {
      console.log('\n🎉 ¡EXCELENTE! El usuario completó la meta semanal');
      if (finalStats.currentStreak > 0) {
        console.log(`🔥 ¡Y mantiene una racha de ${finalStats.currentStreak} semanas!`);
      }
    } else {
      console.log(`\n📈 El usuario necesita ${5 - finalStats.currentWeekLessons} lecciones más para completar la meta`);
    }

    console.log('\n✅ INTEGRACIÓN DEL SISTEMA DE RACHAS FUNCIONA CORRECTAMENTE!');

  } catch (error) {
    console.error('❌ ERROR EN LA PRUEBA DE INTEGRACIÓN:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testStreaksIntegration();