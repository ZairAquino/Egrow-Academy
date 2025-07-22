import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔧 Creando usuario de prueba para suscripción premium...');

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'testpremium@test.com' }
    });

    if (existingUser) {
      console.log('⚠️ El usuario testpremium@test.com ya existe');
      console.log('📧 Email: testpremium@test.com');
      console.log('🔑 Contraseña: test123');
      console.log('🆔 User ID:', existingUser.id);
      return;
    }

    // Crear hash de la contraseña
    const passwordHash = await bcrypt.hash('test123', 12);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email: 'testpremium@test.com',
        passwordHash: passwordHash,
        firstName: 'Usuario',
        lastName: 'Premium',
        username: 'testpremium',
        membershipLevel: 'FREE',
        isActive: true,
        emailVerified: true,
      }
    });

    console.log('✅ Usuario de prueba creado exitosamente!');
    console.log('📧 Email: testpremium@test.com');
    console.log('🔑 Contraseña: test123');
    console.log('🆔 User ID:', user.id);
    console.log('👤 Nombre:', user.firstName, user.lastName);
    console.log('📊 Nivel de membresía:', user.membershipLevel);

  } catch (error) {
    console.error('❌ Error creando usuario de prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 