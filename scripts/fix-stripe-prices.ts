import { PrismaClient } from '@prisma/client';
import { SUBSCRIPTION_PLANS } from '../src/lib/stripe';

const prisma = new PrismaClient();

async function fixStripePrices() {
  try {
    console.log('🔧 CORRIGIENDO PRECIOS DE STRIPE');
    console.log('================================');
    console.log('');

    // Verificar configuración correcta
    console.log('📋 CONFIGURACIÓN CORRECTA:');
    console.log('---------------------------');
    Object.entries(SUBSCRIPTION_PLANS).forEach(([planId, plan]) => {
      console.log(`  ${plan.name}:`);
      console.log(`    💰 Precio correcto: $${plan.price}`);
      console.log(`    📅 Intervalo: ${plan.interval}`);
      console.log(`    🆔 Stripe Price ID: ${plan.stripePriceId}`);
      console.log('');
    });

    // Desactivar productos con precios incorrectos
    console.log('❌ DESACTIVANDO PRODUCTOS CON PRECIOS INCORRECTOS:');
    console.log('--------------------------------------------------');
    
    const incorrectProducts = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: 'eGrow Academy Premium' } },
          { name: { contains: 'Simulado' } }
        ]
      }
    });

    for (const product of incorrectProducts) {
      console.log(`  📦 Desactivando: ${product.name}`);
      console.log(`    🆔 ID: ${product.id}`);
      console.log(`    🆔 Stripe ID: ${product.stripeProductId}`);
      
      // Desactivar el producto
      await prisma.product.update({
        where: { id: product.id },
        data: { active: false }
      });

      // Desactivar todos los precios asociados
      const prices = await prisma.price.findMany({
        where: { productId: product.id }
      });

      for (const price of prices) {
        const amount = price.unitAmount ? price.unitAmount / 100 : 0;
        console.log(`    💰 Desactivando precio: $${amount}`);
        
        await prisma.price.update({
          where: { id: price.id },
          data: { active: false }
        });
      }
      console.log('');
    }

    // Verificar productos activos
    console.log('✅ PRODUCTOS ACTIVOS DESPUÉS DE LA CORRECCIÓN:');
    console.log('----------------------------------------------');
    const activeProducts = await prisma.product.findMany({
      where: { active: true },
      include: {
        prices: {
          where: { active: true }
        }
      }
    });

    activeProducts.forEach(product => {
      console.log(`  📦 ${product.name}:`);
      console.log(`    🆔 ID: ${product.id}`);
      console.log(`    🆔 Stripe ID: ${product.stripeProductId}`);
      console.log(`    ✅ Activo: ${product.active}`);
      
      if (product.prices.length > 0) {
        product.prices.forEach(price => {
          const amount = price.unitAmount ? price.unitAmount / 100 : 0;
          console.log(`    💰 Precio: $${amount} (${price.interval})`);
        });
      } else {
        console.log(`    ⚠️ Sin precios activos`);
      }
      console.log('');
    });

    // Verificar suscripciones activas
    console.log('💳 SUSCRIPCIONES ACTIVAS:');
    console.log('-------------------------');
    const activeSubscriptions = await prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        },
        price: {
          include: {
            product: true
          }
        }
      }
    });

    activeSubscriptions.forEach(subscription => {
      const amount = subscription.price.unitAmount ? subscription.price.unitAmount / 100 : 0;
      console.log(`  💳 ${subscription.user.email}:`);
      console.log(`    📦 Producto: ${subscription.price.product.name}`);
      console.log(`    💰 Precio actual: $${amount}`);
      console.log(`    📅 Intervalo: ${subscription.price.interval}`);
      console.log(`    🗓️ Período: ${subscription.currentPeriodStart?.toLocaleDateString()} - ${subscription.currentPeriodEnd?.toLocaleDateString()}`);
      
      // Verificar si el precio es correcto
      const expectedPrice = subscription.price.interval === 'MONTH' ? 6.99 : 59.99;
      if (amount !== expectedPrice) {
        console.log(`    ⚠️ PRECIO INCORRECTO! Debería ser $${expectedPrice}`);
      } else {
        console.log(`    ✅ Precio correcto`);
      }
      console.log('');
    });

    console.log('🎯 RECOMENDACIONES:');
    console.log('-------------------');
    console.log('1. Solo usar productos con precios correctos ($6.99 mensual, $59.99 anual)');
    console.log('2. Verificar que las suscripciones nuevas usen los precios correctos');
    console.log('3. Considerar reembolsar a usuarios que pagaron precios incorrectos');
    console.log('4. Actualizar la documentación con los precios correctos');

  } catch (error) {
    console.error('❌ Error corrigiendo precios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixStripePrices(); 