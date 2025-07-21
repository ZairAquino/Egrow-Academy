import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugSubscriptionIssue() {
  try {
    console.log('🔍 Debuggeando problema de suscripción...\n');

    // 1. Verificar usuario
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

    console.log('👤 Usuario encontrado:');
    console.log(`   Email: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Nivel: ${user.membershipLevel}`);
    console.log(`   Suscripciones: ${user.subscriptions.length}`);

    if (user.subscriptions.length > 0) {
      const sub = user.subscriptions[0];
      console.log('\n📋 Detalles de suscripción:');
      console.log(`   ID: ${sub.id}`);
      console.log(`   Stripe ID: ${sub.stripeSubscriptionId}`);
      console.log(`   Estado: ${sub.status}`);
      console.log(`   Inicio: ${sub.currentPeriodStart}`);
      console.log(`   Fin: ${sub.currentPeriodEnd}`);
      console.log(`   Producto: ${sub.price.product.name}`);
      console.log(`   Precio: $${(sub.price.unitAmount || 0) / 100}/mes`);
    }

    console.log('\n📚 Inscripciones:');
    user.enrollments.forEach((enrollment) => {
      console.log(`   ✅ ${enrollment.course.title} (${enrollment.status})`);
    });

    // 2. Verificar curso
    const course = await prisma.course.findUnique({
      where: { slug: 'desarrollo-web-fullstack' },
    });

    if (course) {
      console.log('\n🎓 Curso encontrado:');
      console.log(`   Título: ${course.title}`);
      console.log(`   Slug: ${course.slug}`);
      console.log(`   Es gratuito: ${course.isFree}`);
      console.log(`   Requiere auth: ${course.requiresAuth}`);
      console.log(`   Estado: ${course.status}`);
    }

    // 3. Verificar JWT_SECRET
    console.log('\n🔑 Variables de entorno:');
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? 'Configurado' : 'NO CONFIGURADO'}`);
    console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'Configurado' : 'NO CONFIGURADO'}`);

    // 4. Simular lógica de verificación
    console.log('\n🧮 Simulando verificación de acceso:');
    const hasActiveSubscription = user.subscriptions.length > 0;
    const subscriptionValid = user.subscriptions.some(sub => 
      sub.status === 'ACTIVE' && sub.currentPeriodEnd > new Date()
    );
    const courseExists = !!course;
    const coursePublished = course?.status === 'PUBLISHED';
    const courseFree = course?.isFree;

    console.log(`   Tiene suscripción: ${hasActiveSubscription}`);
    console.log(`   Suscripción válida: ${subscriptionValid}`);
    console.log(`   Curso existe: ${courseExists}`);
    console.log(`   Curso publicado: ${coursePublished}`);
    console.log(`   Curso gratuito: ${courseFree}`);

    const hasAccess = courseFree || (hasActiveSubscription && subscriptionValid);
    console.log(`   ✅ Tiene acceso: ${hasAccess}`);

    console.log('\n🎉 Debug completado!');

  } catch (error) {
    console.error('❌ Error en debug:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar debug
debugSubscriptionIssue()
  .then(() => {
    console.log('✅ Debug completado exitosamente!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 