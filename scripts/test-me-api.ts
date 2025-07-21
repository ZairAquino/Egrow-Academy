import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testMeAPI() {
  try {
    console.log('🧪 Probando API /api/auth/me...\n');

    // Obtener token del servidor
    console.log('🔍 Obteniendo token del servidor...');
    const tokenResponse = await fetch('http://localhost:3001/api/generate-test-token');
    const tokenData = await tokenResponse.json();
    
    if (tokenResponse.status !== 200) {
      console.error('❌ Error obteniendo token:', tokenData);
      return;
    }
    
    console.log('✅ Token obtenido del servidor');
    console.log(`   Usuario: ${tokenData.email}`);

    const baseUrl = 'http://localhost:3001';
    const headers = {
      'Authorization': `Bearer ${tokenData.token}`,
      'Content-Type': 'application/json',
    };

    // Test: /api/auth/me API
    console.log('\n🔍 Test: /api/auth/me API');
    try {
      const response = await fetch(`${baseUrl}/api/auth/me`, {
        method: 'GET',
        headers,
      });
      
      console.log(`   Status: ${response.status}`);
      const data = await response.json();
      console.log(`   Response:`, JSON.stringify(data, null, 2));
      
      if (response.status === 200) {
        console.log('✅ API /api/auth/me funcionando correctamente');
        console.log(`   Usuario autenticado: ${data.user?.email}`);
        console.log(`   Nivel: ${data.user?.membershipLevel}`);
        console.log(`   Inscripciones: ${data.user?.enrollments?.length || 0}`);
      } else {
        console.log('❌ API /api/auth/me fallando');
      }
    } catch (error) {
      console.error('   ❌ Error:', error);
    }

    console.log('\n✅ Test completado!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar test
testMeAPI()
  .then(() => {
    console.log('✅ Test completado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 