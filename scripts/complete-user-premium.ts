import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function completeUserPremium() {
  try {
    console.log('🎯 [PREMIUM] Completando proceso premium para el usuario...');

    const userEmail = 'solismartinezluisdavid@gmail.com';
    
    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      console.log('❌ [PREMIUM] Usuario no encontrado:', userEmail);
      return;
    }

    console.log('✅ [PREMIUM] Usuario encontrado:', user.email);
    console.log('📊 [PREMIUM] Estado actual:', user.membershipLevel);

    // Verificar si ya tiene suscripción activa
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE'
      }
    });

    if (existingSubscription) {
      console.log('⚠️ [PREMIUM] El usuario ya tiene una suscripción activa');
      console.log('  - ID:', existingSubscription.id);
      console.log('  - Status:', existingSubscription.status);
      return;
    }

    // Buscar o crear producto y precio
    let product = await prisma.product.findFirst({
      where: {
        stripeProductId: 'prod_test_premium'
      }
    });

    if (!product) {
      console.log('🔧 [PREMIUM] Creando producto premium...');
      product = await prisma.product.create({
        data: {
          stripeProductId: 'prod_test_premium',
          name: 'eGrow Academy Premium',
          description: 'Plan premium mensual',
          active: true,
          metadata: {
            test: true,
            createdBy: 'complete-premium-script'
          }
        }
      });
    }

    let price = await prisma.price.findFirst({
      where: {
        stripePriceId: 'price_test_premium'
      }
    });

    if (!price) {
      console.log('🔧 [PREMIUM] Creando precio premium...');
      price = await prisma.price.create({
        data: {
          stripePriceId: 'price_test_premium',
          active: true,
          currency: 'usd',
          type: 'RECURRING',
          unitAmount: 2999, // $29.99
          interval: 'MONTH',
          intervalCount: 1,
          productId: product.id,
          metadata: {
            test: true,
            createdBy: 'complete-premium-script'
          }
        }
      });
    }

    // Crear suscripción
    console.log('🔧 [PREMIUM] Creando suscripción premium...');
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        stripeSubscriptionId: 'sub_completed_' + Date.now(),
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        priceId: price.id,
        metadata: {
          test: true,
          completedBy: 'complete-premium-script',
          originalUser: userEmail
        }
      }
    });

    console.log('✅ [PREMIUM] Suscripción creada:', subscription.id);

    // Crear pago simulado
    console.log('🔧 [PREMIUM] Creando pago simulado...');
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        stripePaymentId: 'pi_completed_' + Date.now(),
        amount: 2999,
        currency: 'usd',
        status: 'SUCCEEDED',
        description: 'Suscripción Premium eGrow Academy',
        subscriptionId: subscription.id,
        metadata: {
          test: true,
          completedBy: 'complete-premium-script'
        }
      }
    });

    console.log('✅ [PREMIUM] Pago simulado creado:', payment.id);

    // Actualizar usuario a nivel premium
    console.log('🔧 [PREMIUM] Actualizando usuario a nivel PREMIUM...');
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        membershipLevel: 'PREMIUM',
        stripeCustomerId: 'cus_completed_' + Date.now()
      }
    });

    console.log('✅ [PREMIUM] Usuario actualizado a nivel PREMIUM');

    // Verificar cursos premium disponibles
    const premiumCourses = await prisma.course.findMany({
      where: {
        isFree: false
      }
    });

    console.log('📚 [PREMIUM] Cursos premium disponibles:', premiumCourses.length);

    // Asegurar que esté inscrito en todos los cursos premium
    for (const course of premiumCourses) {
      const existingEnrollment = await prisma.enrollment.findFirst({
        where: {
          userId: user.id,
          courseId: course.id
        }
      });

      if (!existingEnrollment) {
        await prisma.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            enrolledAt: new Date(),
            status: 'ACTIVE',
            progressPercentage: 0
          }
        });
        console.log(`  ✅ Inscrito en: ${course.title}`);
      } else {
        console.log(`  ⚠️ Ya inscrito en: ${course.title}`);
      }
    }

    console.log('\n🎉 [PREMIUM] ¡Proceso completado exitosamente!');
    console.log('📋 [PREMIUM] Resumen:');
    console.log(`  - Usuario: ${user.email}`);
    console.log(`  - Nuevo nivel: PREMIUM`);
    console.log(`  - Suscripción: ${subscription.id}`);
    console.log(`  - Pago: ${payment.id}`);
    console.log(`  - Cursos premium: ${premiumCourses.length}`);
    console.log('');
    console.log('🌐 [PREMIUM] El usuario ahora puede:');
    console.log('  1. Acceder a todos los cursos premium');
    console.log('  2. Ver su estado premium en el perfil');
    console.log('  3. Recibir notificaciones premium');
    console.log('  4. Acceder a recursos exclusivos');

  } catch (error) {
    console.error('❌ [PREMIUM] Error completando proceso premium:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
completeUserPremium(); 