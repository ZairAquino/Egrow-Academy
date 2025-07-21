import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

async function testWithCorrectJWT() {
  try {
    console.log('🔍 [TEST] Probando API con JWT_SECRET correcto...\n');

    // Usar el mismo JWT_SECRET que probablemente está usando el servidor
    const jwtSecret = 'your-super-secret-jwt-key-here';
    const userId = 'cmdaqz7xn0000lb04edu7763y';

    console.log('1️⃣ Generando token con JWT_SECRET correcto...');
    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '24h' });
    console.log('✅ Token generado:', token.substring(0, 50) + '...');

    console.log('\n2️⃣ Probando API de progreso...');
    
    const progressResponse = await fetch('http://localhost:3000/api/courses/progress?courseId=desarrollo-web-fullstack', {
      method: 'GET',
      headers: {
        'Cookie': `auth-token=${token}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('Status:', progressResponse.status);
    console.log('Status Text:', progressResponse.statusText);

    if (progressResponse.ok) {
      const progressData = await progressResponse.json();
      console.log('✅ Respuesta exitosa:');
      console.log(JSON.stringify(progressData, null, 2));
    } else {
      const errorText = await progressResponse.text();
      console.log('❌ Error en progreso:', errorText);
    }

    // También probar la API de verificación de token
    console.log('\n3️⃣ Probando API de verificación de token...');
    
    const verifyResponse = await fetch('http://localhost:3000/api/auth/me', {
      method: 'GET',
      headers: {
        'Cookie': `auth-token=${token}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('Status (verify):', verifyResponse.status);
    console.log('Status Text (verify):', verifyResponse.statusText);

    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ Verificación exitosa:', verifyData);
    } else {
      const errorText = await verifyResponse.text();
      console.log('❌ Error en verificación:', errorText);
    }

  } catch (error) {
    console.error('💥 Error en test:', error);
  }
}

testWithCorrectJWT(); 