import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixIncorrectSubscriptions() {
  try {
    console.log('🔧 CORRIGIENDO SUSCRIPCIONES CON PRECIOS INCORRECTOS');
    console.log('====================================================');
    console.log('');

    // Encontrar suscripciones con precios incorrectos
    const incorrectSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        price: {
          unitAmount: 2999 // $29.99 en centavos
        }
      },
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

    console.log(`🔍 Encontradas ${incorrectSubscriptions.length} suscripciones con precios incorrectos:`);
    console.log('');

    for (const subscription of incorrectSubscriptions) {
      const currentAmount = subscription.price.unitAmount ? subscription.price.unitAmount / 100 : 0;
      console.log(`  💳 ${subscription.user.email}:`);
      console.log(`    📦 Producto actual: ${subscription.price.product.name}`);
      console.log(`    💰 Precio actual: $${currentAmount}`);
      console.log(`    🆔 Suscripción ID: ${subscription.stripeSubscriptionId}`);
      console.log('');

      // Encontrar el precio correcto ($6.99 mensual)
      const correctPrice = await prisma.price.findFirst({
        where: {
          unitAmount: 699, // $6.99 en centavos
          interval: 'MONTH',
          active: true
        }
      });

      if (correctPrice) {
        console.log(`    ✅ Encontrado precio correcto: $${correctPrice.unitAmount / 100}`);
        
        // Actualizar la suscripción para usar el precio correcto
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { 
            priceId: correctPrice.id,
            updatedAt: new Date()
          }
        });

        console.log(`    🔄 Suscripción actualizada al precio correcto`);
      } else {
        console.log(`    ❌ No se encontró precio correcto disponible`);
      }
      console.log('');
    }

    // Verificar el resultado
    console.log('✅ VERIFICACIÓN FINAL:');
    console.log('----------------------');
    const allSubscriptions = await prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: {
          select: {
            email: true
          }
        },
        price: {
          include: {
            product: true
          }
        }
      }
    });

    allSubscriptions.forEach(subscription => {
      const amount = subscription.price.unitAmount ? subscription.price.unitAmount / 100 : 0;
      const expectedPrice = subscription.price.interval === 'MONTH' ? 6.99 : 59.99;
      
      console.log(`  💳 ${subscription.user.email}:`);
      console.log(`    📦 Producto: ${subscription.price.product.name}`);
      console.log(`    💰 Precio: $${amount}`);
      console.log(`    📅 Intervalo: ${subscription.price.interval}`);
      
      if (amount === expectedPrice) {
        console.log(`    ✅ Precio correcto`);
      } else {
        console.log(`    ⚠️ Aún incorrecto (debería ser $${expectedPrice})`);
      }
      console.log('');
    });

    console.log('🎯 RESUMEN DE CORRECCIONES:');
    console.log('---------------------------');
    console.log(`• Suscripciones procesadas: ${incorrectSubscriptions.length}`);
    console.log(`• Precio correcto establecido: $6.99 mensual`);
    console.log(`• Precio correcto establecido: $59.99 anual`);
    console.log('');
    console.log('📋 PRÓXIMOS PASOS:');
    console.log('------------------');
    console.log('1. Verificar que las nuevas suscripciones usen los precios correctos');
    console.log('2. Considerar reembolsar la diferencia a usuarios afectados');
    console.log('3. Actualizar la documentación de precios');
    console.log('4. Monitorear futuras suscripciones para evitar errores');

  } catch (error) {
    console.error('❌ Error corrigiendo suscripciones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixIncorrectSubscriptions(); 