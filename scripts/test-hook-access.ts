import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testHookAccess() {
  try {
    console.log('🧪 Probando hook de acceso...');
    
    // Buscar usuario rick
    const user = await prisma.user.findUnique({
      where: { email: 'rick@gmail.com' },
      select: {
        id: true,
        email: true,
        membershipLevel: true
      }
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }
    
    console.log('📊 Usuario:', user.email);
    console.log('📊 Membership Level:', user.membershipLevel);
    
    // Simular la lógica del hook
    const hasActiveSubscription = user.membershipLevel === 'PREMIUM';
    const canAccessPremium = user.membershipLevel === 'PREMIUM' || hasActiveSubscription === true;
    
    console.log('\n🔍 Simulación del hook:');
    console.log('  Membership Level PREMIUM:', user.membershipLevel === 'PREMIUM');
    console.log('  Has Active Subscription:', hasActiveSubscription);
    console.log('  Can Access Premium:', canAccessPremium);
    
    // Simular diferentes tipos de cursos
    const testCourses = [
      { id: '1', title: 'Curso Gratis', category: 'general', isFree: true, requiresAuth: false },
      { id: '2', title: 'Curso Premium', category: 'general', isFree: false, requiresAuth: true },
      { id: '3', title: 'Curso Corto', category: 'cursos-cortos', isFree: false, requiresAuth: true }
    ];
    
    console.log('\n📋 Prueba de acceso a cursos:');
    testCourses.forEach(course => {
      let canAccess = false;
      let message = '';
      
      if (course.isFree) {
        canAccess = true;
        message = 'Gratis';
      } else if (course.category === 'cursos-cortos') {
        canAccess = true; // Asumiendo que está autenticado
        message = 'Acceso Libre';
      } else {
        canAccess = canAccessPremium;
        message = canAccessPremium ? 'Premium' : 'Requiere Premium';
      }
      
      console.log(`  ${course.title}: ${message} (Acceso: ${canAccess ? '✅' : '❌'})`);
    });
    
    if (canAccessPremium) {
      console.log('\n✅ Hook debería mostrar "Premium" en lugar de "Requiere Premium"');
      console.log('🎯 El usuario debería poder acceder a cursos premium');
    } else {
      console.log('\n❌ Hook mostrará "Requiere Premium"');
      console.log('   - El usuario no puede acceder a cursos premium');
    }
    
    console.log('\n🔍 Para verificar en el navegador:');
    console.log('1. Refresca la página: http://localhost:3000/courses');
    console.log('2. Los cursos premium deberían mostrar "Premium"');
    console.log('3. Deberías poder hacer clic en "Ver Curso"');
    
  } catch (error) {
    console.error('❌ Error probando hook:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testHookAccess(); 