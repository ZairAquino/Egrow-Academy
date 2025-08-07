import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testApiWithSession() {
  try {
    console.log('🔍 [API SESSION TEST] Probando API con sesión...');

    // Buscar la sesión más reciente
    const session = await prisma.session.findFirst({
      where: {
        token: {
          startsWith: 'test-session-'
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!session) {
      console.log('❌ No se encontró ninguna sesión de prueba');
      return;
    }

    console.log(`👤 Usuario de la sesión: ${session.user.email}`);
    console.log(`🔑 Token de sesión: ${session.token}`);

    // Probar la API GET con la sesión
    const response = await fetch('http://localhost:3000/api/courses/progress?courseId=guiones-videos-promocionales-ia', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${session.token}`
      }
    });

    console.log('📡 [API] Respuesta:', response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API GET exitosa con sesión:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const errorData = await response.json();
      console.log('❌ API GET falló con sesión:');
      console.log(`Status: ${response.status}`);
      console.log(JSON.stringify(errorData, null, 2));
    }

  } catch (error) {
    console.error('❌ Error en la prueba de API con sesión:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testApiWithSession();
