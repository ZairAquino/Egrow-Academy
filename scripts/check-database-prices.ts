import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabasePrices() {
  try {
    console.log('🔍 VERIFICANDO PRECIOS EN LA BASE DE DATOS');
    console.log('==========================================');
    console.log('');

    // Verificar productos
    console.log('📦 PRODUCTOS:');
    console.log('-------------');
    const products = await prisma.product.findMany();
    
    products.forEach(product => {
      console.log(`  📦 ${product.name}:`);
      console.log(`    🆔 ID: ${product.id}`);
      console.log(`    🆔 Stripe ID: ${product.stripeProductId}`);
      console.log(`    📝 Descripción: ${product.description || 'Sin descripción'}`);
      console.log(`    ✅ Activo: ${product.active}`);
      console.log('');
    });

    // Verificar precios
    console.log('💰 PRECIOS:');
    console.log('-----------');
    const prices = await prisma.price.findMany({
      include: {
        product: true
      }
    });
    
    prices.forEach(price => {
      const amount = price.unitAmount ? price.unitAmount / 100 : 0;
      console.log(`  💵 ${price.product.name}:`);
      console.log(`    🆔 ID: ${price.id}`);
      console.log(`    🆔 Stripe ID: ${price.stripePriceId}`);
      console.log(`    💰 Monto: $${amount}`);
      console.log(`    💱 Moneda: ${price.currency}`);
      console.log(`    📅 Tipo: ${price.type}`);
      console.log(`    🔄 Intervalo: ${price.interval}`);
      console.log(`    📊 Cantidad de intervalos: ${price.intervalCount}`);
      console.log(`    ✅ Activo: ${price.active}`);
      console.log('');
    });

    // Verificar suscripciones y sus precios
    console.log('💳 SUSCRIPCIONES Y SUS PRECIOS:');
    console.log('--------------------------------');
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        },
        price: {
          include: {
            product: true
          }
        }
      }
    });
    
    subscriptions.forEach(subscription => {
      const amount = subscription.price.unitAmount ? subscription.price.unitAmount / 100 : 0;
      console.log(`  💳 ${subscription.stripeSubscriptionId}:`);
      console.log(`    👤 Usuario: ${subscription.user.email}`);
      console.log(`    📦 Producto: ${subscription.price.product.name}`);
      console.log(`    💰 Precio: $${amount}`);
      console.log(`    📅 Intervalo: ${subscription.price.interval}`);
      console.log(`    📊 Estado: ${subscription.status}`);
      console.log(`    🗓️ Período: ${subscription.currentPeriodStart?.toLocaleDateString()} - ${subscription.currentPeriodEnd?.toLocaleDateString()}`);
      console.log('');
    });

    // Verificar pagos
    console.log('💸 PAGOS:');
    console.log('----------');
    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    payments.forEach(payment => {
      const amount = payment.amount ? payment.amount / 100 : 0;
      console.log(`  💸 ${payment.stripePaymentId}:`);
      console.log(`    👤 Usuario: ${payment.user.email}`);
      console.log(`    💰 Monto: $${amount}`);
      console.log(`    💱 Moneda: ${payment.currency}`);
      console.log(`    📊 Estado: ${payment.status}`);
      console.log(`    📅 Fecha: ${payment.createdAt.toLocaleDateString()}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error verificando precios en la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabasePrices(); 