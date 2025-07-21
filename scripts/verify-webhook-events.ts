import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyWebhookEvents() {
  try {
    console.log('🔍 Verificando eventos del webhook...\n');

    console.log('📋 Eventos requeridos para eGrow Academy:');
    console.log('');
    console.log('✅ customer.subscription.created');
    console.log('   - Se dispara cuando se crea una nueva suscripción');
    console.log('   - Actualiza el estado del usuario a PREMIUM');
    console.log('');
    console.log('✅ customer.subscription.updated');
    console.log('   - Se dispara cuando se actualiza una suscripción');
    console.log('   - Sincroniza cambios de estado, fechas, etc.');
    console.log('');
    console.log('✅ customer.subscription.deleted');
    console.log('   - Se dispara cuando se cancela una suscripción');
    console.log('   - Cambia el usuario de PREMIUM a FREE');
    console.log('');
    console.log('✅ invoice.payment_succeeded');
    console.log('   - Se dispara cuando se procesa un pago exitoso');
    console.log('   - Puede enviar emails de confirmación');
    console.log('');
    console.log('✅ invoice.payment_failed');
    console.log('   - Se dispara cuando falla un pago');
    console.log('   - Puede enviar notificaciones de pago fallido');
    console.log('');
    console.log('✅ checkout.session.completed');
    console.log('   - Se dispara cuando se completa un checkout');
    console.log('   - Crea la suscripción en la base de datos');
    console.log('');

    console.log('🔧 Pasos para verificar/actualizar:');
    console.log('');
    console.log('1️⃣ Ve a https://dashboard.stripe.com/webhooks');
    console.log('2️⃣ Haz clic en tu endpoint "brilliant-harmony"');
    console.log('3️⃣ Verifica que tenga estos 6 eventos configurados');
    console.log('4️⃣ Si falta alguno, haz clic en "Add events"');
    console.log('5️⃣ Actualiza la URL si es necesario:');
    console.log('   https://egrow-academy-r3b1rqqh1-egrow.vercel.app/api/webhooks/stripe');
    console.log('');

    // Verificar configuración actual
    console.log('🔍 Verificando configuración actual:');
    const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
    const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
    
    console.log(`   STRIPE_WEBHOOK_SECRET: ${hasWebhookSecret ? '✅ Configurado' : '❌ No configurado'}`);
    console.log(`   STRIPE_SECRET_KEY: ${hasStripeKey ? '✅ Configurado' : '❌ No configurado'}`);
    
    if (!hasWebhookSecret) {
      console.log('\n⚠️  STRIPE_WEBHOOK_SECRET no está configurado localmente');
      console.log('   Esto es normal si solo está configurado en Vercel');
    }

    // Verificar productos en la base de datos
    console.log('\n🔍 Verificando productos en la base de datos:');
    
    const products = await prisma.product.findMany({
      include: {
        prices: true,
      },
    });

    console.log(`   Productos encontrados: ${products.length}`);
    
    if (products.length > 0) {
      products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.prices.length} precios)`);
        product.prices.forEach((price, priceIndex) => {
          console.log(`      - ${priceIndex + 1}. $${price.unitAmount ? price.unitAmount / 100 : 'N/A'}/${price.interval}`);
        });
      });
    } else {
      console.log('   ⚠️  No hay productos configurados');
      console.log('   Ejecuta: npx tsx scripts/setup-stripe-products.ts');
    }

    console.log('\n✅ Verificación completada!');
    console.log('\n📚 Próximos pasos:');
    console.log('   1. Actualizar URL del webhook a Vercel');
    console.log('   2. Verificar eventos configurados');
    console.log('   3. Probar webhook con evento de prueba');
    console.log('   4. Crear productos y precios en Stripe');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyWebhookEvents()
  .then(() => {
    console.log('\n✅ Verificación completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 