import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanTestSubscriptions() {
  try {
    console.log('🧹 Limpiando suscripciones de prueba...');

    // Eliminar suscripciones de prueba
    const deletedSubscriptions = await prisma.subscription.deleteMany({
      where: {
        stripeSubscriptionId: {
          startsWith: 'sub_test_',
        },
      },
    });

    console.log(`🗑️ Eliminadas ${deletedSubscriptions.count} suscripciones de prueba`);

    // Eliminar precios de prueba
    const deletedPrices = await prisma.price.deleteMany({
      where: {
        stripePriceId: {
          startsWith: 'price_test_',
        },
      },
    });

    console.log(`🗑️ Eliminados ${deletedPrices.count} precios de prueba`);

    // Eliminar productos de prueba
    const deletedProducts = await prisma.product.deleteMany({
      where: {
        stripeProductId: {
          startsWith: 'prod_test_',
        },
      },
    });

    console.log(`🗑️ Eliminados ${deletedProducts.count} productos de prueba`);

    // Resetear nivel de membresía de usuarios que solo tenían suscripciones de prueba
    const usersToReset = await prisma.user.findMany({
      where: {
        membershipLevel: 'PREMIUM',
        subscriptions: {
          none: {
            status: 'ACTIVE',
            currentPeriodEnd: {
              gt: new Date(),
            },
          },
        },
      },
    });

    for (const user of usersToReset) {
      await prisma.user.update({
        where: { id: user.id },
        data: { membershipLevel: 'FREE' },
      });
      console.log(`👤 Usuario ${user.email} reseteado a nivel FREE`);
    }

    console.log('✅ Limpieza completada exitosamente!');

  } catch (error) {
    console.error('❌ Error limpiando suscripciones de prueba:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
cleanTestSubscriptions()
  .then(() => {
    console.log('🎉 Limpieza completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 