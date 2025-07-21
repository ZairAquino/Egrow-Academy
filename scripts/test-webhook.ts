import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testWebhook() {
  try {
    console.log('🧪 Probando webhook de Stripe...\n');

    console.log('🔍 Verificando configuración:');
    const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
    const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
    
    console.log(`   STRIPE_WEBHOOK_SECRET: ${hasWebhookSecret ? '✅ Configurado' : '❌ No configurado'}`);
    console.log(`   STRIPE_SECRET_KEY: ${hasStripeKey ? '✅ Configurado' : '❌ No configurado'}`);
    
    if (!hasWebhookSecret || !hasStripeKey) {
      console.log('\n⚠️  Necesitas configurar las variables de entorno primero');
      return;
    }

    console.log('\n📋 Pasos para probar el webhook:');
    console.log('');
    console.log('1️⃣ Ve al Stripe Dashboard:');
    console.log('   https://dashboard.stripe.com/webhooks');
    console.log('');
    console.log('2️⃣ Selecciona tu webhook');
    console.log('');
    console.log('3️⃣ Haz clic en "Send test webhook"');
    console.log('');
    console.log('4️⃣ Selecciona un evento de prueba:');
    console.log('   - customer.subscription.created');
    console.log('   - checkout.session.completed');
    console.log('');
    console.log('5️⃣ Haz clic en "Send test webhook"');
    console.log('');
    console.log('6️⃣ Verifica los logs en Vercel:');
    console.log('   https://vercel.com/dashboard/egrow/egrow-academy/functions');
    console.log('');

    // Verificar productos y precios en la base de datos
    console.log('🔍 Verificando productos en la base de datos:');
    
    const products = await prisma.product.findMany({
      include: {
        prices: true,
      },
    });

    console.log(`   Productos encontrados: ${products.length}`);
    
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (${product.prices.length} precios)`);
    });

    if (products.length === 0) {
      console.log('\n⚠️  No hay productos configurados');
      console.log('   Ejecuta: npx tsx scripts/setup-stripe-products.ts');
    }

    // Verificar suscripciones
    console.log('\n🔍 Verificando suscripciones:');
    
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: { email: true, firstName: true, lastName: true }
        },
        price: {
          include: { product: true }
        }
      }
    });

    console.log(`   Suscripciones encontradas: ${subscriptions.length}`);
    
    subscriptions.forEach((subscription, index) => {
      console.log(`   ${index + 1}. ${subscription.user.firstName} ${subscription.user.lastName} - ${subscription.price.product.name} (${subscription.status})`);
    });

    console.log('\n✅ Prueba completada!');
    console.log('\n📚 Recursos adicionales:');
    console.log('   https://stripe.com/docs/webhooks/testing');
    console.log('   https://stripe.com/docs/webhooks/signatures');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testWebhook()
  .then(() => {
    console.log('\n✅ Prueba completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 