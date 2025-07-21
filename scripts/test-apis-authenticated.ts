import { PrismaClient } from '@prisma/client';
import { generateToken } from '../src/lib/auth';

const prisma = new PrismaClient();

async function testAuthenticatedAPIs() {
  try {
    console.log('🧪 Probando APIs autenticadas...\n');

    const testEmail = 'luisdavid.ls47@gmail.com';
    
    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    // Generar token JWT
    const token = generateToken(user.id);
    console.log(`👤 Usuario: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Token generado: ${token.substring(0, 50)}...`);

    const baseUrl = 'http://localhost:3001';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // Test 1: Subscription Status API
    console.log('\n🔍 Test 1: Subscription Status API');
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

    // Test 2: Course Access API
    console.log('\n🔍 Test 2: Course Access API');
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

    // Test 3: User Courses API
    console.log('\n🔍 Test 3: User Courses API');
    try {
      const response = await fetch(`${baseUrl}/api/courses/user-courses`, {
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

// Ejecutar tests
testAuthenticatedAPIs()
  .then(() => {
    console.log('✅ Tests completados!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 