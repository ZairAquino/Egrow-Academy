import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

async function checkTestPayment() {
  try {
    console.log('🔍 Verificando pago de prueba para aquinozair3@gmail.com...');

    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email: 'aquinozair3@gmail.com' },
      select: { id: true, email: true, firstName: true, lastName: true }
    });

    if (!user) {
      console.log('❌ Usuario aquinozair3@gmail.com no encontrado');
      return;
    }

    console.log('✅ Usuario encontrado:', user.email);

    // Buscar pagos en Stripe para este usuario
    const payments = await stripe.paymentIntents.list({
      limit: 10,
      created: {
        gte: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60), // Últimos 30 días
      },
    });

    console.log(`📊 Encontrados ${payments.data.length} pagos en Stripe`);

    // Filtrar pagos del usuario de prueba
    const userPayments = payments.data.filter(payment => 
      payment.metadata?.userEmail === 'aquinozair3@gmail.com' ||
      payment.metadata?.userId === user.id
    );

    console.log(`📊 Encontrados ${userPayments.length} pagos del usuario de prueba`);

    // Verificar cada pago
    for (const payment of userPayments) {
      console.log(`\n🔍 Verificando pago: ${payment.id}`);
      console.log(`   Estado: ${payment.status}`);
      console.log(`   Monto: ${payment.amount} ${payment.currency}`);
      console.log(`   Creado: ${new Date(payment.created * 1000).toLocaleString()}`);

      // Verificar si ya existe en la base de datos
      const existingPayment = await prisma.payment.findUnique({
        where: { stripePaymentId: payment.id }
      });

      if (existingPayment) {
        console.log(`   ✅ Ya existe en la base de datos`);
      } else {
        console.log(`   ❌ NO existe en la base de datos`);
        
        // Registrar el pago si está exitoso
        if (payment.status === 'succeeded') {
          try {
            await prisma.payment.create({
              data: {
                stripePaymentId: payment.id,
                amount: payment.amount,
                currency: payment.currency,
                status: 'SUCCEEDED',
                paymentMethod: payment.payment_method_types?.[0] || 'card',
                description: payment.metadata?.description || 'Pago de prueba',
                metadata: payment.metadata,
                userId: user.id,
                courseId: payment.metadata?.courseId || null,
                subscriptionId: payment.metadata?.subscriptionId || null,
              },
            });
            console.log(`   ✅ Pago registrado exitosamente en la base de datos`);
          } catch (error) {
            console.error(`   ❌ Error registrando pago:`, error);
          }
        }
      }
    }

    // Mostrar todos los pagos del usuario en la base de datos
    const dbPayments = await prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`\n📊 Pagos del usuario en la base de datos: ${dbPayments.length}`);
    dbPayments.forEach(payment => {
      console.log(`   - ${payment.stripePaymentId}: ${payment.status} - $${payment.amount/100} ${payment.currency}`);
    });

  } catch (error) {
    console.error('❌ Error verificando pagos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTestPayment(); 