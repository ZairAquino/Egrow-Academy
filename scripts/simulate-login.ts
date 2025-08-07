import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function simulateLogin() {
  try {
    console.log('🔐 [LOGIN] Simulando login de usuario...');

    // Buscar un usuario de prueba
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: '@'
        }
      },
      select: {
        id: true,
        email: true,
        passwordHash: true
      }
    });

    if (!user) {
      console.log('❌ No se encontró ningún usuario para probar');
      return;
    }

    console.log(`👤 Usuario encontrado: ${user.email} (${user.id})`);

    // Crear una sesión para el usuario
    const sessionToken = `test-session-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    const session = await prisma.session.create({
      data: {
        token: sessionToken,
        userId: user.id,
        expiresAt: expiresAt
      }
    });

    console.log('✅ Sesión creada exitosamente');
    console.log(`🔑 Token de sesión: ${sessionToken}`);
    console.log(`⏰ Expira: ${expiresAt.toISOString()}`);

    // Crear una cookie de sesión
    const cookieValue = `session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;
    
    console.log('\n🍪 Cookie para el navegador:');
    console.log(cookieValue);
    
    console.log('\n📝 Instrucciones para probar:');
    console.log('1. Abre las herramientas de desarrollador del navegador (F12)');
    console.log('2. Ve a la pestaña Application/Storage');
    console.log('3. En Cookies, busca localhost:3000');
    console.log('4. Agrega una nueva cookie con:');
    console.log(`   - Name: session`);
    console.log(`   - Value: ${sessionToken}`);
    console.log('5. Recarga la página del curso');

  } catch (error) {
    console.error('❌ Error en la simulación de login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simulateLogin();
