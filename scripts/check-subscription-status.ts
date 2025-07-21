import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSubscriptionStatus() {
  try {
    console.log('🔍 Verificando estado de suscripción...');

    // Buscar usuario con suscripción
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: '@',
        },
      },
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
      console.log('❌ No se encontró ningún usuario');
      return;
    }

    console.log(`👤 Usuario: ${user.email}`);
    console.log(`🎯 Nivel de membresía: ${user.membershipLevel}`);
    console.log(`📅 Último login: ${user.lastLogin || 'Nunca'}`);

    if (user.subscriptions.length === 0) {
      console.log('❌ No tiene suscripciones activas');
    } else {
      const subscription = user.subscriptions[0];
      console.log('\n📋 Detalles de Suscripción:');
      console.log(`   ID: ${subscription.id}`);
      console.log(`   Stripe ID: ${subscription.stripeSubscriptionId}`);
      console.log(`   Estado: ${subscription.status}`);
      console.log(`   Inicio: ${subscription.currentPeriodStart}`);
      console.log(`   Fin: ${subscription.currentPeriodEnd}`);
      console.log(`   Producto: ${subscription.price.product.name}`);
      console.log(`   Precio: $${(subscription.price.unitAmount || 0) / 100}/mes`);
    }

    console.log('\n📚 Cursos Inscritos:');
    if (user.enrollments.length === 0) {
      console.log('   ❌ No está inscrito en ningún curso');
    } else {
      user.enrollments.forEach((enrollment) => {
        console.log(`   ✅ ${enrollment.course.title} (${enrollment.status})`);
      });
    }

    // Verificar acceso a curso premium
    const course = await prisma.course.findUnique({
      where: { slug: 'desarrollo-web-fullstack' },
    });

    if (course) {
      const hasAccess = user.subscriptions.length > 0 && 
                       user.subscriptions[0].status === 'ACTIVE' &&
                       user.subscriptions[0].currentPeriodEnd > new Date();
      
      console.log(`\n🔐 Acceso a "${course.title}":`);
      console.log(`   ${hasAccess ? '✅ Tiene acceso' : '❌ Sin acceso'}`);
    }

    console.log('\n🎉 Verificación completada!');

  } catch (error) {
    console.error('❌ Error verificando suscripción:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
checkSubscriptionStatus()
  .then(() => {
    console.log('✅ Verificación exitosa!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 