import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCompleteFlow() {
  try {
    console.log('🧪 Probando flujo completo de login y suscripción...\n');

    const testEmail = 'luisdavid.ls47@gmail.com';
    const testPassword = 'test123456';

    // Paso 1: Simular login
    console.log('🔍 Paso 1: Simulando login...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.error('❌ Error en login:', errorData);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login exitoso');
    console.log(`   Usuario: ${loginData.user.email}`);
    console.log(`   Token: ${loginData.token ? 'Recibido' : 'No recibido'}`);

    if (!loginData.token) {
      console.error('❌ No se recibió token en el login');
      return;
    }

    // Paso 2: Probar API /api/auth/me con el token
    console.log('\n🔍 Paso 2: Probando /api/auth/me...');
    const meResponse = await fetch('http://localhost:3001/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (meResponse.ok) {
      const meData = await meResponse.json();
      console.log('✅ /api/auth/me exitoso');
      console.log(`   Usuario: ${meData.user.email}`);
      console.log(`   Nivel: ${meData.user.membershipLevel}`);
    } else {
      const errorData = await meResponse.json();
      console.error('❌ Error en /api/auth/me:', errorData);
    }

    // Paso 3: Probar API de suscripción
    console.log('\n🔍 Paso 3: Probando subscription status...');
    const subscriptionResponse = await fetch('http://localhost:3001/api/auth/subscription-status', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (subscriptionResponse.ok) {
      const subscriptionData = await subscriptionResponse.json();
      console.log('✅ Subscription status exitoso');
      console.log(`   Tiene suscripción: ${subscriptionData.hasActiveSubscription}`);
      if (subscriptionData.subscription) {
        console.log(`   Tipo: ${subscriptionData.subscription.price.interval}`);
        console.log(`   Válida hasta: ${subscriptionData.subscription.currentPeriodEnd}`);
      }
    } else {
      const errorData = await subscriptionResponse.json();
      console.error('❌ Error en subscription status:', errorData);
    }

    // Paso 4: Probar acceso al curso
    console.log('\n🔍 Paso 4: Probando acceso al curso...');
    const courseAccessResponse = await fetch('http://localhost:3001/api/courses/desarrollo-web-fullstack/access', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (courseAccessResponse.ok) {
      const courseAccessData = await courseAccessResponse.json();
      console.log('✅ Course access exitoso');
      console.log(`   Tiene acceso: ${courseAccessData.hasAccess}`);
      if (courseAccessData.subscriptionType) {
        console.log(`   Tipo de suscripción: ${courseAccessData.subscriptionType}`);
      }
    } else {
      const errorData = await courseAccessResponse.json();
      console.error('❌ Error en course access:', errorData);
    }

    console.log('\n✅ Flujo completo probado!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar test
testCompleteFlow()
  .then(() => {
    console.log('✅ Test completado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 