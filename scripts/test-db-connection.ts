import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log('🔍 Verificando conexión a la base de datos...');

  try {
    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Verificar si existe el usuario de prueba
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@egrowacademy.com' }
    });

    if (existingUser) {
      console.log('✅ Usuario de prueba ya existe');
      console.log('📧 Email: test@egrowacademy.com');
      console.log('🔑 Contraseña: test123');
      return;
    }

    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('test123', 12);
    
    const testUser = await prisma.user.create({
      data: {
        email: 'test@egrowacademy.com',
        passwordHash: hashedPassword,
        firstName: 'Usuario',
        lastName: 'Prueba',
        username: 'testuser',
        membershipLevel: 'FREE',
        isActive: true,
        emailVerified: true
      }
    });

    console.log('✅ Usuario de prueba creado exitosamente');
    console.log('📧 Email: test@egrowacademy.com');
    console.log('🔑 Contraseña: test123');
    console.log('🆔 User ID:', testUser.id);

    // Verificar que se puede hacer login
    const loginUser = await prisma.user.findUnique({
      where: { email: 'test@egrowacademy.com' }
    });

    if (loginUser) {
      console.log('✅ Usuario disponible para login');
    }

  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection(); 