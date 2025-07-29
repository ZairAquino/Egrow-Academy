#!/usr/bin/env tsx

import { stripe } from '../src/lib/stripe';

async function verifyStripeConfig() {
  console.log('🔍 Verificando configuración de Stripe...\n');

  // Verificar variables de entorno
  console.log('📋 Variables de entorno:');
  console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Configurada' : '❌ No configurada');
  console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ Configurada' : '❌ No configurada');
  console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅ Configurada' : '❌ No configurada');
  console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

  if (!process.env.STRIPE_SECRET_KEY) {
    console.log('\n❌ ERROR: STRIPE_SECRET_KEY no está configurada');
    console.log('💡 Solución: Agrega STRIPE_SECRET_KEY a tu archivo .env.local');
    return;
  }

  try {
    console.log('\n🔗 Probando conexión con Stripe...');
    
    // Intentar obtener la cuenta de Stripe
    const account = await stripe.accounts.retrieve();
    console.log('✅ Conexión exitosa con Stripe');
    console.log('📧 Email de la cuenta:', account.email);
    console.log('🌍 País:', account.country);
    console.log('💳 Tipos de pago habilitados:', account.capabilities);

    // Verificar productos
    console.log('\n📦 Verificando productos...');
    const products = await stripe.products.list({ limit: 10 });
    console.log(`✅ Encontrados ${products.data.length} productos`);

    products.data.forEach(product => {
      console.log(`  - ${product.name} (${product.id})`);
    });

    // Verificar precios
    console.log('\n💰 Verificando precios...');
    const prices = await stripe.prices.list({ limit: 10 });
    console.log(`✅ Encontrados ${prices.data.length} precios`);

    prices.data.forEach(price => {
      if (price.type === 'recurring') {
        console.log(`  - ${price.unit_amount} ${price.currency} / ${price.recurring?.interval} (${price.id})`);
      }
    });

    console.log('\n✅ Configuración de Stripe verificada correctamente');

  } catch (error: any) {
    console.log('\n❌ Error al conectar con Stripe:');
    console.log('Mensaje:', error.message);
    console.log('Código:', error.code);
    
    if (error.code === 'authentication_error') {
      console.log('\n💡 Solución: Verifica que tu STRIPE_SECRET_KEY sea correcta');
    } else if (error.code === 'invalid_request_error') {
      console.log('\n💡 Solución: Verifica que tu clave de API tenga los permisos necesarios');
    }
  }
}

verifyStripeConfig().catch(console.error); 