import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function debugNewUser() {
  try {
    console.log('🔍 Debuggeando nuevo usuario...');
    
    // Buscar el usuario más reciente que no sea Armando
    const recentUsers = await prisma.user.findMany({
      where: {
        email: {
          not: 'Armando@gmail.com'
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      select: {
        id: true,
        email: true,
        membershipLevel: true,
        stripeCustomerId: true,
        createdAt: true
      }
    });
    
    console.log('📊 Usuarios recientes:');
    recentUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.membershipLevel}) - ${user.createdAt.toLocaleString()}`);
    });
    
    if (recentUsers.length === 0) {
      console.log('❌ No se encontraron usuarios recientes');
      return;
    }
    
    const newUser = recentUsers[0];
    console.log('\n🔍 Analizando usuario:', newUser.email);
    
    // Verificar suscripciones
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: newUser.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('\n📋 Suscripciones encontradas:', subscriptions.length);
    subscriptions.forEach((sub, index) => {
      console.log(`${index + 1}. ID: ${sub.id}`);
      console.log(`   Status: ${sub.status}`);
      console.log(`   Stripe ID: ${sub.stripeSubscriptionId}`);
      console.log(`   Period End: ${sub.currentPeriodEnd.toLocaleString()}`);
      console.log(`   Created: ${sub.createdAt.toLocaleString()}`);
      console.log(`   Active: ${sub.status === 'ACTIVE' && sub.currentPeriodEnd > new Date()}`);
    });
    
    // Verificar suscripción activa
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: newUser.id,
        status: 'ACTIVE',
        currentPeriodEnd: {
          gt: new Date(),
        },
      },
    });
    
    console.log('\n🔍 Verificación de acceso premium:');
    console.log('  Membership Level:', newUser.membershipLevel);
    console.log('  Tiene suscripción activa:', !!activeSubscription);
    
    // Simular la lógica del API subscription-status
    const hasActiveSubscription = !!activeSubscription || newUser.membershipLevel === 'PREMIUM';
    console.log('  Acceso premium (lógica mejorada):', hasActiveSubscription);
    
    if (!hasActiveSubscription) {
      console.log('\n❌ PROBLEMA DETECTADO:');
      console.log('   - No tiene acceso premium');
      
      if (newUser.membershipLevel !== 'PREMIUM') {
        console.log('   - Membership Level no es PREMIUM');
      }
      
      if (!activeSubscription) {
        console.log('   - No tiene suscripción activa');
      }
      
      console.log('\n🔧 SOLUCIÓN:');
      console.log('   - Verificar si el webhook se ejecutó correctamente');
      console.log('   - Verificar si se creó la suscripción');
      console.log('   - Verificar si se actualizó el membershipLevel');
    } else {
      console.log('\n✅ Usuario tiene acceso premium');
    }
    
  } catch (error) {
    console.error('❌ Error debuggeando usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugNewUser(); 