import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updatePrices() {
  try {
    console.log('💰 Actualizando precios a valores reales...\n');

    console.log('📋 Nuevos precios:');
    console.log('   - Mensual: $6.99 USD');
    console.log('   - Anual: $59.99 USD');
    console.log('');

    // Buscar productos existentes
    const products = await prisma.product.findMany({
      include: {
        prices: true,
      },
    });

    console.log(`🔍 Productos encontrados: ${products.length}`);

    for (const product of products) {
      console.log(`\n📦 Actualizando producto: ${product.name}`);
      
      // Actualizar precios existentes
      for (const price of product.prices) {
        if (price.interval === 'MONTH') {
          console.log(`   Actualizando precio mensual: $${price.unitAmount ? price.unitAmount / 100 : 'N/A'} → $6.99`);
          
          await prisma.price.update({
            where: { id: price.id },
            data: {
              unitAmount: 699, // $6.99 en centavos
            },
          });
        } else if (price.interval === 'YEAR') {
          console.log(`   Actualizando precio anual: $${price.unitAmount ? price.unitAmount / 100 : 'N/A'} → $59.99`);
          
          await prisma.price.update({
            where: { id: price.id },
            data: {
              unitAmount: 5999, // $59.99 en centavos
            },
          });
        }
      }

      // Si no hay precio anual, crearlo
      const hasYearlyPrice = product.prices.some(p => p.interval === 'YEAR');
      if (!hasYearlyPrice) {
        console.log(`   Creando precio anual: $59.99`);
        
        await prisma.price.create({
          data: {
            stripePriceId: `price_yearly_${Date.now()}`, // Placeholder
            active: true,
            currency: 'usd',
            type: 'RECURRING',
            unitAmount: 5999, // $59.99 en centavos
            interval: 'YEAR',
            intervalCount: 1,
            productId: product.id,
          },
        });
      }
    }

    // Verificar cambios
    console.log('\n✅ Verificando cambios...');
    
    const updatedProducts = await prisma.product.findMany({
      include: {
        prices: true,
      },
    });

    updatedProducts.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}:`);
      product.prices.forEach((price, priceIndex) => {
        console.log(`   - ${priceIndex + 1}. $${price.unitAmount ? price.unitAmount / 100 : 'N/A'}/${price.interval}`);
      });
    });

    console.log('\n✅ Precios actualizados correctamente!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePrices()
  .then(() => {
    console.log('\n✅ Actualización completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 