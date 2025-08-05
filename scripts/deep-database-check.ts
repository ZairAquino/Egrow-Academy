import { PrismaClient } from '@prisma/client';

async function deepDatabaseCheck() {
  console.log('🔍 Verificación profunda de la base de datos de desarrollo...\n');

  const prisma = new PrismaClient();

  try {
    // Verificar conexión
    console.log('🔌 Verificando conexión a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa\n');

    // Verificar todas las tablas posibles
    const allTables = [
      'user', 'session', 'course', 'lesson', 'enrollment', 'courseProgress', 
      'lessonProgress', 'comment', 'like', 'payment', 'subscription', 'product', 
      'price', 'resource', 'resourceTopic', 'resourceAccessLog', 'event', 
      'eventRegistration', 'rating', 'securityLog', 'promotion', 'promotionInteraction', 
      'userBehavior', 'userPreference', 'recommendation', 'achievement', 'userStreak', 
      'weeklyLessonCompletion', 'userStreakBadge', 'userPointsHistory', 'streakRecoveryHistory',
      'webinar', 'webinarRegistration'
    ];

    console.log('📊 Verificando todas las tablas:');
    for (const table of allTables) {
      try {
        // @ts-ignore
        const count = await prisma[table].count();
        console.log(`  ${table}: ${count} registros`);
        
        if (count > 0) {
          // Mostrar algunos ejemplos
          // @ts-ignore
          const samples = await prisma[table].findMany({ take: 2 });
          samples.forEach((sample: any, index: number) => {
            let displayName = '';
            if (sample.title) displayName = sample.title;
            else if (sample.name) displayName = sample.name;
            else if (sample.email) displayName = sample.email;
            else if (sample.id) displayName = `ID: ${sample.id}`;
            else displayName = 'Sin nombre';
            
            console.log(`    ${index + 1}. ${displayName}`);
          });
        }
      } catch (error) {
        console.log(`  ❌ ${table}: Error - ${error.message}`);
      }
    }

    console.log('\n🎯 Verificación específica de usuarios:');
    try {
      const users = await prisma.user.findMany({
        include: {
          enrollments: true,
          courseProgress: true,
          lessonProgress: true
        }
      });
      
      console.log(`Usuarios encontrados: ${users.length}`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} - ${user.name || 'Sin nombre'}`);
        console.log(`   Inscripciones: ${user.enrollments.length}`);
        console.log(`   Progreso de cursos: ${user.courseProgress.length}`);
        console.log(`   Progreso de lecciones: ${user.lessonProgress.length}`);
      });
    } catch (error) {
      console.log('❌ Error verificando usuarios:', error.message);
    }

    console.log('\n🎯 Verificación específica de inscripciones:');
    try {
      const enrollments = await prisma.enrollment.findMany({
        include: {
          user: true,
          course: true
        }
      });
      
      console.log(`Inscripciones encontradas: ${enrollments.length}`);
      enrollments.forEach((enrollment, index) => {
        console.log(`${index + 1}. ${enrollment.user?.email || 'Usuario no encontrado'} - ${enrollment.course?.title || 'Curso no encontrado'}`);
      });
    } catch (error) {
      console.log('❌ Error verificando inscripciones:', error.message);
    }

    console.log('\n🎯 Verificación específica de progreso:');
    try {
      const courseProgress = await prisma.courseProgress.findMany({
        include: {
          user: true,
          course: true
        }
      });
      
      console.log(`Progreso de cursos encontrado: ${courseProgress.length}`);
      courseProgress.forEach((progress, index) => {
        console.log(`${index + 1}. ${progress.user?.email || 'Usuario no encontrado'} - ${progress.course?.title || 'Curso no encontrado'} - ${progress.progress}%`);
      });
    } catch (error) {
      console.log('❌ Error verificando progreso de cursos:', error.message);
    }

    // Verificar si hay datos en tablas relacionadas
    console.log('\n🔍 Verificando datos en tablas relacionadas:');
    try {
      const lessonProgress = await prisma.lessonProgress.findMany({
        include: {
          user: true,
          lesson: true
        }
      });
      
      console.log(`Progreso de lecciones encontrado: ${lessonProgress.length}`);
      lessonProgress.forEach((progress, index) => {
        console.log(`${index + 1}. ${progress.user?.email || 'Usuario no encontrado'} - ${progress.lesson?.title || 'Lección no encontrada'} - ${progress.status}`);
      });
    } catch (error) {
      console.log('❌ Error verificando progreso de lecciones:', error.message);
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deepDatabaseCheck().catch(console.error); 