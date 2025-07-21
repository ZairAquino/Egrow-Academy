import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyTestUser() {
  try {
    console.log('🔍 Verificando usuario de pruebas...\n');

    const testEmail = 'luisdavid.ls47@gmail.com';

    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
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

    console.log(`👤 Usuario encontrado: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email verificado: ${user.emailVerified}`);
    console.log(`   Nivel: ${user.membershipLevel}`);
    console.log(`   Suscripciones activas: ${user.subscriptions.length}`);

    // Verificar si el email ya está verificado
    if (user.emailVerified) {
      console.log('✅ El email ya está verificado');
      return;
    }

    // Verificar el email manualmente
    console.log('\n🔧 Verificando email manualmente...');
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationExpires: null,
      },
    });

    console.log('✅ Email verificado exitosamente');
    console.log('✅ Código de verificación eliminado');

    // Verificar el estado final
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    console.log('\n📋 Estado final:');
    console.log(`   Email verificado: ${updatedUser?.emailVerified}`);
    console.log(`   Código de verificación: ${updatedUser?.verificationCode ? 'SÍ' : 'NO'}`);

    console.log('\n🎉 ¡Usuario listo para iniciar sesión!');
    console.log('\n📋 Credenciales:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Contraseña: test123456`);
    console.log(`   Email verificado: SÍ`);
    console.log(`   Nivel: ${user.membershipLevel}`);
    console.log(`   Suscripción: ACTIVA`);

  } catch (error) {
    console.error('❌ Error verificando usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar verificación
verifyTestUser()
  .then(() => {
    console.log('✅ Verificación completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 