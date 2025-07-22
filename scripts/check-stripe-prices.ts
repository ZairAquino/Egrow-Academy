import { stripe } from '../src/lib/stripe';
import { SUBSCRIPTION_PLANS } from '../src/lib/stripe';

async function checkStripePrices() {
  try {
    console.log('🔍 VERIFICANDO PRECIOS EN STRIPE');
    console.log('================================');
    console.log('');

    // Verificar configuración local
    console.log('📋 CONFIGURACIÓN LOCAL:');
    console.log('------------------------');
    Object.entries(SUBSCRIPTION_PLANS).forEach(([planId, plan]) => {
      console.log(`  ${plan.name}:`);
      console.log(`    💰 Precio: $${plan.price}`);
      console.log(`    📅 Intervalo: ${plan.interval}`);
      console.log(`    🆔 Stripe Price ID: ${plan.stripePriceId}`);
      console.log('');
    });

    // Verificar productos en Stripe
    console.log('🛍️ PRODUCTOS EN STRIPE:');
    console.log('------------------------');
    const products = await stripe.products.list({ active: true });
    
    products.data.forEach(product => {
      console.log(`  📦 ${product.name}:`);
      console.log(`    🆔 ID: ${product.id}`);
      console.log(`    📝 Descripción: ${product.description || 'Sin descripción'}`);
      console.log(`    ✅ Activo: ${product.active}`);
      console.log('');
    });

    // Verificar precios en Stripe
    console.log('💰 PRECIOS EN STRIPE:');
    console.log('---------------------');
    const prices = await stripe.prices.list({ active: true });
    
    prices.data.forEach(price => {
      const amount = price.unit_amount ? price.unit_amount / 100 : 0;
      console.log(`  💵 ${price.product}:`);
      console.log(`    🆔 ID: ${price.id}`);
      console.log(`    💰 Monto: $${amount}`);
      console.log(`    💱 Moneda: ${price.currency}`);
      console.log(`    📅 Tipo: ${price.type}`);
      if (price.recurring) {
        console.log(`    🔄 Intervalo: ${price.recurring.interval}`);
        console.log(`    📊 Cantidad de intervalos: ${price.recurring.interval_count}`);
      }
      console.log(`    ✅ Activo: ${price.active}`);
      console.log('');
    });

    // Verificar si los precios configurados existen
    console.log('🔍 VERIFICACIÓN DE PRECIOS CONFIGURADOS:');
    console.log('----------------------------------------');
    
    for (const [planId, plan] of Object.entries(SUBSCRIPTION_PLANS)) {
      try {
        const price = await stripe.prices.retrieve(plan.stripePriceId);
        const amount = price.unit_amount ? price.unit_amount / 100 : 0;
        
        console.log(`  ✅ ${plan.name}:`);
        console.log(`    🆔 Configurado: ${plan.stripePriceId}`);
        console.log(`    💰 Precio configurado: $${plan.price}`);
        console.log(`    💰 Precio en Stripe: $${amount}`);
        console.log(`    📅 Intervalo configurado: ${plan.interval}`);
        console.log(`    📅 Intervalo en Stripe: ${price.recurring?.interval}`);
        
        if (plan.price !== amount) {
          console.log(`    ⚠️ DISCREPANCIA DE PRECIO DETECTADA!`);
        }
        console.log('');
      } catch (error) {
        console.log(`  ❌ ${plan.name}:`);
        console.log(`    🆔 Configurado: ${plan.stripePriceId}`);
        console.log(`    ❌ Error: No existe en Stripe`);
        console.log('');
      }
    }

  } catch (error) {
    console.error('❌ Error verificando precios de Stripe:', error);
  }
}

checkStripePrices(); 