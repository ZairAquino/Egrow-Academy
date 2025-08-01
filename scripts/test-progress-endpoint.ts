import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testProgressEndpoint() {
  console.log('🧪 [TEST] Probando endpoint de progress...');

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

    // Probar endpoint con diferentes courseIds
    const testCases = [
      'asistentes-virtuales-ia',
      'monetiza-ia',
      'desarrollo-web-fullstack'
    ];

    for (const courseId of testCases) {
      console.log(`\n🔍 Probando con courseId: ${courseId}`);
      
      const response = await fetch(`http://localhost:3000/api/courses/progress?courseId=${courseId}`, {
        method: 'GET',
        headers: {
          'Cookie': `auth-token=${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📊 Respuesta:');
      console.log('Status:', response.status);
      console.log('OK:', response.ok);
      console.log('StatusText:', response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Datos:', data);
      } else {
        const errorText = await response.text();
        console.log('❌ Error:', errorText);
      }
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
  testProgressEndpoint()
    .then(() => {
      console.log('\n✅ Prueba completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { testProgressEndpoint }; 