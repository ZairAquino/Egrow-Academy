import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupAchievementsDB() {
  try {
    console.log('🚀 Configurando sistema de logros y progreso...');

    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Verificar que las tablas existen
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('achievements', 'user_behaviors', 'user_preferences')
    `;
    
    console.log('📊 Tablas encontradas:', tables);

    // Crear algunos datos de prueba para logros
    const testUser = await prisma.user.findFirst();
    
    if (testUser) {
      console.log('👤 Usuario de prueba encontrado:', testUser.email);

      // Crear logros de prueba
      const testAchievements = [
        {
          userId: testUser.id,
          type: 'first_course',
          title: 'Primer Paso',
          description: 'Completaste tu primera lección',
          points: 10,
          badge: '🌱 Novato',
          metadata: { lessonCount: 1 },
        },
        {
          userId: testUser.id,
          type: 'milestone',
          title: 'Aprendiz Dedicado',
          description: 'Completaste 5 lecciones',
          points: 10,
          badge: '📚 Estudiante',
          metadata: { lessonCount: 5 },
        },
        {
          userId: testUser.id,
          type: 'streak',
          title: 'Racha Inicial',
          description: '3 días consecutivos aprendiendo',
          points: 15,
          badge: '🔥 Inicio',
          metadata: { streakCount: 3 },
        },
      ];

      await prisma.achievement.createMany({
        data: testAchievements,
        skipDuplicates: true,
      });

      console.log('✅ Logros de prueba creados');

      // Crear comportamiento de prueba
      await prisma.userBehavior.createMany({
        data: [
          {
            userId: testUser.id,
            action: 'complete_lesson',
            targetId: 'lesson-1',
            targetType: 'lesson',
            metadata: { lessonNumber: 1, courseId: 'monetiza-ia' },
          },
          {
            userId: testUser.id,
            action: 'complete_lesson',
            targetId: 'lesson-2',
            targetType: 'lesson',
            metadata: { lessonNumber: 2, courseId: 'monetiza-ia' },
          },
          {
            userId: testUser.id,
            action: 'daily_activity',
            targetId: 'activity-1',
            targetType: 'activity',
            metadata: { timestamp: new Date().toISOString() },
          },
        ],
        skipDuplicates: true,
      });

      console.log('✅ Comportamiento de prueba creado');

      // Crear preferencias de usuario
      await prisma.userPreference.upsert({
        where: { userId: testUser.id },
        update: {
          interests: ['IA', 'Machine Learning', 'Desarrollo Web'],
          skillLevel: 'intermediate',
          learningGoals: ['Especialización en IA', 'Monetización de habilidades'],
          preferredTopics: ['Inteligencia Artificial', 'ChatGPT', 'React'],
        },
        create: {
          userId: testUser.id,
          interests: ['IA', 'Machine Learning', 'Desarrollo Web'],
          skillLevel: 'intermediate',
          learningGoals: ['Especialización en IA', 'Monetización de habilidades'],
          preferredTopics: ['Inteligencia Artificial', 'ChatGPT', 'React'],
        },
      });

      console.log('✅ Preferencias de usuario creadas');
    }

    // Verificar estadísticas
    const achievementsCount = await prisma.achievement.count();
    const behaviorCount = await prisma.userBehavior.count();
    const preferencesCount = await prisma.userPreference.count();

    console.log('\n📊 Estadísticas del sistema de logros:');
    console.log(`- Logros creados: ${achievementsCount}`);
    console.log(`- Comportamientos registrados: ${behaviorCount}`);
    console.log(`- Preferencias de usuario: ${preferencesCount}`);

    console.log('\n🎉 Sistema de logros configurado exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Ejecutar migración: npx prisma migrate dev');
    console.log('2. Probar API: GET /api/achievements');
    console.log('3. Verificar componente en la página de mis cursos');
    console.log('4. Probar notificaciones de logros');

  } catch (error) {
    console.error('❌ Error configurando sistema de logros:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAchievementsDB(); 