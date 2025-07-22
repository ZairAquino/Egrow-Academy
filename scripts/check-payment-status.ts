import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPaymentStatus() {
  try {
    console.log('🔍 VERIFICANDO ESTADO DE PAGOS Y SUSCRIPCIONES');
    console.log('==============================================');
    console.log('');

    // Verificar usuarios premium
    const premiumUsers = await prisma.user.findMany({
      where: { membershipLevel: 'PREMIUM' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true,
        createdAt: true,
        subscriptions: {
          select: {
            id: true,
            stripeSubscriptionId: true,
            status: true,
            currentPeriodStart: true,
            currentPeriodEnd: true,
            createdAt: true,
          }
        }
      }
    });

    console.log('👥 USUARIOS PREMIUM:', premiumUsers.length);
    premiumUsers.forEach(user => {
      console.log(`  📧 ${user.email} (${user.firstName} ${user.lastName})`);
      console.log(`     🆔 ${user.id}`);
      console.log(`     📊 Nivel: ${user.membershipLevel}`);
      console.log(`     📅 Creado: ${user.createdAt.toLocaleDateString()}`);
      
      if (user.subscriptions.length > 0) {
        user.subscriptions.forEach(sub => {
          console.log(`     💳 Suscripción: ${sub.stripeSubscriptionId}`);
          console.log(`     📈 Estado: ${sub.status}`);
          console.log(`     🗓️ Período: ${sub.currentPeriodStart?.toLocaleDateString()} - ${sub.currentPeriodEnd?.toLocaleDateString()}`);
        });
      } else {
        console.log(`     ⚠️ Sin suscripciones registradas`);
      }
      console.log('');
    });

    // Verificar todas las suscripciones
    const allSubscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            membershipLevel: true,
          }
        }
      }
    });

    console.log('💳 TODAS LAS SUSCRIPCIONES:', allSubscriptions.length);
    allSubscriptions.forEach(sub => {
      console.log(`  💳 ${sub.stripeSubscriptionId}`);
      console.log(`     👤 Usuario: ${sub.user.email}`);
      console.log(`     📊 Estado: ${sub.status}`);
      console.log(`     📅 Creada: ${sub.createdAt.toLocaleDateString()}`);
      console.log(`     🗓️ Período: ${sub.currentPeriodStart?.toLocaleDateString()} - ${sub.currentPeriodEnd?.toLocaleDateString()}`);
      console.log('');
    });

    // Verificar pagos
    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    console.log('💰 TODOS LOS PAGOS:', payments.length);
    payments.forEach(payment => {
      console.log(`  💰 ${payment.stripePaymentId}`);
      console.log(`     👤 Usuario: ${payment.user.email}`);
      console.log(`     📊 Estado: ${payment.status}`);
      console.log(`     💵 Monto: $${payment.amount}`);
      console.log(`     📅 Creado: ${payment.createdAt.toLocaleDateString()}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error verificando estado de pagos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPaymentStatus(); 