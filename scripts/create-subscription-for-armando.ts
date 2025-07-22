import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function createSubscriptionForArmando() {
  try {
    console.log('🔧 Creando suscripción activa para Armando...');
    
    // Buscar a Armando
    const user = await prisma.user.findUnique({
      where: { email: 'Armando@gmail.com' },
      select: {
        id: true,
        email: true,
        membershipLevel: true,
        stripeCustomerId: true
      }
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }
    
    console.log('📊 Usuario:', user.email);
    console.log('📊 Membership Level:', user.membershipLevel);
    console.log('📊 Stripe Customer ID:', user.stripeCustomerId);
    
    // Buscar un precio de suscripción existente
    let price = await prisma.price.findFirst({
      where: {
        active: true,
        type: 'RECURRING'
      },
      select: {
        id: true,
        unitAmount: true,
        currency: true,
        interval: true
      }
    });
    
    if (!price) {
      console.log('❌ No se encontró un precio de suscripción');
      console.log('🔧 Creando un precio de suscripción...');
      
      // Buscar o crear un producto
      let product = await prisma.product.findFirst({
        where: { active: true }
      });
      
      if (!product) {
        product = await prisma.product.create({
          data: {
            stripeProductId: `prod_manual_${Date.now()}`,
            name: 'eGrow Academy Premium',
            description: 'Suscripción premium a eGrow Academy',
            active: true
          }
        });
        console.log('✅ Producto creado:', product.id);
      }
      
      // Crear precio
      price = await prisma.price.create({
        data: {
          stripePriceId: `price_manual_${Date.now()}`,
          active: true,
          currency: 'usd',
          type: 'RECURRING',
          unitAmount: 699, // $6.99
          interval: 'MONTH',
          productId: product.id
        }
      });
      console.log('✅ Precio creado:', price.id);
    }
    
    console.log('📊 Precio encontrado/creado:', price.id);
    
    // Crear suscripción activa
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        stripeSubscriptionId: `sub_manual_${Date.now()}`, // ID temporal
        priceId: price.id,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        cancelAtPeriodEnd: false,
        metadata: {
          createdManually: true,
          reason: 'Fix for premium access'
        }
      }
    });
    
    console.log('✅ Suscripción creada exitosamente');
    console.log('📊 ID de suscripción:', subscription.id);
    console.log('📊 Status:', subscription.status);
    console.log('📊 Period End:', subscription.currentPeriodEnd.toLocaleString());
    
    // Verificar que ahora tiene suscripción activa
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        currentPeriodEnd: {
          gt: new Date(),
        },
      },
    });
    
    console.log('\n🔍 Verificación final:');
    console.log('  Tiene suscripción activa:', !!activeSubscription);
    
    if (activeSubscription) {
      console.log('✅ ¡Problema solucionado!');
      console.log('🎯 Ahora deberías poder acceder a los cursos premium');
    }
    
  } catch (error) {
    console.error('❌ Error creando suscripción:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSubscriptionForArmando(); 