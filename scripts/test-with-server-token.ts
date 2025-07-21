import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testWithServerToken() {
  try {
    console.log('🧪 Probando con token del servidor...\n');

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
    console.log(`   Token: ${tokenData.token.substring(0, 50)}...`);

    const baseUrl = 'http://localhost:3001';
    const headers = {
      'Authorization': `Bearer ${tokenData.token}`,
      'Content-Type': 'application/json',
    };

    // Test 1: Auth API
    console.log('\n🔍 Test 1: Auth API');
    try {
      const response = await fetch(`${baseUrl}/api/test-auth`, {
        method: 'GET',
        headers,
      });
      
      console.log(`   Status: ${response.status}`);
      const data = await response.json();
      console.log(`   Response:`, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('   ❌ Error:', error);
    }

    // Test 2: Subscription Status API
    console.log('\n🔍 Test 2: Subscription Status API');
    try {
      const response = await fetch(`${baseUrl}/api/auth/subscription-status`, {
        method: 'GET',
        headers,
      });
      
      console.log(`   Status: ${response.status}`);
      const data = await response.json();
      console.log(`   Response:`, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('   ❌ Error:', error);
    }

    // Test 3: Course Access API
    console.log('\n🔍 Test 3: Course Access API');
    try {
      const response = await fetch(`${baseUrl}/api/courses/desarrollo-web-fullstack/access`, {
        method: 'GET',
        headers,
      });
      
      console.log(`   Status: ${response.status}`);
      const data = await response.json();
      console.log(`   Response:`, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('   ❌ Error:', error);
    }

    console.log('\n✅ Tests completados!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar test
testWithServerToken()
  .then(() => {
    console.log('✅ Tests completados!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 