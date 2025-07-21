async function testSimpleAPI() {
  try {
    console.log('🧪 Probando APIs simples...\n');

    // Probar página principal
    console.log('1️⃣ Probando página principal...');
    try {
      const response = await fetch('http://localhost:3001/');
      console.log(`   Status: ${response.status}`);
      if (response.status === 200) {
        console.log('   ✅ Página principal accesible');
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }

    // Probar página de suscripción
    console.log('\n2️⃣ Probando página de suscripción...');
    try {
      const response = await fetch('http://localhost:3001/subscription');
      console.log(`   Status: ${response.status}`);
      if (response.status === 200) {
        console.log('   ✅ Página de suscripción accesible');
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }

    // Probar página del curso
    console.log('\n3️⃣ Probando página del curso...');
    try {
      const response = await fetch('http://localhost:3001/curso/desarrollo-web-fullstack');
      console.log(`   Status: ${response.status}`);
      if (response.status === 200) {
        console.log('   ✅ Página del curso accesible');
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }

    // Probar API de suscripción (sin auth)
    console.log('\n4️⃣ Probando API de suscripción (sin auth)...');
    try {
      const response = await fetch('http://localhost:3001/api/auth/subscription-status');
      console.log(`   Status: ${response.status}`);
      if (response.status === 401) {
        console.log('   ✅ API protegida correctamente (401 sin auth)');
      } else {
        const data = await response.json();
        console.log(`   📋 Response: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }

    console.log('\n🎉 Pruebas completadas!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  }
}

// Ejecutar las pruebas
testSimpleAPI()
  .then(() => {
    console.log('✅ Pruebas completadas exitosamente!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 