import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function debugCurrentUser() {
  try {
    console.log('🔍 Debuggeando usuario actual...');
    
    // Buscar el usuario con ID cmdexie0g000te5fc4lk6c811 (del log)
    const user = await prisma.user.findUnique({
      where: { id: 'cmdexie0g000te5fc4lk6c811' },
      select: {
        id: true,
        email: true,
        membershipLevel: true,
        stripeCustomerId: true,
        createdAt: true
      }
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }
    
    console.log('📊 Usuario:', user.email);
    console.log('📊 Membership Level:', user.membershipLevel);
    console.log('📊 Stripe Customer ID:', user.stripeCustomerId);
    console.log('📊 Creado:', user.createdAt.toLocaleString());
    
    // Verificar suscripciones
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: user.id
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
        userId: user.id,
        status: 'ACTIVE',
        currentPeriodEnd: {
          gt: new Date(),
        },
      },
    });
    
    console.log('\n🔍 Verificación de acceso premium:');
    console.log('  Membership Level:', user.membershipLevel);
    console.log('  Tiene suscripción activa:', !!activeSubscription);
    
    // Simular la lógica del API subscription-status
    const hasActiveSubscription = !!activeSubscription || user.membershipLevel === 'PREMIUM';
    console.log('  Acceso premium (lógica mejorada):', hasActiveSubscription);
    
    if (!hasActiveSubscription) {
      console.log('\n❌ PROBLEMA DETECTADO:');
      console.log('   - No tiene acceso premium');
      
      if (user.membershipLevel !== 'PREMIUM') {
        console.log('   - Membership Level no es PREMIUM');
        console.log('   - El webhook no actualizó el membershipLevel');
      }
      
      if (!activeSubscription) {
        console.log('   - No tiene suscripción activa');
        console.log('   - El webhook no creó la suscripción');
      }
      
      console.log('\n🔧 SOLUCIÓN MANUAL:');
      console.log('   - Ejecutar script para crear suscripción');
      console.log('   - O verificar por qué el webhook no funcionó');
    } else {
      console.log('\n✅ Usuario tiene acceso premium');
      console.log('   - El problema puede estar en el frontend');
    }
    
    // Verificar si el problema está en el frontend
    console.log('\n🔍 Verificación del frontend:');
    console.log('1. El usuario debería ver "Premium" en lugar de "Suscribirse"');
    console.log('2. Debería poder hacer clic en "Comenzar Curso"');
    console.log('3. El logo debería ser logop.png');
    
    console.log('\n🎯 Para probar:');
    console.log('1. Refresca la página del navegador');
    console.log('2. Ve a: http://localhost:3000/courses');
    console.log('3. Verifica si aparece "Premium" o "Suscribirse"');
    
  } catch (error) {
    console.error('❌ Error debuggeando usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugCurrentUser(); 