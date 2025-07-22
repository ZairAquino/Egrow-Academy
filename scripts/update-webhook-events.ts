import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

async function updateWebhookEvents() {
  try {
    console.log('🔧 Actualizando eventos del webhook...');
    
    // Listar webhooks existentes
    const webhooks = await stripe.webhookEndpoints.list();
    
    if (webhooks.data.length === 0) {
      console.log('❌ No se encontraron webhooks');
      return;
    }
    
    const webhook = webhooks.data[0];
    console.log(`📊 Webhook encontrado: ${webhook.id}`);
    
    // Eventos actuales
    const currentEvents = webhook.enabled_events;
    console.log('📋 Eventos actuales:', currentEvents);
    
    // Agregar checkout.session.completed si no está presente
    const newEvents = [...currentEvents];
    if (!newEvents.includes('checkout.session.completed')) {
      newEvents.push('checkout.session.completed');
      console.log('➕ Agregando checkout.session.completed');
    }
    
    // Actualizar el webhook
    const updatedWebhook = await stripe.webhookEndpoints.update(webhook.id, {
      enabled_events: newEvents,
    });
    
    console.log('✅ Webhook actualizado exitosamente');
    console.log('📋 Nuevos eventos:', updatedWebhook.enabled_events);
    
  } catch (error) {
    console.error('❌ Error actualizando webhook:', error);
  }
}

updateWebhookEvents(); 