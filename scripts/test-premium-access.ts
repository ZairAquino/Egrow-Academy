import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testPremiumAccess() {
  try {
    console.log('🧪 Probando acceso premium completo...');
    
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
    console.log('  Tiene suscripción activa:', !!activeSubscription);
    console.log('  Membership Level es PREMIUM:', user.membershipLevel === 'PREMIUM');
    
    // Simular la lógica del API subscription-status
    const hasActiveSubscription = !!activeSubscription || user.membershipLevel === 'PREMIUM';
    console.log('  Acceso premium (lógica mejorada):', hasActiveSubscription);
    
    if (hasActiveSubscription) {
      console.log('\n✅ ¡Acceso premium confirmado!');
      console.log('🎯 El usuario debería poder acceder a:');
      console.log('   - Cursos premium');
      console.log('   - Recursos premium');
      console.log('   - Contenido exclusivo');
      
      console.log('\n🔍 Verificación en el frontend:');
      console.log('1. Refresca la página del navegador');
      console.log('2. Verifica el panel de debug (esquina inferior izquierda)');
      console.log('3. Ve a la página de cursos: http://localhost:3000/courses');
      console.log('4. Los cursos premium deberían mostrar "Premium"');
      console.log('5. Deberías poder hacer clic en "Comenzar Curso"');
      
    } else {
      console.log('\n❌ Problema detectado:');
      console.log('   - No tiene suscripción activa');
      console.log('   - Membership Level no es PREMIUM');
      console.log('   - No puede acceder a contenido premium');
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPremiumAccess(); 