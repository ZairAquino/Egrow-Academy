#!/usr/bin/env tsx

/**
 * Script para inicializar productos de ejemplo en Stripe
 * Ejecutar con: npx tsx scripts/init-stripe-products.ts
 */

import { createStripeProduct, createStripePrice } from '../src/lib/stripe';

const products = [
  {
    name: 'Membresía Premium - Mensual',
    description: 'Acceso completo a todos los cursos premium de eGrow Academy',
    prices: [
      {
        amount: 2999, // $29.99
        currency: 'usd',
        type: 'recurring' as const,
        interval: 'month' as const,
        intervalCount: 1,
        trialPeriodDays: 7,
      }
    ],
    metadata: {
      type: 'subscription',
      tier: 'premium',
      interval: 'monthly'
    }
  },
  {
    name: 'Membresía Premium - Anual',
    description: 'Acceso completo a todos los cursos premium con descuento anual',
    prices: [
      {
        amount: 29999, // $299.99 (2 meses gratis)
        currency: 'usd',
        type: 'recurring' as const,
        interval: 'year' as const,
        intervalCount: 1,
        trialPeriodDays: 7,
      }
    ],
    metadata: {
      type: 'subscription',
      tier: 'premium',
      interval: 'yearly'
    }
  },
  {
    name: 'Curso de Machine Learning Avanzado',
    description: 'Curso completo de machine learning con proyectos prácticos',
    prices: [
      {
        amount: 9900, // $99.00
        currency: 'usd',
        type: 'one_time' as const,
      }
    ],
    metadata: {
      type: 'course',
      category: 'machine-learning',
      difficulty: 'advanced'
    }
  },
  {
    name: 'Curso de Deep Learning con PyTorch',
    description: 'Aprende deep learning desde cero con PyTorch',
    prices: [
      {
        amount: 7900, // $79.00
        currency: 'usd',
        type: 'one_time' as const,
      }
    ],
    metadata: {
      type: 'course',
      category: 'deep-learning',
      difficulty: 'intermediate'
    }
  },
  {
    name: 'Curso de NLP con Transformers',
    description: 'Procesamiento de lenguaje natural con modelos modernos',
    prices: [
      {
        amount: 8900, // $89.00
        currency: 'usd',
        type: 'one_time' as const,
      }
    ],
    metadata: {
      type: 'course',
      category: 'nlp',
      difficulty: 'advanced'
    }
  },
  {
    name: 'Workshop de Computer Vision',
    description: 'Workshop intensivo de visión por computadora',
    prices: [
      {
        amount: 4900, // $49.00
        currency: 'usd',
        type: 'one_time' as const,
      }
    ],
    metadata: {
      type: 'workshop',
      category: 'computer-vision',
      difficulty: 'intermediate'
    }
  }
];

async function initializeStripeProducts() {
  console.log('🚀 Inicializando productos de Stripe...\n');

  for (const productData of products) {
    try {
      console.log(`📦 Creando producto: ${productData.name}`);
      
      // Crear producto
      const product = await createStripeProduct({
        name: productData.name,
        description: productData.description,
        metadata: productData.metadata,
      });

      console.log(`✅ Producto creado: ${product.id}`);

      // Crear precios para el producto
      for (const priceData of productData.prices) {
        const price = await createStripePrice({
          productId: product.id,
          unitAmount: priceData.amount,
          currency: priceData.currency,
          type: priceData.type,
          interval: priceData.interval,
          intervalCount: priceData.intervalCount,
          trialPeriodDays: priceData.trialPeriodDays,
        });

        console.log(`💰 Precio creado: ${price.id} - ${priceData.amount / 100} ${priceData.currency.toUpperCase()}`);
      }

      console.log(''); // Línea en blanco para separar productos
    } catch (error) {
      console.error(`❌ Error creando producto "${productData.name}":`, error);
    }
  }

  console.log('🎉 ¡Inicialización completada!');
  console.log('\n📋 Productos creados:');
  console.log('- Membresía Premium Mensual ($29.99/mes)');
  console.log('- Membresía Premium Anual ($299.99/año)');
  console.log('- Curso de Machine Learning Avanzado ($99.00)');
  console.log('- Curso de Deep Learning con PyTorch ($79.00)');
  console.log('- Curso de NLP con Transformers ($89.00)');
  console.log('- Workshop de Computer Vision ($49.00)');
  
  console.log('\n💡 Próximos pasos:');
  console.log('1. Copiar los IDs de productos y precios de la consola');
  console.log('2. Agregar las variables de entorno de Stripe');
  console.log('3. Configurar webhooks en el dashboard de Stripe');
  console.log('4. Probar pagos con tarjetas de prueba');
}

// Ejecutar el script
if (require.main === module) {
  initializeStripeProducts().catch(console.error);
}

export { initializeStripeProducts }; 