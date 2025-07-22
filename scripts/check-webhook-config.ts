import Stripe from 'stripe';
import { config } from 'dotenv';

// Cargar variables de entorno
config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

async function checkWebhookConfig() {
  try {
    console.log('🔍 Verificando configuración de webhooks...');
    
    const webhooks = await stripe.webhookEndpoints.list();
    
    console.log(`📊 Encontrados ${webhooks.data.length} webhooks:`);
    
    webhooks.data.forEach((webhook, index) => {
      console.log(`\n${index + 1}. Webhook ID: ${webhook.id}`);
      console.log(`   URL: ${webhook.url}`);
      console.log(`   Status: ${webhook.status}`);
      console.log(`   Eventos: ${webhook.enabled_events.join(', ')}`);
      console.log(`   Creado: ${new Date(webhook.created * 1000).toLocaleString()}`);
      
      // Obtener detalles completos del webhook
      stripe.webhookEndpoints.retrieve(webhook.id).then((details) => {
        console.log(`   URL completa: ${details.url}`);
        console.log(`   Secret: ${details.secret ? 'Configurado' : 'No configurado'}`);
      }).catch(console.error);
    });
    
    if (webhooks.data.length === 0) {
      console.log('❌ No hay webhooks configurados');
      console.log('💡 Necesitas crear un webhook en el dashboard de Stripe');
      console.log('   URL: https://dashboard.stripe.com/webhooks');
      console.log('   Endpoint URL: https://tu-dominio.com/api/webhooks/stripe');
      console.log('   Eventos: checkout.session.completed, customer.subscription.created, customer.subscription.updated, customer.subscription.deleted');
    }
    
  } catch (error) {
    console.error('❌ Error verificando webhooks:', error);
  }
}

checkWebhookConfig(); 