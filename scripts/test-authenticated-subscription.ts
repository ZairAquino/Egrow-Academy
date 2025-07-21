import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function testAuthenticatedSubscription() {
  try {
    console.log('🔐 Probando verificación de suscripción con autenticación...\n');

    // Buscar usuario con suscripción
    const user = await prisma.user.findFirst({
      where: {
        email: 'luisdavid.ls47@gmail.com',
      },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE',
            currentPeriodEnd: {
              gt: new Date(),
            },
          },
        },
      },
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log(`👤 Usuario: ${user.email}`);
    console.log(`🎯 Nivel: ${user.membershipLevel}`);
    console.log(`📋 Suscripciones activas: ${user.subscriptions.length}`);

    // Crear token JWT para el usuario
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log(`🔑 Token JWT creado: ${token.substring(0, 50)}...`);

    // Simular request a la API con autenticación
    const response = await fetch('http://localhost:3001/api/auth/subscription-status', {
      method: 'GET',
      headers: {
        'Cookie': `token=${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`📡 Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`📋 Response: ${JSON.stringify(data, null, 2)}`);
    } else {
      const errorData = await response.json();
      console.log(`❌ Error: ${JSON.stringify(errorData, null, 2)}`);
    }

    // Probar API de acceso a curso
    console.log('\n🎓 Probando acceso a curso...');
    const courseResponse = await fetch('http://localhost:3001/api/courses/desarrollo-web-fullstack/access', {
      method: 'GET',
      headers: {
        'Cookie': `token=${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`📡 Status: ${courseResponse.status}`);
    
    if (courseResponse.ok) {
      const courseData = await courseResponse.json();
      console.log(`📋 Response: ${JSON.stringify(courseData, null, 2)}`);
    } else {
      const errorData = await courseResponse.json();
      console.log(`❌ Error: ${JSON.stringify(errorData, null, 2)}`);
    }

    console.log('\n🎉 Pruebas completadas!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar las pruebas
testAuthenticatedSubscription()
  .then(() => {
    console.log('✅ Pruebas completadas exitosamente!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 