import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupRecommendationsDB() {
  try {
    console.log('🚀 Configurando sistema de recomendaciones...');

    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Verificar que las tablas existen
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('user_behaviors', 'user_preferences', 'recommendations')
    `;
    
    console.log('📊 Tablas encontradas:', tables);

    // Crear algunos datos de prueba para comportamiento de usuario
    const testUser = await prisma.user.findFirst();
    
    if (testUser) {
      console.log('👤 Usuario de prueba encontrado:', testUser.email);

      // Crear comportamiento de prueba
      await prisma.userBehavior.createMany({
        data: [
          {
            userId: testUser.id,
            action: 'view_course',
            targetId: 'monetiza-ia',
            targetType: 'course',
            metadata: { duration: 30, page: '/curso/monetiza-ia' },
          },
          {
            userId: testUser.id,
            action: 'enroll_course',
            targetId: 'monetiza-ia',
            targetType: 'course',
            metadata: { timestamp: new Date() },
          },
          {
            userId: testUser.id,
            action: 'complete_lesson',
            targetId: 'lesson-1',
            targetType: 'lesson',
            metadata: { lessonNumber: 1, courseId: 'monetiza-ia' },
          },
          {
            userId: testUser.id,
            action: 'search',
            targetId: 'machine learning',
            targetType: 'search_query',
            metadata: { query: 'machine learning', results: 5 },
          },
        ],
        skipDuplicates: true,
      });

      console.log('✅ Datos de comportamiento de prueba creados');

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

      // Generar recomendaciones de prueba
      const recommendations = [
        {
          userId: testUser.id,
          targetId: 'desarrollo-web-fullstack',
          targetType: 'course',
          score: 0.85,
          reason: 'Basado en tu interés en desarrollo web',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
          userId: testUser.id,
          targetId: 'monetiza-ia',
          targetType: 'course',
          score: 0.92,
          reason: 'Perfecto para tu nivel intermedio',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      ];

      await prisma.recommendation.createMany({
        data: recommendations,
        skipDuplicates: true,
      });

      console.log('✅ Recomendaciones de prueba creadas');
    }

    // Verificar estadísticas
    const behaviorCount = await prisma.userBehavior.count();
    const preferencesCount = await prisma.userPreference.count();
    const recommendationsCount = await prisma.recommendation.count();

    console.log('\n📊 Estadísticas del sistema de recomendaciones:');
    console.log(`- Comportamientos registrados: ${behaviorCount}`);
    console.log(`- Preferencias de usuario: ${preferencesCount}`);
    console.log(`- Recomendaciones activas: ${recommendationsCount}`);

    console.log('\n🎉 Sistema de recomendaciones configurado exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Ejecutar migración: npx prisma migrate dev');
    console.log('2. Probar API: GET /api/recommendations');
    console.log('3. Verificar componente en la página principal');

  } catch (error) {
    console.error('❌ Error configurando sistema de recomendaciones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupRecommendationsDB(); 