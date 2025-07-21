// Usar fetch nativo de Node.js

const BASE_URL = 'http://localhost:3001';

async function testSubscriptionAPIs() {
  try {
    console.log('🧪 Probando APIs de suscripción...\n');

    // 1. Probar API de estado de suscripción (sin autenticación)
    console.log('1️⃣ Probando /api/auth/subscription-status (sin auth)...');
    try {
      const response = await fetch(`${BASE_URL}/api/auth/subscription-status`);
      const data = await response.json();
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }

    // 2. Probar API de acceso a curso (sin autenticación)
    console.log('\n2️⃣ Probando /api/courses/desarrollo-web-fullstack/access (sin auth)...');
    try {
      const response = await fetch(`${BASE_URL}/api/courses/desarrollo-web-fullstack/access`);
      const data = await response.json();
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }

    // 3. Probar página de suscripción
    console.log('\n3️⃣ Probando página de suscripción...');
    try {
      const response = await fetch(`${BASE_URL}/subscription`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Content-Type: ${response.headers.get('content-type')}`);
      if (response.status === 200) {
        console.log('   ✅ Página de suscripción accesible');
      } else {
        console.log('   ❌ Error accediendo a la página');
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }

    // 4. Probar página del curso premium
    console.log('\n4️⃣ Probando página del curso premium...');
    try {
      const response = await fetch(`${BASE_URL}/curso/desarrollo-web-fullstack`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Content-Type: ${response.headers.get('content-type')}`);
      if (response.status === 200) {
        console.log('   ✅ Página del curso accesible');
      } else {
        console.log('   ❌ Error accediendo a la página');
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }

    console.log('\n🎉 Pruebas completadas!');
    console.log('\n📋 Resumen:');
    console.log('- Las APIs deberían devolver 401 (no autenticado)');
    console.log('- Las páginas deberían ser accesibles (200)');
    console.log('- Para probar con autenticación, inicia sesión en el navegador');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  }
}

// Ejecutar las pruebas
testSubscriptionAPIs()
  .then(() => {
    console.log('✅ Pruebas completadas exitosamente!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 