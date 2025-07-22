import Stripe from 'stripe';
import { config } from 'dotenv';

// Cargar variables de entorno
config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

async function verifyWebhookEvents() {
  try {
    console.log('🔍 Verificando eventos del webhook...');
    
    // Obtener el webhook
    const webhookId = 'we_1RmJRdFZOCuGu7T5yj0HMvts';
    const webhook = await stripe.webhookEndpoints.retrieve(webhookId);
    
    console.log(`📊 Webhook encontrado:`);
    console.log(`   ID: ${webhook.id}`);
    console.log(`   URL: ${webhook.url}`);
    console.log(`   Status: ${webhook.status}`);
    console.log(`   Eventos: ${webhook.enabled_events.join(', ')}`);
    
    // Verificar si la URL apunta a ngrok
    if (webhook.url.includes('ngrok')) {
      console.log('✅ Webhook configurado para desarrollo local (ngrok)');
    } else if (webhook.url.includes('vercel')) {
      console.log('⚠️ Webhook configurado para Vercel (producción)');
      console.log('💡 Necesitas cambiar la URL a tu ngrok para desarrollo local');
    } else {
      console.log('❓ Webhook con URL desconocida');
    }
    
    // Listar eventos recientes
    console.log('\n📋 Eventos recientes:');
    const events = await stripe.events.list({
      limit: 10,
      types: ['checkout.session.completed', 'customer.subscription.created']
    });
    
    if (events.data.length === 0) {
      console.log('   No hay eventos recientes');
    } else {
      events.data.forEach((event, index) => {
        console.log(`   ${index + 1}. ${event.type} - ${event.created ? new Date(event.created * 1000).toLocaleString() : 'N/A'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error verificando webhook:', error);
  }
}

verifyWebhookEvents(); 