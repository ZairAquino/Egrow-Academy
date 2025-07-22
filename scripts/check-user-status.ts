import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUserStatus() {
  try {
    console.log('🔍 [CHECK] Verificando estado del usuario...');

    const userEmail = 'solismartinezluisdavid@gmail.com';
    
    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE'
          }
        },
        enrollments: {
          include: {
            course: true
          }
        }
      }
    });

    if (!user) {
      console.log('❌ [CHECK] Usuario no encontrado:', userEmail);
      return;
    }

    console.log('✅ [CHECK] Usuario encontrado:');
    console.log('  - ID:', user.id);
    console.log('  - Email:', user.email);
    console.log('  - Nombre:', user.firstName, user.lastName);
    console.log('  - Nivel actual:', user.membershipLevel);
    console.log('  - Email verificado:', user.emailVerified);
    console.log('  - Activo:', user.isActive);
    console.log('  - Customer ID de Stripe:', user.stripeCustomerId);

    // Verificar suscripciones
    console.log('\n📊 [CHECK] Suscripciones:');
    if (user.subscriptions.length === 0) {
      console.log('  - No tiene suscripciones activas');
    } else {
      user.subscriptions.forEach(sub => {
        console.log('  - ID:', sub.id);
        console.log('    Status:', sub.status);
        console.log('    Periodo actual hasta:', sub.currentPeriodEnd);
        console.log('    Stripe Subscription ID:', sub.stripeSubscriptionId);
      });
    }

    // Verificar inscripciones
    console.log('\n📚 [CHECK] Inscripciones en cursos:');
    if (user.enrollments.length === 0) {
      console.log('  - No está inscrito en ningún curso');
    } else {
      user.enrollments.forEach(enrollment => {
        console.log(`  - ${enrollment.course.title} (${enrollment.course.slug})`);
        console.log(`    Status: ${enrollment.status}`);
        console.log(`    Progreso: ${enrollment.progressPercentage}%`);
      });
    }

    // Verificar pagos
    const payments = await prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log('\n💳 [CHECK] Últimos pagos:');
    if (payments.length === 0) {
      console.log('  - No hay pagos registrados');
    } else {
      payments.forEach(payment => {
        console.log('  - ID:', payment.id);
        console.log('    Stripe Payment ID:', payment.stripePaymentId);
        console.log('    Status:', payment.status);
        console.log('    Monto:', payment.amount, payment.currency);
        console.log('    Fecha:', payment.createdAt);
      });
    }

  } catch (error) {
    console.error('❌ [CHECK] Error verificando usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
checkUserStatus(); 