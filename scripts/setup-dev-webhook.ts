import Stripe from 'stripe';
import { config } from 'dotenv';

// Cargar variables de entorno
config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

async function setupDevWebhook() {
  try {
    console.log('🔧 Configurando webhook de desarrollo...');
    
    // Primero, listar webhooks existentes
    const existingWebhooks = await stripe.webhookEndpoints.list();
    console.log(`📊 Webhooks existentes: ${existingWebhooks.data.length}`);
    
    // Buscar webhook de desarrollo
    const devWebhook = existingWebhooks.data.find(webhook => 
      webhook.url.includes('ngrok') || webhook.url.includes('localhost')
    );
    
    if (devWebhook) {
      console.log(`✅ Webhook de desarrollo encontrado:`);
      console.log(`   ID: ${devWebhook.id}`);
      console.log(`   URL: ${devWebhook.url}`);
      console.log(`   Status: ${devWebhook.status}`);
      return;
    }
    
    console.log('❌ No se encontró webhook de desarrollo');
    console.log('\n📋 Para configurar el webhook de desarrollo:');
    console.log('1. Ejecuta: ngrok http 3000');
    console.log('2. Copia la URL HTTPS que aparece (ej: https://abc123.ngrok.io)');
    console.log('3. Ve a: https://dashboard.stripe.com/webhooks');
    console.log('4. Crea un nuevo webhook con la URL: https://abc123.ngrok.io/api/webhooks/stripe');
    console.log('5. Selecciona estos eventos:');
    console.log('   - checkout.session.completed');
    console.log('   - customer.subscription.created');
    console.log('   - customer.subscription.updated');
    console.log('   - customer.subscription.deleted');
    console.log('   - invoice.payment_succeeded');
    console.log('   - invoice.payment_failed');
    
  } catch (error) {
    console.error('❌ Error configurando webhook:', error);
  }
}

setupDevWebhook(); 