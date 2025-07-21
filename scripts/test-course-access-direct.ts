import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCourseAccessDirect() {
  try {
    console.log('🎓 Probando acceso directo al curso...\n');

    // Buscar usuario con suscripción
    const user = await prisma.user.findFirst({
      where: {
        email: 'luisdavid.ls47@gmail.com',
      },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE',
            currentPeriodEnd: {
              gt: new Date(),
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
    console.log(`🎯 Nivel: ${user.membershipLevel}`);
    console.log(`📋 Suscripciones activas: ${user.subscriptions.length}`);

    // Buscar curso
    const course = await prisma.course.findUnique({
      where: { slug: 'desarrollo-web-fullstack' },
    });

    if (!course) {
      console.log('❌ Curso no encontrado');
      return;
    }

    console.log(`🎓 Curso: ${course.title}`);
    console.log(`   Es gratuito: ${course.isFree}`);
    console.log(`   Estado: ${course.status}`);

    // Verificar acceso
    const hasActiveSubscription = user.subscriptions.length > 0;
    const subscriptionValid = user.subscriptions.some(sub => 
      sub.status === 'ACTIVE' && sub.currentPeriodEnd > new Date()
    );
    const coursePublished = course.status === 'PUBLISHED';
    const courseFree = course.isFree;

    console.log('\n🧮 Verificación de acceso:');
    console.log(`   Tiene suscripción: ${hasActiveSubscription}`);
    console.log(`   Suscripción válida: ${subscriptionValid}`);
    console.log(`   Curso publicado: ${coursePublished}`);
    console.log(`   Curso gratuito: ${courseFree}`);

    const hasAccess = courseFree || (hasActiveSubscription && subscriptionValid);
    console.log(`   ✅ Tiene acceso: ${hasAccess}`);

    // Verificar inscripción
    const enrollment = user.enrollments.find(e => e.course.slug === 'desarrollo-web-fullstack');
    console.log(`   📚 Inscrito en el curso: ${enrollment ? 'Sí' : 'No'}`);

    if (hasAccess && !enrollment) {
      console.log('\n🔄 Creando inscripción automática...');
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
          status: 'ACTIVE',
          enrolledAt: new Date(),
        },
      });
      console.log('✅ Inscripción creada');
    }

    console.log('\n🎉 Prueba completada!');
    console.log('\n📋 Resumen:');
    console.log(`   El usuario ${hasAccess ? 'TIENE' : 'NO TIENE'} acceso al curso`);
    console.log(`   Debería ver: ${hasAccess ? '"Continuar Curso" o "Comenzar Curso"' : '"Acceso Premium"'}`);

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar prueba
testCourseAccessDirect()
  .then(() => {
    console.log('✅ Prueba completada exitosamente!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 