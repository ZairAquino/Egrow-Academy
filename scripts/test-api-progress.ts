import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function testApiProgress() {
  try {
    console.log('🔍 [API TEST] Probando API de progreso...');

    // Buscar un usuario de prueba
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: '@'
        }
      },
      select: {
        id: true,
        email: true
      }
    });

    if (!user) {
      console.log('❌ No se encontró ningún usuario para probar');
      return;
    }

    console.log(`👤 Usuario de prueba: ${user.email} (${user.id})`);

    // Crear un token JWT para el usuario
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    console.log(`🔑 Token generado: ${token.substring(0, 20)}...`);

    // Probar la API GET
    const response = await fetch('http://localhost:3000/api/courses/progress?courseId=guiones-videos-promocionales-ia', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API GET exitosa:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const errorData = await response.json();
      console.log('❌ API GET falló:');
      console.log(`Status: ${response.status}`);
      console.log(JSON.stringify(errorData, null, 2));
    }

  } catch (error) {
    console.error('❌ Error en la prueba de API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testApiProgress();
