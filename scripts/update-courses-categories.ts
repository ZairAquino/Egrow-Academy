import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateCoursesCategories() {
  try {
    console.log('🚀 Actualizando categorías de cursos...');

    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Actualizar curso "Monetiza con la IA"
    await prisma.course.updateMany({
      where: {
        slug: 'monetiza-ia',
      },
      data: {
        category: 'IA_PARA_EMPRENDER',
      },
    });

    console.log('✅ Curso "Monetiza con la IA" actualizado a categoría IA_PARA_EMPRENDER');

    // Actualizar curso "Desarrollo Web Full Stack"
    await prisma.course.updateMany({
      where: {
        slug: 'desarrollo-web-fullstack',
      },
      data: {
        category: 'DESARROLLO_WEB',
      },
    });

    console.log('✅ Curso "Desarrollo Web Full Stack" actualizado a categoría DESARROLLO_WEB');

    // Crear nuevos cursos de ejemplo para diferentes categorías
    const newCourses = [
      {
        title: 'Liderazgo en la Era Digital',
        slug: 'liderazgo-digital',
        description: 'Desarrolla habilidades de liderazgo adaptadas al mundo digital. Aprende a gestionar equipos remotos y liderar proyectos tecnológicos.',
        shortDescription: 'Liderazgo para el mundo digital',
        category: 'LIDERAZGO',
        difficulty: 'ADVANCED',
        durationHours: 8,
        lessonsCount: 12,
        price: 149.99,
        isFree: false,
        requiresAuth: true,
        status: 'PUBLISHED',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop&crop=center',
      },
      {
        title: 'Productividad con IA',
        slug: 'productividad-ia',
        description: 'Optimiza tu trabajo diario con herramientas de inteligencia artificial. Automatiza tareas repetitivas y aumenta tu eficiencia.',
        shortDescription: 'Optimiza tu productividad con IA',
        category: 'PRODUCTIVIDAD',
        difficulty: 'BEGINNER',
        durationHours: 5,
        lessonsCount: 8,
        price: 0,
        isFree: true,
        requiresAuth: false,
        status: 'PUBLISHED',
        imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop&crop=center',
      },
      {
        title: 'Marketing Digital Avanzado',
        slug: 'marketing-digital-avanzado',
        description: 'Estrategias avanzadas de marketing digital para hacer crecer tu negocio online. SEO, SEM, redes sociales y más.',
        shortDescription: 'Estrategias de marketing digital',
        category: 'MARKETING_DIGITAL',
        difficulty: 'INTERMEDIATE',
        durationHours: 15,
        lessonsCount: 20,
        price: 79.99,
        isFree: false,
        requiresAuth: true,
        status: 'PUBLISHED',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center',
      },
      {
        title: 'Finanzas Personales Inteligentes',
        slug: 'finanzas-personales-inteligentes',
        description: 'Aprende a gestionar tu dinero de forma inteligente. Inversiones, ahorro, presupuesto y construcción de riqueza.',
        shortDescription: 'Gestiona tu dinero de forma inteligente',
        category: 'FINANZAS_PERSONALES',
        difficulty: 'BEGINNER',
        durationHours: 10,
        lessonsCount: 15,
        price: 29.99,
        isFree: false,
        requiresAuth: true,
        status: 'PUBLISHED',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop&crop=center',
      },
      {
        title: 'Habilidades Irremplazables',
        slug: 'habilidades-irremplazables',
        description: 'Desarrolla competencias que la IA no puede reemplazar. Creatividad, pensamiento crítico, empatía y habilidades humanas.',
        shortDescription: 'Competencias que la IA no puede reemplazar',
        category: 'HABILIDADES_IRREMPLAZABLES',
        difficulty: 'INTERMEDIATE',
        durationHours: 12,
        lessonsCount: 18,
        price: 149.99,
        isFree: false,
        requiresAuth: true,
        status: 'PUBLISHED',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center',
      },
      {
        title: 'Innovación Tecnológica 2024',
        slug: 'innovacion-tecnologica-2024',
        description: 'Las últimas tendencias en tecnología que están transformando el mundo. Blockchain, IoT, AR/VR y más.',
        shortDescription: 'Las últimas tendencias en tecnología',
        category: 'INNOVACION_TECNOLOGICA',
        difficulty: 'ADVANCED',
        durationHours: 20,
        lessonsCount: 25,
        price: 99.99,
        isFree: false,
        requiresAuth: true,
        status: 'PUBLISHED',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop&crop=center',
      },
    ];

    // Crear los nuevos cursos
    for (const courseData of newCourses) {
      await prisma.course.upsert({
        where: { slug: courseData.slug },
        update: courseData,
        create: courseData,
      });
    }

    console.log('✅ Nuevos cursos creados con categorías específicas');

    // Verificar estadísticas por categoría
    const categoryStats = await prisma.course.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
      where: {
        status: 'PUBLISHED',
      },
    });

    console.log('\n📊 Estadísticas por categoría:');
    categoryStats.forEach((stat) => {
      console.log(`- ${stat.category}: ${stat._count.id} curso(s)`);
    });

    // Verificar total de cursos
    const totalCourses = await prisma.course.count({
      where: {
        status: 'PUBLISHED',
      },
    });

    console.log(`\n📚 Total de cursos publicados: ${totalCourses}`);

    console.log('\n🎉 Categorías de cursos actualizadas exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Verificar la página /courses');
    console.log('2. Probar la navegación por categorías');
    console.log('3. Verificar que los filtros funcionen correctamente');

  } catch (error) {
    console.error('❌ Error actualizando categorías de cursos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCoursesCategories(); 