import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testCourseAccess() {
  try {
    console.log('🧪 Probando acceso a cursos...');
    
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
        isFree: true,
        price: true
      }
    });
    
    if (!premiumCourse) {
      console.log('❌ No se encontró curso premium');
      return;
    }
    
    console.log('\n📋 Curso premium encontrado:');
    console.log('  Título:', premiumCourse.title);
    console.log('  Slug:', premiumCourse.slug);
    console.log('  Es gratis:', premiumCourse.isFree);
    console.log('  Precio:', premiumCourse.price);
    
    // Verificar inscripción
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: premiumCourse.id
      }
    });
    
    console.log('\n🔍 Verificación de inscripción:');
    console.log('  Está inscrito:', !!enrollment);
    
    if (enrollment) {
      console.log('  Status:', enrollment.status);
      console.log('  Progress:', enrollment.progressPercentage + '%');
    }
    
    // Verificar acceso según la lógica del API
    const hasActiveSubscription = user.membershipLevel === 'PREMIUM';
    const canAccess = premiumCourse.isFree || hasActiveSubscription;
    
    console.log('\n🔍 Verificación de acceso:');
    console.log('  Curso es gratis:', premiumCourse.isFree);
    console.log('  Usuario es PREMIUM:', hasActiveSubscription);
    console.log('  Puede acceder:', canAccess);
    
    if (!canAccess) {
      console.log('\n❌ PROBLEMA: Usuario no puede acceder al curso');
      console.log('   - Necesita ser PREMIUM para cursos de pago');
    } else {
      console.log('\n✅ Usuario puede acceder al curso');
      
      if (!enrollment) {
        console.log('   - Pero no está inscrito aún');
        console.log('   - Debería poder inscribirse automáticamente');
      } else {
        console.log('   - Y ya está inscrito');
      }
    }
    
    // Simular la lógica del API de acceso a cursos
    console.log('\n🔍 Simulando API de acceso a cursos:');
    
    if (premiumCourse.isFree) {
      console.log('✅ Curso gratis - acceso permitido');
    } else if (hasActiveSubscription) {
      console.log('✅ Usuario PREMIUM - acceso permitido');
    } else {
      console.log('❌ Usuario no PREMIUM - acceso denegado');
    }
    
  } catch (error) {
    console.error('❌ Error probando acceso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCourseAccess(); 