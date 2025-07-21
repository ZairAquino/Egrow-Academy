import { PrismaClient } from '@prisma/client';
import { stripe, createStripeProduct, createStripePrice } from '../src/lib/stripe';

const prisma = new PrismaClient();

async function setupStripeProducts() {
  try {
    console.log('🚀 Configurando productos y precios de Stripe...');

    // 1. Crear producto de suscripción mensual en Stripe
    console.log('📦 Creando producto de suscripción mensual...');
    const monthlyProduct = await createStripeProduct({
      name: 'eGrow Academy - Suscripción Mensual',
      description: 'Acceso completo a todos los cursos especializados de eGrow Academy',
      metadata: {
        type: 'subscription',
        interval: 'monthly'
      }
    });

    // 2. Crear precio mensual en Stripe
    console.log('💰 Creando precio mensual...');
    const monthlyPrice = await createStripePrice({
      productId: monthlyProduct.id,
              unitAmount: 699, // $6.99 en centavos
      currency: 'usd',
      type: 'recurring',
      interval: 'month',
      intervalCount: 1
    });

    // 3. Crear producto de suscripción anual en Stripe
    console.log('📦 Creando producto de suscripción anual...');
    const yearlyProduct = await createStripeProduct({
      name: 'eGrow Academy - Suscripción Anual',
      description: 'Acceso completo a todos los cursos especializados de eGrow Academy (Plan Anual)',
      metadata: {
        type: 'subscription',
        interval: 'yearly'
      }
    });

    // 4. Crear precio anual en Stripe
    console.log('💰 Creando precio anual...');
    const yearlyPrice = await createStripePrice({
      productId: yearlyProduct.id,
              unitAmount: 5999, // $59.99 en centavos
      currency: 'usd',
      type: 'recurring',
      interval: 'year',
      intervalCount: 1
    });

    // 5. Guardar productos en la base de datos
    console.log('💾 Guardando productos en la base de datos...');
    await prisma.product.upsert({
      where: { stripeProductId: monthlyProduct.id },
      update: {
        name: monthlyProduct.name,
        description: monthlyProduct.description,
        active: monthlyProduct.active,
        metadata: monthlyProduct.metadata
      },
      create: {
        stripeProductId: monthlyProduct.id,
        name: monthlyProduct.name,
        description: monthlyProduct.description,
        active: monthlyProduct.active,
        metadata: monthlyProduct.metadata
      }
    });

    await prisma.product.upsert({
      where: { stripeProductId: yearlyProduct.id },
      update: {
        name: yearlyProduct.name,
        description: yearlyProduct.description,
        active: yearlyProduct.active,
        metadata: yearlyProduct.metadata
      },
      create: {
        stripeProductId: yearlyProduct.id,
        name: yearlyProduct.name,
        description: yearlyProduct.description,
        active: yearlyProduct.active,
        metadata: yearlyProduct.metadata
      }
    });

    // 6. Obtener los productos de la base de datos
    const dbMonthlyProduct = await prisma.product.findUnique({
      where: { stripeProductId: monthlyProduct.id }
    });

    const dbYearlyProduct = await prisma.product.findUnique({
      where: { stripeProductId: yearlyProduct.id }
    });

    if (!dbMonthlyProduct || !dbYearlyProduct) {
      throw new Error('No se pudieron encontrar los productos en la base de datos');
    }

    // 7. Guardar precios en la base de datos
    console.log('💾 Guardando precios en la base de datos...');
    await prisma.price.upsert({
      where: { stripePriceId: monthlyPrice.id },
      update: {
        active: monthlyPrice.active,
        currency: monthlyPrice.currency,
        type: monthlyPrice.type === 'recurring' ? 'RECURRING' : 'ONE_TIME',
        unitAmount: monthlyPrice.unit_amount,
        interval: monthlyPrice.recurring?.interval === 'month' ? 'MONTH' : 'YEAR',
        intervalCount: monthlyPrice.recurring?.interval_count || 1,
        trialPeriodDays: monthlyPrice.recurring?.trial_period_days,
        metadata: monthlyPrice.metadata
      },
      create: {
        stripePriceId: monthlyPrice.id,
        active: monthlyPrice.active,
        currency: monthlyPrice.currency,
        type: monthlyPrice.type === 'recurring' ? 'RECURRING' : 'ONE_TIME',
        unitAmount: monthlyPrice.unit_amount,
        interval: monthlyPrice.recurring?.interval === 'month' ? 'MONTH' : 'YEAR',
        intervalCount: monthlyPrice.recurring?.interval_count || 1,
        trialPeriodDays: monthlyPrice.recurring?.trial_period_days,
        metadata: monthlyPrice.metadata,
        productId: dbMonthlyProduct.id
      }
    });

    await prisma.price.upsert({
      where: { stripePriceId: yearlyPrice.id },
      update: {
        active: yearlyPrice.active,
        currency: yearlyPrice.currency,
        type: yearlyPrice.type === 'recurring' ? 'RECURRING' : 'ONE_TIME',
        unitAmount: yearlyPrice.unit_amount,
        interval: yearlyPrice.recurring?.interval === 'month' ? 'MONTH' : 'YEAR',
        intervalCount: yearlyPrice.recurring?.interval_count || 1,
        trialPeriodDays: yearlyPrice.recurring?.trial_period_days,
        metadata: yearlyPrice.metadata
      },
      create: {
        stripePriceId: yearlyPrice.id,
        active: yearlyPrice.active,
        currency: yearlyPrice.currency,
        type: yearlyPrice.type === 'recurring' ? 'RECURRING' : 'ONE_TIME',
        unitAmount: yearlyPrice.unit_amount,
        interval: yearlyPrice.recurring?.interval === 'month' ? 'MONTH' : 'YEAR',
        intervalCount: yearlyPrice.recurring?.interval_count || 1,
        trialPeriodDays: yearlyPrice.recurring?.trial_period_days,
        metadata: yearlyPrice.metadata,
        productId: dbYearlyProduct.id
      }
    });

    console.log('✅ Productos y precios configurados exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`- Producto Mensual: ${monthlyProduct.id}`);
          console.log(`- Precio Mensual: ${monthlyPrice.id} ($6.99/mes)`);
    console.log(`- Producto Anual: ${yearlyProduct.id}`);
          console.log(`- Precio Anual: ${yearlyPrice.id} ($59.99/año)`);

    // 8. Actualizar las constantes en stripe.ts
    console.log('\n🔄 Actualizando constantes en stripe.ts...');
    console.log('Por favor, actualiza manualmente las siguientes constantes en src/lib/stripe.ts:');
    console.log(`STRIPE_PRODUCTS.MONTHLY_SUBSCRIPTION = '${monthlyProduct.id}'`);
    console.log(`STRIPE_PRODUCTS.YEARLY_SUBSCRIPTION = '${yearlyProduct.id}'`);
    console.log(`STRIPE_PRICES.MONTHLY = '${monthlyPrice.id}'`);
    console.log(`STRIPE_PRICES.YEARLY = '${yearlyPrice.id}'`);

  } catch (error) {
    console.error('❌ Error configurando productos de Stripe:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
setupStripeProducts()
  .then(() => {
    console.log('🎉 Configuración completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 