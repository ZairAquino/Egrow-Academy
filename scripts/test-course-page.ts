import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testCoursePage() {
  try {
    console.log('🧪 Probando página del curso...');
    
    // Buscar usuario teodoro (del log)
    const user = await prisma.user.findUnique({
      where: { id: 'cmdey49za0012e5fcf9el4ytj' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true
      }
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }
    
    console.log('📊 Usuario:', `${user.firstName} ${user.lastName}`);
    console.log('📊 Email:', user.email);
    console.log('📊 Membership Level:', user.membershipLevel);
    
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
    
    console.log('📋 Tiene suscripción activa:', !!activeSubscription);
    
    // Simular la lógica del nuevo hook useSubscriptionStatus
    const hasActiveSubscription = !!activeSubscription;
    const hasPremiumAccess = hasActiveSubscription || user.membershipLevel === 'PREMIUM';
    
    console.log('\n🔍 Simulación del hook useSubscriptionStatus:');
    console.log('  Membership Level PREMIUM:', user.membershipLevel === 'PREMIUM');
    console.log('  Has Active Subscription:', hasActiveSubscription);
    console.log('  Has Premium Access:', hasPremiumAccess);
    
    // Verificar inscripción en el curso
    const course = await prisma.course.findUnique({
      where: { slug: 'desarrollo-web-fullstack' },
      select: {
        id: true,
        title: true,
        isFree: true
      }
    });
    
    if (!course) {
      console.log('❌ Curso no encontrado');
      return;
    }
    
    console.log('\n📋 Curso:', course.title);
    console.log('  Es gratis:', course.isFree);
    
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: course.id
      }
    });
    
    console.log('  Está inscrito:', !!enrollment);
    
    // Simular la lógica de la página del curso
    console.log('\n🔍 Simulación de la página del curso:');
    
    if (!user) {
      console.log('  Usuario no autenticado → "Iniciar Sesión para Acceder"');
    } else if (hasPremiumAccess) {
      if (enrollment) {
        console.log('  Usuario PREMIUM + inscrito → "Continuar con el curso"');
      } else {
        console.log('  Usuario PREMIUM + no inscrito → "Comenzar Curso Premium"');
      }
    } else {
      console.log('  Usuario sin acceso premium → "Suscribirse para Acceder"');
    }
    
    if (hasPremiumAccess) {
      console.log('\n✅ ¡PÁGINA DEL CURSO DEBERÍA FUNCIONAR!');
      console.log('🎯 El usuario debería ver el botón correcto');
      
      if (enrollment) {
        console.log('   - Botón: "Continuar con el curso"');
        console.log('   - Debería poder acceder al contenido');
      } else {
        console.log('   - Botón: "Comenzar Curso Premium"');
        console.log('   - Se inscribirá automáticamente al hacer clic');
      }
      
    } else {
      console.log('\n❌ PROBLEMA DETECTADO:');
      console.log('   - Usuario no tiene acceso premium');
      console.log('   - Verá "Suscribirse para Acceder"');
      console.log('   - No puede acceder al contenido');
    }
    
    console.log('\n🎯 PARA PROBAR EN EL NAVEGADOR:');
    console.log('1. Ve a: http://localhost:3000/curso/desarrollo-web-fullstack');
    console.log('2. Deberías ver el botón correcto según tu estado');
    console.log('3. Si ves "Suscribirse para Acceder", espera máximo 30 segundos');
    console.log('4. El hook verificará automáticamente el estado');
    
  } catch (error) {
    console.error('❌ Error probando página del curso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCoursePage(); 