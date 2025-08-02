import { PrismaClient } from '@prisma/client';
import { recordLessonCompletion, getUserStreakStats } from '../src/lib/streaks';

const prisma = new PrismaClient();

async function testStreakNotificationScenarios() {
  try {
    console.log('🧪 PROBANDO ESCENARIOS DE NOTIFICACIONES DE RACHAS\n');

    // Obtener usuario de prueba
    const testUser = await prisma.user.findFirst();
    const testCourse = await prisma.course.findFirst();
    
    if (!testUser || !testCourse) {
      throw new Error('No se encontró usuario o curso de prueba');
    }

    console.log(`👤 Usuario de prueba: ${testUser.firstName} ${testUser.lastName}`);
    console.log(`📚 Curso de prueba: ${testCourse.title}\n`);

    // Limpiar datos previos de la semana actual
    const currentWeekStart = new Date();
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1);
    currentWeekStart.setHours(0, 0, 0, 0);

    await prisma.userStreak.deleteMany({
      where: {
        userId: testUser.id,
        weekStartDate: currentWeekStart
      }
    });

    await prisma.weeklyLessonCompletion.deleteMany({
      where: {
        userId: testUser.id,
        weekStart: currentWeekStart
      }
    });

    console.log('🧹 Datos de la semana actual limpiados\n');

    // ESCENARIO 1: Completar primera lección (debería mostrar motivación)
    console.log('🌟 ESCENARIO 1: Primera lección de la semana');
    let result = await recordLessonCompletion(testUser.id, testCourse.id, 1, 'Introducción al Curso');
    console.log(`   ✅ Progreso: ${result.weekProgress}`);
    console.log(`   📝 Notificación esperada: Mensaje motivacional para lección 1\n`);

    // ESCENARIO 2: Completar segunda lección
    console.log('🚀 ESCENARIO 2: Segunda lección');
    result = await recordLessonCompletion(testUser.id, testCourse.id, 2, 'Conceptos Básicos');
    console.log(`   ✅ Progreso: ${result.weekProgress}`);
    console.log(`   📝 Notificación esperada: "¡Vas por buen camino! Solo 3 lecciones más"\n`);

    // ESCENARIO 3: Completar tercera lección
    console.log('💪 ESCENARIO 3: Tercera lección (más de la mitad)');
    result = await recordLessonCompletion(testUser.id, testCourse.id, 3, 'Práctica Intermedia');
    console.log(`   ✅ Progreso: ${result.weekProgress}`);
    console.log(`   📝 Notificación esperada: "¡Más de la mitad! Solo 2 lecciones más"\n`);

    // ESCENARIO 4: Completar cuarta lección
    console.log('🔥 ESCENARIO 4: Cuarta lección (casi completa)');
    result = await recordLessonCompletion(testUser.id, testCourse.id, 4, 'Práctica Avanzada');
    console.log(`   ✅ Progreso: ${result.weekProgress}`);
    console.log(`   📝 Notificación esperada: "¡Casi lo logras! Solo una lección más"\n`);

    // ESCENARIO 5: Completar quinta lección (META CUMPLIDA)
    console.log('🎉 ESCENARIO 5: Quinta lección - ¡META SEMANAL CUMPLIDA!');
    result = await recordLessonCompletion(testUser.id, testCourse.id, 5, 'Proyecto Final');
    console.log(`   ✅ Progreso: ${result.weekProgress}`);
    console.log(`   🏆 Meta cumplida: ${result.goalMet ? 'SÍ' : 'NO'}`);
    console.log(`   🔥 Racha actual: ${result.currentStreak} semanas`);
    console.log(`   📝 Notificaciones esperadas:`);
    console.log(`      - 🎉 "¡Meta Semanal Completada! Ganaste 10 puntos"`);
    console.log(`      - 🌱 "¡Primera racha semanal!" (si es la primera vez)\n`);

    // ESCENARIO 6: Completar sexta lección (bonus)
    console.log('⭐ ESCENARIO 6: Sexta lección (bonus)');
    result = await recordLessonCompletion(testUser.id, testCourse.id, 6, 'Contenido Bonus');
    console.log(`   ✅ Progreso: ${result.weekProgress}`);
    console.log(`   📝 Notificación esperada: Ninguna (meta ya cumplida)\n`);

    // Verificar estadísticas finales
    console.log('📊 VERIFICANDO ESTADÍSTICAS FINALES...');
    const finalStats = await getUserStreakStats(testUser.id);
    
    console.log(`   📚 Lecciones esta semana: ${finalStats.currentWeekLessons}`);
    console.log(`   🎯 Meta cumplida: ${finalStats.goalMet ? 'SÍ' : 'NO'}`);
    console.log(`   🔥 Racha actual: ${finalStats.currentStreak} semanas`);
    console.log(`   💎 Puntos totales: ${finalStats.totalPoints}`);
    console.log(`   🏆 Badges obtenidos: ${finalStats.badges.length}`);
    
    if (finalStats.badges.length > 0) {
      finalStats.badges.forEach(badge => {
        console.log(`      - ${badge.badgeLevel}: ${badge.earnedAt}`);
      });
    }

    console.log('\n🎯 RESUMEN DE NOTIFICACIONES ESPERADAS:');
    console.log('1. 🌟 Lección 1: "¡Excelente inicio! Cada lección cuenta hacia tu meta."');
    console.log('2. 🚀 Lección 2: "¡Vas por buen camino! Solo 3 lecciones más para completar la meta."');
    console.log('3. 💪 Lección 3: "¡Más de la mitad! Te faltan solo 2 lecciones para la meta semanal."');
    console.log('4. 🔥 Lección 4: "¡Casi lo logras! Solo una lección más para completar tu racha."');
    console.log('5. 🎉 Lección 5: "¡Meta Semanal Completada! Has completado tu meta de 5 lecciones esta semana y ganaste [X] puntos."');
    console.log('6. 🌱 Racha 1: "¡Primera racha semanal!" (si es primera vez)');
    console.log('7. 🏆 Badge Principiante: "¡Nuevo Badge Desbloqueado! Has alcanzado el nivel Principiante"');

    console.log('\n✅ PRUEBA DE ESCENARIOS COMPLETADA');
    console.log('\n💡 INSTRUCCIONES PARA VERIFICAR:');
    console.log('1. Abre la aplicación en http://localhost:3000');
    console.log('2. Inicia sesión con cualquier usuario');
    console.log('3. Ve a un curso y completa lecciones una por una');
    console.log('4. Observa las notificaciones que aparecen en la esquina superior derecha');
    console.log('5. Verifica que el dropdown del usuario se actualice automáticamente');

  } catch (error) {
    console.error('❌ ERROR en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testStreakNotificationScenarios();