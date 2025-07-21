import fetch from 'node-fetch';

async function testProgressAPIDirect() {
  try {
    console.log('🔍 [TEST] Probando API de progreso directamente...\n');

    // Primero obtener un token válido
    console.log('1️⃣ Obteniendo token de autenticación...');
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'luisdavid.ls47@gmail.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Error en login:', loginResponse.status, loginResponse.statusText);
      const errorText = await loginResponse.text();
      console.log('Error details:', errorText);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login exitoso');

    // Extraer cookies
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Cookies recibidas:', cookies);

    // Probar la API de progreso
    console.log('\n2️⃣ Probando API de progreso...');
    
    const progressResponse = await fetch('http://localhost:3000/api/courses/progress?courseId=desarrollo-web-fullstack', {
      method: 'GET',
      headers: {
        'Cookie': cookies || '',
        'Content-Type': 'application/json',
      }
    });

    console.log('Status:', progressResponse.status);
    console.log('Status Text:', progressResponse.statusText);

    if (progressResponse.ok) {
      const progressData = await progressResponse.json();
      console.log('✅ Respuesta exitosa:', progressData);
    } else {
      const errorText = await progressResponse.text();
      console.log('❌ Error en progreso:', errorText);
    }

  } catch (error) {
    console.error('💥 Error en test:', error);
  }
}

testProgressAPIDirect(); 