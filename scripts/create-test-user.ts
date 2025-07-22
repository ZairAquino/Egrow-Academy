import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🧪 [TEST] Creando usuario de prueba...');

    // Verificar si ya existe un usuario de prueba
    const existingUser = await prisma.user.findFirst({
      where: {
        email: 'test@test.com'
      }
    });

    if (existingUser) {
      console.log('⚠️ [TEST] El usuario de prueba ya existe:', existingUser.email);
      return existingUser;
    }

    // Crear hash de contraseña
    const hashedPassword = await hash('test123', 12);

    // Crear usuario de prueba
    const testUser = await prisma.user.create({
      data: {
        email: 'test@test.com',
        username: 'testuser',
        firstName: 'Usuario',
        lastName: 'Prueba',
        passwordHash: hashedPassword,
        isActive: true,
        emailVerified: true,
        membershipLevel: 'FREE'
      }
    });

    console.log('✅ [TEST] Usuario de prueba creado exitosamente:');
    console.log('  - Email:', testUser.email);
    console.log('  - Username:', testUser.username);
    console.log('  - Nombre:', testUser.firstName, testUser.lastName);
    console.log('  - Nivel:', testUser.membershipLevel);
    console.log('');
    console.log('🔑 [TEST] Credenciales de acceso:');
    console.log('  - Email: test@test.com');
    console.log('  - Contraseña: test123');
    console.log('');
    console.log('🌐 [TEST] Puedes iniciar sesión en: http://localhost:3000/login');

    return testUser;

  } catch (error) {
    console.error('❌ [TEST] Error creando usuario de prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
createTestUser(); 