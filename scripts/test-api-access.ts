import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testApiAccess() {
  try {
    console.log('🧪 Probando API de acceso a cursos...');
    
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
    
    // Buscar suscripciones activas
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        currentPeriodEnd: {
          gt: new Date(),
        },
      },
    });
    
    console.log('\n📋 Suscripciones activas:', activeSubscriptions.length);
    
    // Buscar curso premium
    const premiumCourse = await prisma.course.findFirst({
      where: {
        isFree: false,
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        isFree: true
      }
    });
    
    if (!premiumCourse) {
      console.log('❌ No se encontró curso premium');
      return;
    }
    
    console.log('\n📋 Curso premium:', premiumCourse.title);
    console.log('  Slug:', premiumCourse.slug);
    
    // Simular la lógica del API de acceso
    const hasActiveSubscription = activeSubscriptions.length > 0;
    const hasPremiumAccess = hasActiveSubscription || user.membershipLevel === 'PREMIUM';
    
    console.log('\n🔍 Simulación del API de acceso:');
    console.log('  Tiene suscripción activa:', hasActiveSubscription);
    console.log('  Membership Level es PREMIUM:', user.membershipLevel === 'PREMIUM');
    console.log('  Tiene acceso premium:', hasPremiumAccess);
    
    if (hasPremiumAccess) {
      console.log('\n✅ Usuario debería poder acceder al curso');
      
      // Verificar inscripción
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          userId: user.id,
          courseId: premiumCourse.id
        }
      });
      
      console.log('  Ya está inscrito:', !!enrollment);
      
      if (!enrollment) {
        console.log('  Se inscribiría automáticamente al acceder');
      }
      
    } else {
      console.log('\n❌ Usuario no puede acceder al curso');
    }
    
    console.log('\n🎯 Para probar en el navegador:');
    console.log(`1. Ve a: http://localhost:3000/curso/${premiumCourse.slug}`);
    console.log('2. Deberías poder acceder al contenido');
    console.log('3. Si no funciona, verifica la consola del navegador');
    
  } catch (error) {
    console.error('❌ Error probando API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testApiAccess(); 