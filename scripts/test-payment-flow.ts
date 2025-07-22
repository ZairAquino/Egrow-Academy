import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPaymentFlow() {
  try {
    console.log('🧪 [TEST] Iniciando prueba del flujo de pago...');

    // Buscar un usuario de prueba
    const testUser = await prisma.user.findFirst({
      where: {
        email: {
          contains: '@test.com'
        }
      }
    });

    if (!testUser) {
      console.log('❌ [TEST] No se encontró usuario de prueba');
      return;
    }

    console.log('✅ [TEST] Usuario encontrado:', testUser.email);

    // Verificar si ya tiene una suscripción activa
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: testUser.id,
        status: 'ACTIVE'
      }
    });

    if (existingSubscription) {
      console.log('⚠️ [TEST] El usuario ya tiene una suscripción activa');
      console.log('📊 [TEST] Detalles de la suscripción:');
      console.log('  - ID:', existingSubscription.id);
      console.log('  - Status:', existingSubscription.status);
      console.log('  - Periodo actual hasta:', existingSubscription.currentPeriodEnd);
      return;
    }

    // Crear un producto de prueba si no existe
    let testProduct = await prisma.product.findFirst({
      where: {
        stripeProductId: 'prod_test_premium'
      }
    });

    if (!testProduct) {
      console.log('🔧 [TEST] Creando producto de prueba...');
      testProduct = await prisma.product.create({
        data: {
          stripeProductId: 'prod_test_premium',
          name: 'eGrow Academy Premium',
          description: 'Plan premium de prueba',
          active: true,
          metadata: {
            test: true,
            createdBy: 'test-script'
          }
        }
      });
      console.log('✅ [TEST] Producto de prueba creado:', testProduct.id);
    }

    // Crear un precio de prueba si no existe
    let testPrice = await prisma.price.findFirst({
      where: {
        stripePriceId: 'price_test_premium'
      }
    });

    if (!testPrice) {
      console.log('🔧 [TEST] Creando precio de prueba...');
      testPrice = await prisma.price.create({
        data: {
          stripePriceId: 'price_test_premium',
          active: true,
          currency: 'usd',
          type: 'RECURRING',
          unitAmount: 2999, // $29.99
          interval: 'MONTH',
          intervalCount: 1,
          productId: testProduct.id,
          metadata: {
            test: true,
            createdBy: 'test-script'
          }
        }
      });
      console.log('✅ [TEST] Precio de prueba creado:', testPrice.id);
    }

    // Crear una suscripción de prueba
    console.log('🔧 [TEST] Creando suscripción de prueba...');
    
    const testSubscription = await prisma.subscription.create({
      data: {
        userId: testUser.id,
        stripeSubscriptionId: 'sub_test_' + Date.now(),
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        priceId: testPrice.id,
        metadata: {
          test: true,
          createdBy: 'test-script'
        }
      }
    });

    console.log('✅ [TEST] Suscripción de prueba creada:', testSubscription.id);

    // Actualizar el usuario para reflejar el estado premium
    await prisma.user.update({
      where: { id: testUser.id },
      data: { membershipLevel: 'PREMIUM' }
    });

    console.log('✅ [TEST] Usuario actualizado a nivel PREMIUM');

    // Verificar el acceso a cursos premium
    const premiumCourses = await prisma.course.findMany({
      where: {
        isFree: false
      }
    });

    console.log('📚 [TEST] Cursos premium disponibles:', premiumCourses.length);
    premiumCourses.forEach(course => {
      console.log(`  - ${course.title} (${course.slug})`);
    });

    // Crear inscripciones automáticas en cursos premium
    console.log('🎯 [TEST] Creando inscripciones en cursos premium...');
    
    for (const course of premiumCourses) {
      const existingEnrollment = await prisma.enrollment.findFirst({
        where: {
          userId: testUser.id,
          courseId: course.id
        }
      });

      if (!existingEnrollment) {
        await prisma.enrollment.create({
          data: {
            userId: testUser.id,
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

    console.log('🎉 [TEST] Flujo de pago simulado exitosamente!');
    console.log('📋 [TEST] Resumen:');
    console.log(`  - Usuario: ${testUser.email}`);
    console.log(`  - Nivel: PREMIUM`);
    console.log(`  - Suscripción: ${testSubscription.id}`);
    console.log(`  - Cursos premium: ${premiumCourses.length}`);
    console.log('');
    console.log('🌐 [TEST] Ahora puedes probar:');
    console.log('  1. Ir a http://localhost:3000');
    console.log('  2. Iniciar sesión con el usuario de prueba');
    console.log('  3. Verificar que tiene acceso premium');
    console.log('  4. Acceder a cursos premium');

  } catch (error) {
    console.error('❌ [TEST] Error en el flujo de pago:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el test
testPaymentFlow(); 