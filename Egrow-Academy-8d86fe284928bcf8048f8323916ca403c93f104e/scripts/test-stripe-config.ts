import 'dotenv/config';
import { stripe, listProducts, listPrices } from '../src/lib/stripe';

async function testStripeConfig() {
  console.log('🧪 Probando configuración de Stripe...\n');

  try {
    // Verificar que Stripe esté configurado
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ Error: STRIPE_SECRET_KEY no está configurada');
      console.log('💡 Crea un archivo .env con las siguientes variables:');
      console.log('');
      console.log('STRIPE_SECRET_KEY="sk_live_..."');
      console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."');
      console.log('STRIPE_WEBHOOK_SECRET="whsec_..."');
      process.exit(1);
    }

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      console.error('❌ Error: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no está configurada');
      process.exit(1);
    }

    // Verificar si es modo live o test
    const isLiveMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_live_');
    const mode = isLiveMode ? 'LIVE' : 'TEST';
    
    console.log(`✅ Stripe configurado en modo: ${mode}`);
    console.log(`🔑 Secret Key: ${process.env.STRIPE_SECRET_KEY.substring(0, 12)}...`);
    console.log(`🔑 Publishable Key: ${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.substring(0, 12)}...\n`);

    // Probar conexión con Stripe
    console.log('🔌 Probando conexión con Stripe...');
    
    try {
      // Intentar obtener la cuenta de Stripe
      const account = await stripe.accounts.retrieve();
      console.log(`✅ Conexión exitosa con cuenta: ${account.id}`);
      console.log(`📧 Email: ${account.email}`);
      console.log(`🌍 País: ${account.country}`);
      console.log(`💳 Monedas: ${account.default_currency?.toUpperCase()}\n`);
    } catch (error) {
      console.error('❌ Error conectando con Stripe:', error);
      process.exit(1);
    }

    // Listar productos existentes
    console.log('📦 Productos existentes en Stripe:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      const products = await listProducts(true); // Solo productos activos
      
      if (products.data.length === 0) {
        console.log('   No hay productos activos');
        console.log('   💡 Ejecuta: npm run init-stripe');
      } else {
        products.data.forEach((product, index) => {
          console.log(`   ${index + 1}. ${product.name}`);
          console.log(`      ID: ${product.id}`);
          console.log(`      Descripción: ${product.description || 'Sin descripción'}`);
          console.log(`      Metadatos: ${JSON.stringify(product.metadata)}`);
          console.log('');
        });
      }
    } catch (error) {
      console.error('❌ Error listando productos:', error);
    }

    // Listar precios existentes
    console.log('💰 Precios existentes en Stripe:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      const prices = await stripe.prices.list({ active: true, limit: 20 });
      
      if (prices.data.length === 0) {
        console.log('   No hay precios activos');
        console.log('   💡 Ejecuta: npm run init-stripe');
      } else {
        prices.data.forEach((price, index) => {
          const amount = price.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A';
          const currency = price.currency?.toUpperCase() || 'N/A';
          const interval = price.recurring?.interval || 'one-time';
          
          console.log(`   ${index + 1}. ${amount} ${currency} (${interval})`);
          console.log(`      ID: ${price.id}`);
          console.log(`      Producto: ${price.product}`);
          console.log('');
        });
      }
    } catch (error) {
      console.error('❌ Error listando precios:', error);
    }

    // Verificar webhook secret
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      console.log('🔗 Webhook Secret configurado');
      console.log(`   Secret: ${process.env.STRIPE_WEBHOOK_SECRET.substring(0, 12)}...`);
    } else {
      console.log('⚠️  Webhook Secret no configurado');
      console.log('   💡 Configura STRIPE_WEBHOOK_SECRET para recibir eventos');
    }

    console.log('\n🎯 Próximos pasos para probar pagos:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (isLiveMode) {
      console.log('🚨 MODO LIVE DETECTADO - Usar tarjetas reales');
      console.log('   • Configura métodos de pago en el Dashboard de Stripe');
      console.log('   • Prueba con tarjetas reales (cuidado con cargos)');
      console.log('   • Verifica webhooks en producción');
    } else {
      console.log('🧪 MODO TEST - Usar tarjetas de prueba');
      console.log('   • Tarjeta de prueba: 4242424242424242');
      console.log('   • CVC: 123');
      console.log('   • Fecha: 12/25');
      console.log('   • Para errores: 4000000000000002');
    }

    console.log('');
    console.log('📱 Para probar en la aplicación:');
    console.log('   1. Inicia el servidor: npm run dev');
    console.log('   2. Ve a /subscription');
    console.log('   3. Intenta crear una suscripción');
    console.log('   4. Revisa los logs del servidor');

    console.log('\n✅ Configuración de Stripe verificada correctamente');

  } catch (error) {
    console.error('❌ Error en la verificación:', error);
    process.exit(1);
  }
}

// Ejecutar el script
testStripeConfig(); 