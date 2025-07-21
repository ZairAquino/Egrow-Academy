import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

async function testJWTSecret() {
  try {
    console.log('🔍 [TEST] Probando diferentes valores de JWT_SECRET...\n');

    const userId = 'cmdaqz7xn0000lb04edu7763y';
    
    // Lista de posibles JWT_SECRET
    const possibleSecrets = [
      'your-super-secret-jwt-key-here',
      'your-secret-key',
      'egrow-academy-secret',
      'development-secret',
      'test-secret',
      'default-secret',
      'jwt-secret-key',
      'auth-secret',
      'token-secret'
    ];

    for (const secret of possibleSecrets) {
      console.log(`\n🔍 Probando JWT_SECRET: ${secret}`);
      
      try {
        const token = jwt.sign({ userId }, secret, { expiresIn: '24h' });
        
        const response = await fetch('http://localhost:3000/api/auth/me', {
          method: 'GET',
          headers: {
            'Cookie': `auth-token=${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          console.log('✅ ¡JWT_SECRET encontrado!');
          console.log('Secret:', secret);
          console.log('Token:', token.substring(0, 50) + '...');
          
          // Probar la API de progreso con este token
          console.log('\n🔍 Probando API de progreso...');
          const progressResponse = await fetch('http://localhost:3000/api/courses/progress?courseId=desarrollo-web-fullstack', {
            method: 'GET',
            headers: {
              'Cookie': `auth-token=${token}`,
              'Content-Type': 'application/json',
            }
          });

          console.log('Status:', progressResponse.status);
          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            console.log('✅ API de progreso funciona:');
            console.log(JSON.stringify(progressData, null, 2));
          } else {
            const errorText = await progressResponse.text();
            console.log('❌ Error en progreso:', errorText);
          }
          
          return; // Salir del bucle si encontramos el JWT_SECRET correcto
        } else {
          console.log('❌ No funciona');
        }
      } catch (error) {
        console.log('❌ Error:', error);
      }
    }

    console.log('\n❌ No se encontró el JWT_SECRET correcto');
    console.log('💡 Verifica la configuración del servidor');

  } catch (error) {
    console.error('💥 Error en test:', error);
  }
}

testJWTSecret(); 