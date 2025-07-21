import fetch from 'node-fetch';

async function checkServerEnv() {
  try {
    console.log('🔍 [TEST] Verificando variables de entorno del servidor...\n');

    // Probar diferentes endpoints para ver qué información podemos obtener
    const endpoints = [
      '/api/test-simple',
      '/api/test-jwt-secret',
      '/api/test-prisma',
      '/api/test-db'
    ];

    for (const endpoint of endpoints) {
      console.log(`\n🔍 Probando: ${endpoint}`);
      
      try {
        const response = await fetch(`http://localhost:3000${endpoint}`);
        console.log('Status:', response.status);
        
        if (response.ok) {
          const data = await response.text();
          console.log('Response:', data);
        } else {
          console.log('Error:', response.statusText);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    }

    // Intentar hacer login para ver si funciona
    console.log('\n🔍 Probando login...');
    
    try {
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'luisdavid.ls47@gmail.com',
          password: 'test123456'
        })
      });

      console.log('Login Status:', loginResponse.status);
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login exitoso');
        console.log('Token recibido:', loginData.token ? 'Sí' : 'No');
        
        // Probar la API de progreso con el token del login
        if (loginData.token) {
          console.log('\n🔍 Probando API de progreso con token de login...');
          
          const progressResponse = await fetch('http://localhost:3000/api/courses/progress?courseId=desarrollo-web-fullstack', {
            method: 'GET',
            headers: {
              'Cookie': `auth-token=${loginData.token}`,
              'Content-Type': 'application/json',
            }
          });

          console.log('Progress Status:', progressResponse.status);
          
          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            console.log('✅ API de progreso funciona:');
            console.log(JSON.stringify(progressData, null, 2));
          } else {
            const errorText = await progressResponse.text();
            console.log('❌ Error en progreso:', errorText);
          }
        }
      } else {
        const errorText = await loginResponse.text();
        console.log('❌ Error en login:', errorText);
      }
    } catch (error) {
      console.log('Error en login:', error);
    }

  } catch (error) {
    console.error('💥 Error en test:', error);
  }
}

checkServerEnv(); 