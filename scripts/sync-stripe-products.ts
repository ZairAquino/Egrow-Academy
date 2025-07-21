import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

async function syncStripeProducts() {
  try {
    console.log('🔄 Sincronizando productos de Stripe...\n');

    console.log('📋 Pasos para sincronizar:');
    console.log('');
    console.log('1️⃣ Ve a https://dashboard.stripe.com/products');
    console.log('2️⃣ Selecciona tu producto "eGrow Academy Premium"');
    console.log('3️⃣ Copia el Product ID (empieza con prod_)');
    console.log('4️⃣ Ve a la sección "Pricing"');
    console.log('5️⃣ Copia los Price IDs (empiezan con price_)');
    console.log('');

    // Obtener productos de Stripe
    console.log('🔍 Obteniendo productos de Stripe...');
    
    try {
      const stripeProducts = await stripe.products.list({
        limit: 10,
        active: true,
      });

      console.log(`   Productos encontrados en Stripe: ${stripeProducts.data.length}`);
      
      stripeProducts.data.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.id})`);
        console.log(`      Descripción: ${product.description || 'Sin descripción'}`);
        console.log(`      Activo: ${product.active ? 'Sí' : 'No'}`);
      });

      // Obtener precios de Stripe
      console.log('\n🔍 Obteniendo precios de Stripe...');
      
      const stripePrices = await stripe.prices.list({
        limit: 20,
        active: true,
        expand: ['data.product'],
      });

      console.log(`   Precios encontrados en Stripe: ${stripePrices.data.length}`);
      
      stripePrices.data.forEach((price, index) => {
        const product = price.product as Stripe.Product;
        console.log(`   ${index + 1}. ${product.name} - $${price.unit_amount ? price.unit_amount / 100 : 'N/A'}/${price.recurring?.interval || 'N/A'} (${price.id})`);
      });

    } catch (error) {
      console.log('⚠️  Error obteniendo productos de Stripe:', error);
      console.log('   Verifica que STRIPE_SECRET_KEY esté configurado correctamente');
    }

    // Verificar productos en la base de datos
    console.log('\n🔍 Verificando productos en la base de datos:');
    
    const dbProducts = await prisma.product.findMany({
      include: {
        prices: true,
      },
    });

    console.log(`   Productos en BD: ${dbProducts.length}`);
    
    dbProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (${product.stripeProductId})`);
      product.prices.forEach((price, priceIndex) => {
        console.log(`      - ${priceIndex + 1}. $${price.unitAmount ? price.unitAmount / 100 : 'N/A'}/${price.interval} (${price.stripePriceId})`);
      });
    });

    console.log('\n📝 Para sincronizar manualmente:');
    console.log('');
    console.log('1. Ejecuta: npx tsx scripts/setup-stripe-products.ts');
    console.log('2. O actualiza manualmente en la base de datos:');
    console.log('   - Product ID: prod_...');
    console.log('   - Price IDs: price_...');
    console.log('');

    console.log('✅ Sincronización completada!');
    console.log('\n🎯 Próximos pasos:');
    console.log('   1. Verificar que los productos estén sincronizados');
    console.log('   2. Probar flujo de suscripción');
    console.log('   3. Verificar acceso al curso premium');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncStripeProducts()
  .then(() => {
    console.log('\n✅ Sincronización completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 