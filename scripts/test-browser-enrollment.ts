import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testBrowserEnrollment() {
  console.log('🌐 [TEST] Simulando petición del navegador...');

  try {
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Obtener usuario de prueba
    const testUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });

    if (!testUser) {
      console.log('❌ Usuario de prueba no encontrado');
      return;
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: testUser.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // Crear sesión en BD
    const session = await prisma.session.create({
      data: {
        token: token,
        userId: testUser.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
      }
    });

    console.log('📝 Sesión creada:', session.id);

    // Simular petición del navegador
    const baseUrl = 'http://localhost:3000';
    const courseId = 'monetiza-ia';
    
    console.log(`🌐 Haciendo petición a: ${baseUrl}/api/courses/enrollment-status?courseId=${courseId}`);

    const response = await fetch(`${baseUrl}/api/courses/enrollment-status?courseId=${courseId}`, {
      method: 'GET',
      headers: {
        'Cookie': `auth-token=${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('OK:', response.ok);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Datos de respuesta:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
    }

    // Limpiar sesión
    await prisma.session.delete({
      where: { id: session.id }
    });

    console.log('🧹 Sesión eliminada');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  testBrowserEnrollment()
    .then(() => {
      console.log('\n✅ Prueba completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { testBrowserEnrollment }; 