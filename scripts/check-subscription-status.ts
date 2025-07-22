import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function checkSubscriptionStatus() {
  try {
    console.log('🔍 Verificando estado de suscripción de Armando...');
    
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
    
    // Buscar suscripciones
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: user.id
      },
      select: {
        id: true,
        status: true,
        currentPeriodEnd: true,
        stripeSubscriptionId: true,
        createdAt: true
      }
    });
    
    console.log('\n📋 Suscripciones encontradas:', subscriptions.length);
    subscriptions.forEach((sub, index) => {
      console.log(`  ${index + 1}. ID: ${sub.id}`);
      console.log(`     Status: ${sub.status}`);
      console.log(`     Stripe ID: ${sub.stripeSubscriptionId}`);
      console.log(`     Period End: ${sub.currentPeriodEnd.toLocaleString()}`);
      console.log(`     Created: ${sub.createdAt.toLocaleString()}`);
    });
    
    // Verificar suscripción activa según el criterio del API
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        currentPeriodEnd: {
          gt: new Date(),
        },
      },
    });
    
    console.log('\n🔍 Verificación de suscripción activa:');
    console.log('  Tiene suscripción activa:', !!activeSubscription);
    
    if (!activeSubscription) {
      console.log('\n❌ PROBLEMA IDENTIFICADO:');
      console.log('  - El usuario tiene membershipLevel: PREMIUM');
      console.log('  - Pero NO tiene una suscripción activa en la tabla subscriptions');
      console.log('  - El API subscription-status retorna false');
      console.log('  - Por eso no puede acceder a los cursos premium');
      
      console.log('\n🔧 SOLUCIÓN:');
      console.log('  Necesitamos crear una suscripción activa o modificar la lógica de acceso');
    } else {
      console.log('\n✅ Todo está correcto');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSubscriptionStatus(); 