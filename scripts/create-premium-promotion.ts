import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createPremiumPromotion() {
  try {
    console.log('🚀 Creando promoción de suscripción premium...');

    const promotion = await prisma.promotion.create({
      data: {
        type: 'PREMIUM_SUBSCRIPTION',
        title: '✨ ¡Únete a eGrow Academy Premium!',
        description: 'Accede a todos los cursos, recursos exclusivos y certificados',
        ctaText: 'Suscribirse',
        ctaUrl: '/subscription',
        isActive: true,
        priority: 10, // Alta prioridad
        targetAudience: 'NON_PREMIUM',
        startDate: new Date(),
        // Sin fecha de fin para que sea permanente
      },
    });

    console.log('✅ Promoción creada exitosamente:');
    console.log('ID:', promotion.id);
    console.log('Título:', promotion.title);
    console.log('URL:', promotion.ctaUrl);
    console.log('Prioridad:', promotion.priority);

    // Crear también una promoción de ejemplo para nuevos cursos
    const newCoursePromotion = await prisma.promotion.create({
      data: {
        type: 'NEW_COURSE',
        title: '🎯 Nuevo curso disponible',
        description: 'Descubre nuestro último curso y mejora tus habilidades',
        ctaText: 'Ver cursos',
        ctaUrl: '/courses',
        isActive: true,
        priority: 5,
        targetAudience: 'ALL',
        startDate: new Date(),
      },
    });

    console.log('✅ Promoción de nuevo curso creada:', newCoursePromotion.title);

  } catch (error) {
    console.error('❌ Error creando promoción:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createPremiumPromotion(); 