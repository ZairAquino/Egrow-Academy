import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugCurrentUser() {
  try {
    console.log('🔍 Verificando usuario actual...\n');

    const userId = 'cmdaqz7xn0000lb04edu7763y'; // ID del usuario que está iniciando sesión

    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE',
            currentPeriodEnd: {
              gt: new Date(),
            },
          },
          include: {
            price: {
              include: {
                product: true,
              },
            },
          },
        },
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log(`👤 Usuario: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Nivel: ${user.membershipLevel}`);
    console.log(`   Email verificado: ${user.emailVerified}`);
    console.log(`   Activo: ${user.isActive}`);

    console.log('\n💰 Suscripciones:');
    if (user.subscriptions.length === 0) {
      console.log('   ❌ No hay suscripciones activas');
    } else {
      user.subscriptions.forEach((sub, index) => {
        console.log(`   ${index + 1}. ID: ${sub.id}`);
        console.log(`      Status: ${sub.status}`);
        console.log(`      Válida hasta: ${sub.currentPeriodEnd}`);
        console.log(`      Producto: ${sub.price.product.name}`);
        console.log(`      Precio: $${sub.price.unitAmount / 100}`);
      });
    }

    console.log('\n📚 Inscripciones en cursos:');
    if (user.enrollments.length === 0) {
      console.log('   ❌ No está inscrito en ningún curso');
    } else {
      user.enrollments.forEach((enrollment, index) => {
        console.log(`   ${index + 1}. ${enrollment.course.title}`);
        console.log(`      Status: ${enrollment.status}`);
        console.log(`      Progreso: ${enrollment.progressPercentage}%`);
        console.log(`      Inscrito: ${enrollment.enrolledAt}`);
      });
    }

    // Verificar curso específico
    const course = await prisma.course.findUnique({
      where: { slug: 'desarrollo-web-fullstack' },
    });

    if (course) {
      console.log('\n🎯 Curso "Desarrollo Web Full Stack":');
      console.log(`   ID: ${course.id}`);
      console.log(`   Gratis: ${course.isFree}`);
      console.log(`   Requiere auth: ${course.requiresAuth}`);
      console.log(`   Status: ${course.status}`);

      const enrollment = user.enrollments.find(e => e.courseId === course.id);
      if (enrollment) {
        console.log('   ✅ Usuario inscrito en este curso');
      } else {
        console.log('   ❌ Usuario NO inscrito en este curso');
      }
    }

    // Verificar si debería tener acceso automático
    const shouldHaveAccess = user.subscriptions.length > 0 && user.membershipLevel === 'PREMIUM';
    console.log('\n🔐 Análisis de acceso:');
    console.log(`   Tiene suscripción activa: ${user.subscriptions.length > 0}`);
    console.log(`   Nivel premium: ${user.membershipLevel === 'PREMIUM'}`);
    console.log(`   Debería tener acceso: ${shouldHaveAccess}`);

    if (shouldHaveAccess && !user.enrollments.find(e => e.courseId === course?.id)) {
      console.log('\n⚠️  PROBLEMA: Usuario premium pero no inscrito automáticamente');
      console.log('   Solución: Crear inscripción automática...');
      
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course!.id,
          status: 'ACTIVE',
          enrolledAt: new Date(),
        },
      });
      
      console.log('   ✅ Inscripción automática creada');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar debug
debugCurrentUser()
  .then(() => {
    console.log('\n✅ Debug completado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 