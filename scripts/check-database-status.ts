import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabaseStatus() {
  try {
    console.log('🔍 VERIFICANDO ESTADO DE LA BASE DE DATOS DE DESARROLLO\n');

    // Verificar conexión
    console.log('📡 Verificando conexión...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa');

    // Contar usuarios
    console.log('\n👥 Verificando usuarios...');
    const userCount = await prisma.user.count();
    console.log(`📊 Total de usuarios: ${userCount}`);

    if (userCount > 0) {
      const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          membershipLevel: true,
        }
      });

      console.log('\n📋 Últimos 5 usuarios registrados:');
      recentUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
        console.log(`     Creado: ${user.createdAt.toISOString().split('T')[0]}`);
        console.log(`     Nivel: ${user.membershipLevel}`);
      });
    }

    // Contar cursos
    console.log('\n📚 Verificando cursos...');
    const courseCount = await prisma.course.count();
    console.log(`📊 Total de cursos: ${courseCount}`);

    if (courseCount > 0) {
      const courses = await prisma.course.findMany({
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' }
      });

      console.log('\n📋 Cursos disponibles:');
      courses.forEach((course, index) => {
        console.log(`  ${index + 1}. ${course.title} (${course.status})`);
      });
    }

    // Contar inscripciones
    console.log('\n🎓 Verificando inscripciones...');
    const enrollmentCount = await prisma.enrollment.count();
    console.log(`📊 Total de inscripciones: ${enrollmentCount}`);

    // Contar recursos
    console.log('\n📄 Verificando recursos...');
    const resourceCount = await prisma.resource.count();
    console.log(`📊 Total de recursos: ${resourceCount}`);

    // Verificar tablas del sistema de rachas
    console.log('\n🏆 Verificando tablas del sistema de rachas...');
    const streakTables = [
      { name: 'user_streaks', model: 'userStreak' },
      { name: 'user_weekly_history', model: 'userWeeklyHistory' },
      { name: 'user_streak_badges', model: 'userStreakBadge' },
      { name: 'user_points_history', model: 'userPointsHistory' },
      { name: 'streak_recovery_history', model: 'streakRecoveryHistory' },
      { name: 'weekly_lesson_completions', model: 'weeklyLessonCompletion' },
    ];

    for (const table of streakTables) {
      try {
        const count = await (prisma as any)[table.model].count();
        console.log(`  ✅ ${table.name}: ${count} registros`);
      } catch (error) {
        console.log(`  ❌ ${table.name}: Error - ${error}`);
      }
    }

    // Verificar categorías de recursos
    console.log('\n🏷️ Verificando nuevas categorías de recursos...');
    const resourcesByCategory = await prisma.resource.groupBy({
      by: ['category'],
      _count: { category: true },
    });

    console.log('📊 Recursos por categoría:');
    resourcesByCategory.forEach(group => {
      console.log(`  - ${group.category}: ${group._count.category} recursos`);
    });

    // Resumen final
    console.log('\n📋 RESUMEN:');
    console.log(`👥 Usuarios: ${userCount}`);
    console.log(`📚 Cursos: ${courseCount}`);
    console.log(`🎓 Inscripciones: ${enrollmentCount}`);
    console.log(`📄 Recursos: ${resourceCount}`);
    
    if (userCount === 0) {
      console.log('\n⚠️  ALERTA: No hay usuarios en la base de datos');
      console.log('💡 Esto podría indicar que los datos se perdieron');
    } else {
      console.log('\n✅ Base de datos parece estar en orden');
    }

  } catch (error) {
    console.error('❌ Error verificando la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseStatus();