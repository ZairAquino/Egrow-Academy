import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

async function checkProductionPrices() {
  try {
    console.log('🔍 Verificando precios de producción de eGrow Academy...\n');

    // 1. Precios esperados de producción
    console.log('1️⃣ Precios esperados de producción:');
    const expectedPrices = {
      monthly: {
        id: 'price_1RoWlLFJoQPSn3lA6O4XrHMB',
        name: 'Plan Mensual',
        amount: 1249, // $12.49 en centavos
        currency: 'usd',
        interval: 'month'
      },
      yearly: {
        id: 'price_1RoWlMFJoQPSn3lAgdygLOCh',
        name: 'Plan Anual',
        amount: 14999, // $149.99 en centavos
        currency: 'usd',
        interval: 'year'
      }
    };

    console.log('   Plan Mensual:');
    console.log(`   - ID: ${expectedPrices.monthly.id}`);
    console.log(`   - Precio: $${expectedPrices.monthly.amount/100} ${expectedPrices.monthly.currency}`);
    console.log(`   - Intervalo: ${expectedPrices.monthly.interval}`);
    
    console.log('   Plan Anual:');
    console.log(`   - ID: ${expectedPrices.yearly.id}`);
    console.log(`   - Precio: $${expectedPrices.yearly.amount/100} ${expectedPrices.yearly.currency}`);
    console.log(`   - Intervalo: ${expectedPrices.yearly.interval}`);

    // 2. Verificar precios en Stripe
    console.log('\n2️⃣ Verificando precios en Stripe...');
    try {
      const stripePrices = await stripe.prices.list({ limit: 50 });
      console.log(`✅ Encontrados ${stripePrices.data.length} precios en Stripe`);
      
      const productionPrices = stripePrices.data.filter(price => 
        price.id === expectedPrices.monthly.id || 
        price.id === expectedPrices.yearly.id
      );
      
      console.log(`   Precios de producción encontrados: ${productionPrices.length}`);
      
      productionPrices.forEach(price => {
        const isActive = price.active ? '✅ Activo' : '❌ Inactivo';
        console.log(`   - ${price.id}: ${isActive} - $${price.unit_amount! / 100} ${price.currency}`);
      });

      // Verificar si faltan precios
      const foundIds = productionPrices.map(p => p.id);
      const missingPrices = Object.values(expectedPrices).filter(price => 
        !foundIds.includes(price.id)
      );
      
      if (missingPrices.length > 0) {
        console.log('\n❌ Precios faltantes en Stripe:');
        missingPrices.forEach(price => {
          console.log(`   - ${price.id}: ${price.name}`);
        });
      } else {
        console.log('\n✅ Todos los precios de producción están en Stripe');
      }

    } catch (error) {
      console.log('❌ Error verificando precios en Stripe:', error);
    }

    // 3. Verificar precios en la base de datos
    console.log('\n3️⃣ Verificando precios en la base de datos...');
    
    for (const [plan, expectedPrice] of Object.entries(expectedPrices)) {
      const dbPrice = await prisma.price.findUnique({
        where: { stripePriceId: expectedPrice.id }
      });
      
      if (dbPrice) {
        console.log(`✅ ${expectedPrice.name}: Existe en la BD`);
        console.log(`   - ID: ${dbPrice.stripePriceId}`);
        console.log(`   - Activo: ${dbPrice.active ? 'Sí' : 'No'}`);
        console.log(`   - Tipo: ${dbPrice.type}`);
        console.log(`   - Intervalo: ${dbPrice.interval}`);
      } else {
        console.log(`❌ ${expectedPrice.name}: NO existe en la BD`);
        console.log(`   - ID esperado: ${expectedPrice.id}`);
      }
    }

    // 4. Sincronizar precios faltantes
    console.log('\n4️⃣ Sincronizando precios faltantes...');
    
    for (const [plan, expectedPrice] of Object.entries(expectedPrices)) {
      const dbPrice = await prisma.price.findUnique({
        where: { stripePriceId: expectedPrice.id }
      });
      
      if (!dbPrice) {
        try {
          // Buscar el producto correspondiente
          const product = await prisma.product.findFirst({
            where: { 
              OR: [
                { name: { contains: 'Mensual' } },
                { name: { contains: 'Anual' } },
                { name: { contains: 'Premium' } }
              ]
            }
          });
          
          if (product) {
            await prisma.price.create({
              data: {
                stripePriceId: expectedPrice.id,
                active: true,
                currency: expectedPrice.currency,
                type: 'RECURRING',
                unitAmount: expectedPrice.amount,
                interval: expectedPrice.interval === 'month' ? 'MONTH' : 'YEAR',
                intervalCount: 1,
                productId: product.id,
              }
            });
            console.log(`✅ ${expectedPrice.name}: Creado en la BD`);
          } else {
            console.log(`❌ ${expectedPrice.name}: No se pudo crear - producto no encontrado`);
          }
        } catch (error) {
          console.log(`❌ ${expectedPrice.name}: Error creando en BD -`, error);
        }
      }
    }

    // 5. Resumen final
    console.log('\n5️⃣ Resumen de precios de producción:');
    
    const finalPrices = await prisma.price.findMany({
      where: {
        stripePriceId: {
          in: [expectedPrices.monthly.id, expectedPrices.yearly.id]
        }
      },
      include: { product: true }
    });
    
    console.log(`   Precios de producción en BD: ${finalPrices.length}`);
    finalPrices.forEach(price => {
      console.log(`   - ${price.stripePriceId}: $${price.unitAmount! / 100} ${price.currency} (${price.active ? 'Activo' : 'Inactivo'})`);
    });

    if (finalPrices.length === 2) {
      console.log('\n✅ Sistema de precios de producción: COMPLETO');
      console.log('   - Todos los precios están configurados');
      console.log('   - Listo para procesar suscripciones');
    } else {
      console.log('\n⚠️ Sistema de precios de producción: INCOMPLETO');
      console.log('   - Faltan algunos precios');
      console.log('   - Verifica la configuración en Stripe');
    }

  } catch (error) {
    console.error('❌ Error verificando precios de producción:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductionPrices(); 