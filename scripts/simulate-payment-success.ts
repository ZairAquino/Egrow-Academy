import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function simulatePaymentSuccess() {
  try {
    console.log('🎉 [SIMULATE] Simulando notificación de pago exitoso...');

    const userEmail = 'solismartinezluisdavid@gmail.com';
    
    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      console.log('❌ [SIMULATE] Usuario no encontrado:', userEmail);
      return;
    }

    console.log('✅ [SIMULATE] Usuario encontrado:', user.email);
    console.log('📊 [SIMULATE] Nivel actual:', user.membershipLevel);

    if (user.subscriptions.length === 0) {
      console.log('❌ [SIMULATE] El usuario no tiene suscripciones activas');
      return;
    }

    const subscription = user.subscriptions[0];
    const payment = user.payments[0];

    console.log('\n🎯 [SIMULATE] Detalles de la suscripción:');
    console.log('  - ID:', subscription.id);
    console.log('  - Status:', subscription.status);
    console.log('  - Periodo actual hasta:', subscription.currentPeriodEnd);
    console.log('  - Stripe Subscription ID:', subscription.stripeSubscriptionId);

    if (payment) {
      console.log('\n💳 [SIMULATE] Detalles del pago:');
      console.log('  - ID:', payment.id);
      console.log('  - Status:', payment.status);
      console.log('  - Monto:', payment.amount, payment.currency);
      console.log('  - Fecha:', payment.createdAt);
    }

    console.log('\n🌐 [SIMULATE] Para ver la notificación de éxito:');
    console.log('  1. Ve a http://localhost:3000');
    console.log('  2. Inicia sesión con:', userEmail);
    console.log('  3. Ve a la URL: http://localhost:3000/?payment_success=true');
    console.log('  4. Verás la notificación toast de bienvenida premium');
    console.log('');
    console.log('📱 [SIMULATE] También puedes probar:');
    console.log('  - Ir a /subscription para ver el estado premium');
    console.log('  - Ir a /courses para ver acceso a cursos premium');
    console.log('  - Ver el perfil del usuario (esquina superior derecha)');
    console.log('  - Debería mostrar "Premium ⭐" en lugar de "Gratuito"');

    // Verificar cursos premium
    const premiumCourses = await prisma.course.findMany({
      where: { isFree: false }
    });

    console.log('\n📚 [SIMULATE] Cursos premium disponibles:', premiumCourses.length);
    premiumCourses.forEach(course => {
      console.log(`  - ${course.title} (${course.slug})`);
    });

    console.log('\n✅ [SIMULATE] ¡Simulación completada!');
    console.log('🎊 [SIMULATE] El usuario ahora tiene acceso premium completo');

  } catch (error) {
    console.error('❌ [SIMULATE] Error en la simulación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
simulatePaymentSuccess(); 