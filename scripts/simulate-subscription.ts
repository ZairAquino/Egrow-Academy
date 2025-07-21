import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function simulateSubscription() {
  try {
    console.log('🚀 Simulando suscripción activa...');

    // Buscar un usuario existente
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: '@',
        },
      },
    });

    if (!user) {
      console.log('❌ No se encontró ningún usuario. Primero crea un usuario.');
      return;
    }

    console.log(`👤 Usuario encontrado: ${user.email}`);

    // Buscar un precio existente (crear uno si no existe)
    let price = await prisma.price.findFirst({
      where: {
        active: true,
        type: 'RECURRING',
      },
      include: {
        product: true,
      },
    });

    if (!price) {
      console.log('💰 Creando precio de prueba...');
      
      // Crear producto de prueba
      const product = await prisma.product.create({
        data: {
          stripeProductId: 'prod_test_subscription',
          name: 'Suscripción de Prueba',
          description: 'Suscripción para pruebas de desarrollo',
          active: true,
        },
      });

      // Crear precio de prueba
      price = await prisma.price.create({
        data: {
          stripePriceId: 'price_test_monthly',
          active: true,
          currency: 'usd',
          type: 'RECURRING',
          unitAmount: 1999, // $19.99
          interval: 'MONTH',
          intervalCount: 1,
          productId: product.id,
        },
        include: {
          product: true,
        },
      });
    }

    console.log(`💰 Precio encontrado: ${price.stripePriceId}`);

    // Verificar si ya tiene una suscripción activa
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        currentPeriodEnd: {
          gt: new Date(),
        },
      },
    });

    if (existingSubscription) {
      console.log('✅ El usuario ya tiene una suscripción activa');
      console.log(`📅 Válida hasta: ${existingSubscription.currentPeriodEnd}`);
      return;
    }

    // Crear suscripción de prueba
    const subscription = await prisma.subscription.create({
      data: {
        stripeSubscriptionId: `sub_test_${Date.now()}`,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        cancelAtPeriodEnd: false,
        userId: user.id,
        priceId: price.id,
        metadata: {
          test: true,
          createdBy: 'simulation-script',
        },
      },
      include: {
        price: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log('✅ Suscripción de prueba creada exitosamente!');
    console.log(`📅 Válida hasta: ${subscription.currentPeriodEnd}`);
    console.log(`💰 Plan: ${subscription.price.product.name}`);
    console.log(`💳 Precio: $${(subscription.price.unitAmount || 0) / 100}/mes`);

    // Actualizar el nivel de membresía del usuario
    await prisma.user.update({
      where: { id: user.id },
      data: {
        membershipLevel: 'PREMIUM',
      },
    });

    console.log('👤 Nivel de membresía actualizado a PREMIUM');

    // Crear inscripción automática en el curso de desarrollo web
    const course = await prisma.course.findUnique({
      where: { slug: 'desarrollo-web-fullstack' },
    });

    if (course) {
      const enrollment = await prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
        update: {
          status: 'ACTIVE',
        },
        create: {
          userId: user.id,
          courseId: course.id,
          status: 'ACTIVE',
          enrolledAt: new Date(),
        },
      });

      console.log('📚 Inscripción automática en el curso de desarrollo web');
    }

    console.log('\n🎉 Simulación completada!');
    console.log('El usuario ahora tiene:');
    console.log('- ✅ Suscripción activa');
    console.log('- ✅ Nivel de membresía PREMIUM');
    console.log('- ✅ Acceso a cursos premium');
    console.log('- ✅ Inscripción automática en cursos');

  } catch (error) {
    console.error('❌ Error simulando suscripción:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
simulateSubscription()
  .then(() => {
    console.log('🎉 Simulación completada exitosamente!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 