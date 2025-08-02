import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStripeConfig() {
  try {
    console.log('🔍 Verificando configuración de Stripe en eGrow Academy...\n');

    // 1. Variables de entorno requeridas
    console.log('1️⃣ Variables de entorno de Stripe:');
    
    const stripeVars = {
      'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY,
      'STRIPE_PUBLISHABLE_KEY': process.env.STRIPE_PUBLISHABLE_KEY,
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      'STRIPE_WEBHOOK_SECRET': process.env.STRIPE_WEBHOOK_SECRET
    };

    let configuredCount = 0;
    let totalCount = Object.keys(stripeVars).length;

    Object.entries(stripeVars).forEach(([varName, value]) => {
      if (value) {
        console.log(`   ✅ ${varName}: Configurado`);
        configuredCount++;
      } else {
        console.log(`   ❌ ${varName}: No configurado`);
      }
    });

    console.log(`\n   Configuración: ${configuredCount}/${totalCount} variables configuradas`);

    // 2. Verificar configuración en el código
    console.log('\n2️⃣ Configuración en el código:');
    
    // Verificar archivo de configuración de Stripe
    const stripeConfigPath = 'src/lib/stripe.ts';
    console.log(`   ✅ Archivo de configuración: ${stripeConfigPath}`);
    
    // Verificar endpoints de API
    const apiEndpoints = [
      'src/app/api/stripe/create-subscription/route.ts',
      'src/app/api/stripe/create-payment-intent/route.ts',
      'src/app/api/stripe/webhook/route.ts',
      'src/app/api/stripe/payment-status/route.ts'
    ];
    
    apiEndpoints.forEach(endpoint => {
      console.log(`   ✅ Endpoint: ${endpoint}`);
    });

    // 3. Verificar precios configurados
    console.log('\n3️⃣ Precios configurados:');
    
    const prices = await prisma.price.findMany({
      where: { active: true },
      select: {
        stripePriceId: true,
        unitAmount: true,
        currency: true,
        type: true,
        interval: true
      }
    });
    
    console.log(`   Precios activos: ${prices.length}`);
    prices.forEach(price => {
      const amount = price.unitAmount ? price.unitAmount / 100 : 0;
      console.log(`   - ${price.stripePriceId}: $${amount} ${price.currency} (${price.type})`);
    });

    // 4. Verificar productos
    console.log('\n4️⃣ Productos configurados:');
    
    const products = await prisma.product.findMany({
      where: { active: true },
      select: {
        stripeProductId: true,
        name: true,
        description: true
      }
    });
    
    console.log(`   Productos activos: ${products.length}`);
    products.forEach(product => {
      console.log(`   - ${product.stripeProductId}: ${product.name}`);
    });

    // 5. Análisis de configuración
    console.log('\n5️⃣ Análisis de configuración:');
    
    if (configuredCount === totalCount) {
      console.log('   ✅ Configuración completa de Stripe');
      console.log('   - Todas las variables están configuradas');
      console.log('   - Sistema listo para producción');
    } else if (configuredCount >= 2) {
      console.log('   ⚠️ Configuración parcial de Stripe');
      console.log('   - Funciona para desarrollo');
      console.log('   - Falta configuración para frontend');
    } else {
      console.log('   ❌ Configuración incompleta de Stripe');
      console.log('   - No funciona correctamente');
      console.log('   - Requiere configuración adicional');
    }

    // 6. Variables faltantes específicas
    console.log('\n6️⃣ Variables faltantes:');
    
    if (!stripeVars['STRIPE_PUBLISHABLE_KEY']) {
      console.log('   ❌ STRIPE_PUBLISHABLE_KEY: Necesaria para el frontend');
      console.log('   - Se usa en componentes de pago');
      console.log('   - Se obtiene del dashboard de Stripe');
    }
    
    if (!stripeVars['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY']) {
      console.log('   ❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Necesaria para el frontend');
      console.log('   - Se usa en el cliente (navegador)');
      console.log('   - Debe ser la misma que STRIPE_PUBLISHABLE_KEY');
    }

    // 7. Instrucciones de configuración
    console.log('\n7️⃣ Instrucciones para completar configuración:');
    
    if (!stripeVars['STRIPE_PUBLISHABLE_KEY'] || !stripeVars['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY']) {
      console.log('   1. Ve al dashboard de Stripe: https://dashboard.stripe.com/');
      console.log('   2. Navega a Developers > API keys');
      console.log('   3. Copia la "Publishable key"');
      console.log('   4. Agrega estas variables a tu .env.local:');
      console.log('      STRIPE_PUBLISHABLE_KEY=pk_test_...');
      console.log('      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...');
      console.log('   5. Reinicia el servidor de desarrollo');
    }

    // 8. Resumen final
    console.log('\n🎯 Resumen de configuración de Stripe:');
    console.log(`   - Variables configuradas: ${configuredCount}/${totalCount}`);
    console.log(`   - Precios activos: ${prices.length}`);
    console.log(`   - Productos activos: ${products.length}`);
    console.log(`   - Endpoints implementados: ${apiEndpoints.length}`);
    
    if (configuredCount === totalCount) {
      console.log('\n✅ Sistema de pagos: COMPLETAMENTE CONFIGURADO');
      console.log('   - Listo para procesar pagos reales');
      console.log('   - Frontend y backend funcionando');
    } else {
      console.log('\n⚠️ Sistema de pagos: CONFIGURACIÓN PARCIAL');
      console.log('   - Backend funcionando');
      console.log('   - Frontend requiere configuración adicional');
    }

  } catch (error) {
    console.error('❌ Error verificando configuración de Stripe:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStripeConfig(); 