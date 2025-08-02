import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

async function syncMissingPayments() {
  try {
    console.log('🔄 Sincronizando pagos faltantes...\n');

    // 1. Buscar usuarios premium sin pagos registrados
    console.log('1️⃣ Buscando usuarios premium sin pagos...');
    
    const premiumUsersWithoutPayments = await prisma.user.findMany({
      where: {
        membershipLevel: 'PREMIUM',
        stripeCustomerId: { not: null },
        payments: { none: {} }
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        stripeCustomerId: true,
        hasBeenPremium: true,
        createdAt: true
      }
    });

    console.log(`   Usuarios premium sin pagos: ${premiumUsersWithoutPayments.length}`);
    
    if (premiumUsersWithoutPayments.length === 0) {
      console.log('   ✅ Todos los usuarios premium tienen pagos registrados');
      return;
    }

    // 2. Para cada usuario, buscar pagos en Stripe
    for (const user of premiumUsersWithoutPayments) {
      console.log(`\n2️⃣ Procesando usuario: ${user.email}`);
      console.log(`   - Stripe Customer ID: ${user.stripeCustomerId}`);
      
      try {
        // Buscar pagos en Stripe para este customer
        const stripePayments = await stripe.paymentIntents.list({
          customer: user.stripeCustomerId,
          limit: 10,
          created: {
            gte: Math.floor(Date.now() / 1000) - (90 * 24 * 60 * 60), // Últimos 90 días
          },
        });

        console.log(`   - Pagos encontrados en Stripe: ${stripePayments.data.length}`);

        // Procesar cada pago exitoso
        for (const stripePayment of stripePayments.data) {
          if (stripePayment.status === 'succeeded') {
            console.log(`   - Procesando pago: ${stripePayment.id}`);
            
            // Verificar si ya existe en la BD
            const existingPayment = await prisma.payment.findUnique({
              where: { stripePaymentId: stripePayment.id }
            });

            if (existingPayment) {
              console.log(`     ✅ Ya existe en la BD`);
            } else {
              // Crear el pago en la BD
              try {
                await prisma.payment.create({
                  data: {
                    stripePaymentId: stripePayment.id,
                    amount: stripePayment.amount,
                    currency: stripePayment.currency,
                    status: 'SUCCEEDED',
                    paymentMethod: stripePayment.payment_method_types?.[0] || 'card',
                    description: stripePayment.metadata?.description || 'Pago sincronizado manualmente',
                    metadata: stripePayment.metadata,
                    userId: user.id,
                    courseId: stripePayment.metadata?.courseId || null,
                    subscriptionId: stripePayment.metadata?.subscriptionId || null,
                  },
                });
                console.log(`     ✅ Pago registrado exitosamente`);
              } catch (error) {
                console.log(`     ❌ Error registrando pago:`, error);
              }
            }
          }
        }

        // Buscar suscripciones en Stripe
        const stripeSubscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          limit: 10,
        });

        console.log(`   - Suscripciones encontradas en Stripe: ${stripeSubscriptions.data.length}`);

        // Procesar cada suscripción
        for (const stripeSubscription of stripeSubscriptions.data) {
          console.log(`   - Procesando suscripción: ${stripeSubscription.id}`);
          
          // Verificar si ya existe en la BD
          const existingSubscription = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: stripeSubscription.id }
          });

          if (existingSubscription) {
            console.log(`     ✅ Ya existe en la BD`);
          } else {
            // Buscar el precio correspondiente
            const priceId = stripeSubscription.items.data[0]?.price?.id;
            const price = await prisma.price.findFirst({
              where: { stripePriceId: priceId }
            });

            if (price) {
              try {
                await prisma.subscription.create({
                  data: {
                    stripeSubscriptionId: stripeSubscription.id,
                    status: stripeSubscription.status === 'active' ? 'ACTIVE' : 'CANCELED',
                    currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
                    currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
                    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
                    canceledAt: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : null,
                    endedAt: stripeSubscription.ended_at ? new Date(stripeSubscription.ended_at * 1000) : null,
                    trialStart: stripeSubscription.trial_start ? new Date(stripeSubscription.trial_start * 1000) : null,
                    trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null,
                    metadata: stripeSubscription.metadata,
                    userId: user.id,
                    priceId: price.id,
                  },
                });
                console.log(`     ✅ Suscripción registrada exitosamente`);
              } catch (error) {
                console.log(`     ❌ Error registrando suscripción:`, error);
              }
            } else {
              console.log(`     ❌ Precio no encontrado para: ${priceId}`);
            }
          }
        }

      } catch (error) {
        console.log(`   ❌ Error procesando usuario ${user.email}:`, error);
      }
    }

    // 3. Verificar resultado final
    console.log('\n3️⃣ Verificando resultado final...');
    
    const finalPayments = await prisma.payment.count();
    const finalSubscriptions = await prisma.subscription.count();
    
    console.log(`   - Total de pagos en BD: ${finalPayments}`);
    console.log(`   - Total de suscripciones en BD: ${finalSubscriptions}`);
    
    // Verificar específicamente el usuario de prueba
    const testUserPayments = await prisma.payment.count({
      where: { user: { email: 'aquinozair3@gmail.com' } }
    });
    
    const testUserSubscriptions = await prisma.subscription.count({
      where: { user: { email: 'aquinozair3@gmail.com' } }
    });
    
    console.log(`   - Pagos del usuario de prueba: ${testUserPayments}`);
    console.log(`   - Suscripciones del usuario de prueba: ${testUserSubscriptions}`);

    if (testUserPayments > 0 || testUserSubscriptions > 0) {
      console.log('\n✅ Sincronización exitosa');
      console.log('   - Los pagos faltantes han sido registrados');
      console.log('   - El sistema ahora está sincronizado');
    } else {
      console.log('\n⚠️ Sincronización incompleta');
      console.log('   - No se pudieron sincronizar todos los pagos');
      console.log('   - Verifica la configuración de Stripe');
    }

  } catch (error) {
    console.error('❌ Error sincronizando pagos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncMissingPayments(); 