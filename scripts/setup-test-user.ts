import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function setupTestUser() {
  try {
    console.log('👤 Configurando usuario de pruebas...\n');

    const testEmail = 'luisdavid.ls47@gmail.com';
    const testPassword = 'test123456'; // Contraseña simple para pruebas

    // Verificar si el usuario existe
    let user = await prisma.user.findUnique({
      where: { email: testEmail },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE',
            currentPeriodEnd: {
              gt: new Date(),
            },
          },
        },
      },
    });

    if (user) {
      console.log(`✅ Usuario encontrado: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nivel: ${user.membershipLevel}`);
      console.log(`   Suscripciones activas: ${user.subscriptions.length}`);
      
      // Actualizar contraseña
      const hashedPassword = await hashPassword(testPassword);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashedPassword },
      });
      
      console.log('🔑 Contraseña actualizada');
    } else {
      console.log('📝 Creando nuevo usuario de pruebas...');
      
      const hashedPassword = await hashPassword(testPassword);
      user = await prisma.user.create({
        data: {
          email: testEmail,
          passwordHash: hashedPassword,
          firstName: 'Luis David',
          lastName: 'Test User',
          username: 'luisdavid_test',
          membershipLevel: 'FREE',
          isActive: true,
          emailVerified: true,
        },
        include: {
          subscriptions: true,
        },
      });
      
      console.log(`✅ Usuario creado: ${user.email}`);
      console.log(`   ID: ${user.id}`);
    }

    // Verificar suscripción
    if (user.subscriptions.length === 0) {
      console.log('\n💰 Configurando suscripción de prueba...');
      
      // Buscar precio de prueba
      let price = await prisma.price.findFirst({
        where: {
          stripePriceId: {
            startsWith: 'price_test_',
          },
        },
        include: {
          product: true,
        },
      });

      if (!price) {
        console.log('📦 Creando producto y precio de prueba...');
        
        const product = await prisma.product.create({
          data: {
            stripeProductId: 'prod_test_subscription',
            name: 'Suscripción de Prueba',
            description: 'Suscripción para pruebas de desarrollo',
            active: true,
          },
        });

        price = await prisma.price.create({
          data: {
            stripePriceId: 'price_test_monthly',
            active: true,
            currency: 'usd',
            type: 'RECURRING',
            unitAmount: 1999, // $19.99
            interval: 'MONTH',
            intervalCount: 1,
            productId: product.id,
          },
          include: {
            product: true,
          },
        });
      }

      // Crear suscripción
      const subscription = await prisma.subscription.create({
        data: {
          stripeSubscriptionId: `sub_test_${Date.now()}`,
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          cancelAtPeriodEnd: false,
          userId: user.id,
          priceId: price.id,
          metadata: {
            test: true,
            createdBy: 'setup-test-user-script',
          },
        },
      });

      // Actualizar nivel de membresía
      await prisma.user.update({
        where: { id: user.id },
        data: { membershipLevel: 'PREMIUM' },
      });

      console.log('✅ Suscripción creada');
      console.log(`   Válida hasta: ${subscription.currentPeriodEnd}`);
    }

    // Verificar inscripción en curso
    const course = await prisma.course.findUnique({
      where: { slug: 'desarrollo-web-fullstack' },
    });

    if (course) {
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          userId: user.id,
          courseId: course.id,
        },
      });

      if (!enrollment) {
        console.log('\n📚 Creando inscripción en curso...');
        await prisma.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            status: 'ACTIVE',
            enrolledAt: new Date(),
          },
        });
        console.log('✅ Inscripción creada');
      } else {
        console.log('✅ Ya está inscrito en el curso');
      }
    }

    console.log('\n🎉 Usuario de pruebas configurado!');
    console.log('\n📋 Credenciales:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Contraseña: ${testPassword}`);
    console.log(`   Nivel: PREMIUM`);
    console.log(`   Suscripción: ACTIVA`);
    console.log(`   Curso: Inscrito en "Desarrollo Web Full Stack"`);

    console.log('\n🔗 Para probar:');
    console.log('   1. Ir a http://localhost:3001');
    console.log('   2. Iniciar sesión con las credenciales arriba');
    console.log('   3. Ir a /curso/desarrollo-web-fullstack');
    console.log('   4. Debería ver "Continuar Curso" o "Comenzar Curso"');

  } catch (error) {
    console.error('❌ Error configurando usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar configuración
setupTestUser()
  .then(() => {
    console.log('✅ Configuración completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 