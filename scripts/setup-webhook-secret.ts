import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupWebhookSecret() {
  try {
    console.log('🔧 Configurando Webhook Secret de Stripe...\n');

    console.log('📋 Pasos para configurar el webhook:');
    console.log('');
    console.log('1️⃣ Ve al Stripe Dashboard:');
    console.log('   https://dashboard.stripe.com/webhooks');
    console.log('');
    console.log('2️⃣ Haz clic en "Add endpoint"');
    console.log('');
    console.log('3️⃣ Configura el endpoint:');
    console.log('   URL: https://tu-dominio.vercel.app/api/webhooks/stripe');
    console.log('   (Reemplaza "tu-dominio" con tu dominio real de Vercel)');
    console.log('');
    console.log('4️⃣ Selecciona estos eventos:');
    console.log('   ✅ customer.subscription.created');
    console.log('   ✅ customer.subscription.updated');
    console.log('   ✅ customer.subscription.deleted');
    console.log('   ✅ invoice.payment_succeeded');
    console.log('   ✅ invoice.payment_failed');
    console.log('   ✅ checkout.session.completed');
    console.log('');
    console.log('5️⃣ Haz clic en "Add endpoint"');
    console.log('');
    console.log('6️⃣ Copia el "Signing secret" (empieza con whsec_)');
    console.log('');
    console.log('7️⃣ Agrega la variable de entorno:');
    console.log('   STRIPE_WEBHOOK_SECRET="whsec_tu_secret_aqui"');
    console.log('');
    console.log('8️⃣ En Vercel, ve a Settings > Environment Variables');
    console.log('   y agrega STRIPE_WEBHOOK_SECRET con el valor del secret');
    console.log('');
    console.log('9️⃣ Haz redeploy de la aplicación');
    console.log('');

    // Verificar configuración actual
    console.log('🔍 Verificando configuración actual...');
    
    const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
    const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
    
    console.log(`   STRIPE_SECRET_KEY: ${hasStripeKey ? '✅ Configurado' : '❌ No configurado'}`);
    console.log(`   STRIPE_WEBHOOK_SECRET: ${hasWebhookSecret ? '✅ Configurado' : '❌ No configurado'}`);
    
    if (!hasStripeKey) {
      console.log('\n⚠️  Necesitas configurar STRIPE_SECRET_KEY primero');
    }
    
    if (!hasWebhookSecret) {
      console.log('\n⚠️  Necesitas configurar STRIPE_WEBHOOK_SECRET');
      console.log('   Sigue los pasos arriba para obtener el webhook secret');
    }
    
    if (hasStripeKey && hasWebhookSecret) {
      console.log('\n✅ Configuración completa!');
      console.log('   El webhook está listo para recibir eventos de Stripe');
    }

    console.log('\n📚 Documentación adicional:');
    console.log('   https://stripe.com/docs/webhooks');
    console.log('   https://stripe.com/docs/webhooks/signatures');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupWebhookSecret()
  .then(() => {
    console.log('\n✅ Configuración completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 