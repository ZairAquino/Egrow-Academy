import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function testWithServerJWT() {
  try {
    console.log('🧪 Probando con JWT del servidor...\n');

    const testEmail = 'luisdavid.ls47@gmail.com';
    
    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    // Primero, obtener el JWT_SECRET del servidor
    console.log('🔍 Obteniendo JWT_SECRET del servidor...');
    const jwtResponse = await fetch('http://localhost:3001/api/test-jwt-secret');
    const jwtData = await jwtResponse.json();
    console.log('🔍 JWT_SECRET del servidor:', jwtData);

    // Generar token JWT con el mismo secret
    const JWT_SECRET = 'egrow-academy-jwt-secret-key-2024'; // El que configuramos
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

    // Test: Subscription Status API
    console.log('\n🔍 Test: Subscription Status API');
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

    console.log('\n✅ Tests completados!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar test
testWithServerJWT()
  .then(() => {
    console.log('✅ Tests completados!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 