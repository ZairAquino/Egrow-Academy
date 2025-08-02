import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUserPayments() {
  try {
    console.log('🔍 Verificando pagos del usuario aquinozair3@gmail.com...\n');

    // 1. Buscar el usuario
    console.log('1️⃣ Buscando usuario...');
    const user = await prisma.user.findUnique({
      where: { email: 'aquinozair3@gmail.com' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true,
        stripeCustomerId: true,
        hasBeenPremium: true,
        createdAt: true
      }
    });

    if (!user) {
      console.log('❌ Usuario aquinozair3@gmail.com no encontrado');
      return;
    }

    console.log('✅ Usuario encontrado:');
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Nombre: ${user.firstName} ${user.lastName}`);
    console.log(`   - Nivel: ${user.membershipLevel}`);
    console.log(`   - Stripe Customer ID: ${user.stripeCustomerId || 'No configurado'}`);
    console.log(`   - Ha sido premium: ${user.hasBeenPremium ? 'Sí' : 'No'}`);
    console.log(`   - Registrado: ${user.createdAt.toLocaleDateString()}`);

    // 2. Buscar pagos del usuario
    console.log('\n2️⃣ Buscando pagos del usuario...');
    const payments = await prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        course: {
          select: { title: true, slug: true }
        },
        subscription: {
          select: { status: true, currentPeriodEnd: true }
        }
      }
    });

    console.log(`   Pagos encontrados: ${payments.length}`);
    
    if (payments.length === 0) {
      console.log('   ❌ No hay pagos registrados para este usuario');
    } else {
      payments.forEach((payment, index) => {
        console.log(`\n   Pago ${index + 1}:`);
        console.log(`   - ID: ${payment.id}`);
        console.log(`   - Stripe Payment ID: ${payment.stripePaymentId}`);
        console.log(`   - Monto: $${payment.amount / 100} ${payment.currency}`);
        console.log(`   - Estado: ${payment.status}`);
        console.log(`   - Método: ${payment.paymentMethod || 'No especificado'}`);
        console.log(`   - Descripción: ${payment.description || 'Sin descripción'}`);
        console.log(`   - Fecha: ${payment.createdAt.toLocaleString()}`);
        
        if (payment.course) {
          console.log(`   - Curso: ${payment.course.title} (${payment.course.slug})`);
        }
        
        if (payment.subscription) {
          console.log(`   - Suscripción: ${payment.subscription.status}`);
          console.log(`   - Válida hasta: ${payment.subscription.currentPeriodEnd.toLocaleDateString()}`);
        }
      });
    }

    // 3. Buscar suscripciones del usuario
    console.log('\n3️⃣ Buscando suscripciones del usuario...');
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        price: {
          select: { unitAmount: true, currency: true, interval: true }
        }
      }
    });

    console.log(`   Suscripciones encontradas: ${subscriptions.length}`);
    
    if (subscriptions.length === 0) {
      console.log('   ❌ No hay suscripciones registradas para este usuario');
    } else {
      subscriptions.forEach((subscription, index) => {
        console.log(`\n   Suscripción ${index + 1}:`);
        console.log(`   - ID: ${subscription.id}`);
        console.log(`   - Stripe Subscription ID: ${subscription.stripeSubscriptionId}`);
        console.log(`   - Estado: ${subscription.status}`);
        console.log(`   - Período actual: ${subscription.currentPeriodStart.toLocaleDateString()} - ${subscription.currentPeriodEnd.toLocaleDateString()}`);
        console.log(`   - Cancelada al final del período: ${subscription.cancelAtPeriodEnd ? 'Sí' : 'No'}`);
        console.log(`   - Fecha de creación: ${subscription.createdAt.toLocaleString()}`);
        
        if (subscription.price) {
          console.log(`   - Precio: $${subscription.price.unitAmount! / 100} ${subscription.price.currency} (${subscription.price.interval})`);
        }
      });
    }

    // 4. Verificar si el pago de prueba debería estar registrado
    console.log('\n4️⃣ Análisis del pago de prueba...');
    
    if (payments.length === 0 && user.hasBeenPremium) {
      console.log('   ⚠️ El usuario tiene hasBeenPremium=true pero no hay pagos registrados');
      console.log('   - Esto indica que el pago se procesó pero no se registró en la BD');
      console.log('   - Posibles causas:');
      console.log('     * El webhook no se ejecutó correctamente');
      console.log('     * Error en el procesamiento del webhook');
      console.log('     * El pago se procesó antes de que los webhooks estuvieran configurados');
    } else if (payments.length > 0) {
      console.log('   ✅ Pagos encontrados y registrados correctamente');
    } else {
      console.log('   ❌ No hay evidencia de pagos procesados');
    }

    // 5. Verificar logs de seguridad o comportamiento
    console.log('\n5️⃣ Verificando logs adicionales...');
    
    const securityLogs = await prisma.securityLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log(`   Logs de seguridad: ${securityLogs.length}`);
    securityLogs.forEach(log => {
      console.log(`   - ${log.event}: ${log.createdAt.toLocaleString()}`);
    });

    // 6. Resumen final
    console.log('\n🎯 Resumen del análisis:');
    console.log(`   - Usuario: ${user.email} (${user.membershipLevel})`);
    console.log(`   - Pagos registrados: ${payments.length}`);
    console.log(`   - Suscripciones registradas: ${subscriptions.length}`);
    console.log(`   - Ha sido premium: ${user.hasBeenPremium}`);
    
    if (payments.length === 0 && user.hasBeenPremium) {
      console.log('\n⚠️ PROBLEMA DETECTADO:');
      console.log('   - El usuario tiene acceso premium pero no hay pagos registrados');
      console.log('   - Esto sugiere que el webhook no funcionó correctamente');
      console.log('   - Recomendación: Verificar configuración de webhooks en Stripe');
    } else if (payments.length > 0) {
      console.log('\n✅ SISTEMA FUNCIONANDO:');
      console.log('   - Los pagos se están registrando correctamente');
      console.log('   - El sistema de webhooks está funcionando');
    }

  } catch (error) {
    console.error('❌ Error verificando pagos del usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserPayments(); 