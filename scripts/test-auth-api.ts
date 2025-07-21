import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function testAuthAPI() {
  try {
    console.log('🧪 Probando API de autenticación...\n');

    const testEmail = 'luisdavid.ls47@gmail.com';
    
    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    // Generar token JWT manualmente
    const JWT_SECRET = 'egrow-academy-jwt-secret-key-2024';
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    console.log(`👤 Usuario: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Token generado: ${token.substring(0, 50)}...`);

    const baseUrl = 'http://localhost:3001';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // Test: Auth API
    console.log('\n🔍 Test: Auth API');
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

    console.log('\n✅ Test completado!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar test
testAuthAPI()
  .then(() => {
    console.log('✅ Test completado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 