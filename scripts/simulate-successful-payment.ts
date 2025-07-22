import { PrismaClient } from '@prisma/client';
import { stripe } from '../src/lib/stripe';

const prisma = new PrismaClient();

async function simulateSuccessfulPayment() {
  try {
    console.log('🎯 SIMULANDO PAGO EXITOSO PARA USUARIO DE PRUEBA');
    console.log('================================================');
    console.log('');

    // Buscar el usuario de prueba
    const testUser = await prisma.user.findUnique({
      where: { email: 'testpremium@test.com' }
    });

    if (!testUser) {
      console.log('❌ Usuario testpremium@test.com no encontrado');
      console.log('💡 Ejecuta primero: npx tsx scripts/create-test-user-premium.ts');
      return;
    }

    console.log('👤 Usuario encontrado:');
    console.log(`  📧 Email: ${testUser.email}`);
    console.log(`  🆔 ID: ${testUser.id}`);
    console.log(`  📊 Nivel actual: ${testUser.membershipLevel}`);
    console.log('');

    // Verificar si ya tiene suscripción
    const existingSubscription = await prisma.subscription.findFirst({
      where: { userId: testUser.id }
    });

    if (existingSubscription) {
      console.log('⚠️ El usuario ya tiene una suscripción activa:');
      console.log(`  💳 ID: ${existingSubscription.stripeSubscriptionId}`);
      console.log(`  📊 Estado: ${existingSubscription.status}`);
      console.log(`  📅 Período: ${existingSubscription.currentPeriodStart?.toLocaleDateString()} - ${existingSubscription.currentPeriodEnd?.toLocaleDateString()}`);
      console.log('');
      console.log('✅ El usuario ya es PREMIUM y puede acceder a todos los cursos');
      return;
    }

    console.log('🔄 Simulando proceso de pago...');
    console.log('');

    // Crear un registro de pago simulado
    const payment = await prisma.payment.create({
      data: {
        userId: testUser.id,
        stripePaymentId: `pi_simulated_${Date.now()}`,
        amount: 699, // $6.99 en centavos
        currency: 'usd',
        status: 'SUCCEEDED',
        metadata: {
          planId: 'monthly',
          planName: 'Plan Mensual',
          simulated: true
        }
      }
    });

    console.log('💰 Pago simulado creado:');
    console.log(`  💰 ID: ${payment.stripePaymentId}`);
    console.log(`  💵 Monto: $${payment.amount / 100}`);
    console.log(`  📊 Estado: ${payment.status}`);
    console.log('');

    // Crear un Product simulado primero
    const product = await prisma.product.create({
      data: {
        stripeProductId: `prod_simulated_${Date.now()}`,
        name: 'Plan Mensual - Simulado',
        description: 'Plan mensual de eGrow Academy (simulado)',
        active: true,
        metadata: {
          planId: 'monthly',
          simulated: true
        }
      }
    });

    // Crear un Price simulado
    const price = await prisma.price.create({
      data: {
        stripePriceId: `price_simulated_${Date.now()}`,
        productId: product.id,
        active: true,
        currency: 'usd',
        type: 'RECURRING',
        unitAmount: 699, // $6.99 en centavos
        interval: 'MONTH',
        intervalCount: 1,
        metadata: {
          planId: 'monthly',
          planName: 'Plan Mensual',
          simulated: true
        }
      }
    });

    // Crear una suscripción simulado
    const subscription = await prisma.subscription.create({
      data: {
        userId: testUser.id,
        stripeSubscriptionId: `sub_simulated_${Date.now()}`,
        priceId: price.id,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        metadata: {
          planId: 'monthly',
          planName: 'Plan Mensual',
          simulated: true
        }
      }
    });

    console.log('💳 Suscripción simulada creada:');
    console.log(`  💳 ID: ${subscription.stripeSubscriptionId}`);
    console.log(`  📊 Estado: ${subscription.status}`);
    console.log(`  📅 Período: ${subscription.currentPeriodStart.toLocaleDateString()} - ${subscription.currentPeriodEnd.toLocaleDateString()}`);
    console.log('');

    // Actualizar el usuario a PREMIUM
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { membershipLevel: 'PREMIUM' }
    });

    console.log('✅ Usuario actualizado a PREMIUM:');
    console.log(`  📧 Email: ${updatedUser.email}`);
    console.log(`  📊 Nuevo nivel: ${updatedUser.membershipLevel}`);
    console.log('');

    console.log('🎉 SIMULACIÓN COMPLETADA EXITOSAMENTE');
    console.log('=====================================');
    console.log('');
    console.log('📋 PRÓXIMOS PASOS:');
    console.log('1. Ve a: http://localhost:3001/login');
    console.log('2. Inicia sesión con: testpremium@test.com / test123');
    console.log('3. Ve a: http://localhost:3001/curso/desarrollo-web-fullstack');
    console.log('4. Verifica que aparezca la barra de progreso');
    console.log('5. Confirma que el diseño sea igual al curso de LLMs');

  } catch (error) {
    console.error('❌ Error en la simulación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simulateSuccessfulPayment(); 