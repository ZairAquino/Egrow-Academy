import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createVideosProfesionalesCourse() {
  try {
    console.log('🎬 Creando curso de videos profesionales con IA...');

    const course = await prisma.course.create({
      data: {
        title: 'Aprende a crear videos profesionales con IA',
        slug: 'videos-profesionales-ia',
        description: 'Domina las herramientas de IA para crear contenido audiovisual profesional. Aprende a generar videos, editar con inteligencia artificial y optimizar para diferentes plataformas.',
        shortDescription: 'Crea contenido audiovisual profesional usando inteligencia artificial',
        imageUrl: '/images/15.png',
        price: 0, // El precio se maneja a través de Stripe
        isFree: false,
        requiresAuth: true,
        difficulty: 'INTERMEDIATE',
        durationHours: 18,
        lessonsCount: 0, // Se actualizará cuando se agreguen las lecciones
        studentsCount: 0,
        rating: 0,
        status: 'PUBLISHED',
        category: 'MARKETING_DIGITAL',
      },
    });

    console.log('✅ Curso creado exitosamente:', {
      id: course.id,
      title: course.title,
      slug: course.slug,
      category: course.category,
    });

    // Crear el producto en Stripe (esto se haría manualmente en el dashboard de Stripe)
    console.log('📝 Nota: Recuerda crear el producto en Stripe con el priceId: price_videos_profesionales_ia');

  } catch (error) {
    console.error('❌ Error creando el curso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createVideosProfesionalesCourse(); 