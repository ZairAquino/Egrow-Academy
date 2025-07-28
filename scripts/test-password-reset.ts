import { prisma } from '../src/lib/prisma';
import crypto from 'crypto';

async function testPasswordReset() {
  console.log('🧪 Probando sistema de recuperación de contraseña...');
  
  try {
    // Test 1: Verificar conexión a base de datos
    console.log('🗄️ Verificando conexión a base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión a base de datos exitosa');
    
    // Test 2: Buscar un usuario de prueba
    console.log('👤 Buscando usuario de prueba...');
    const testUser = await prisma.user.findFirst({
      where: {
        email: {
          contains: '@'
        }
      }
    });
    
    if (!testUser) {
      console.log('❌ No se encontró ningún usuario en la base de datos');
      console.log('💡 Crea un usuario primero en: http://localhost:3000/register');
      return;
    }
    
    console.log('✅ Usuario encontrado:', testUser.email);
    
    // Test 3: Simular proceso de forgot-password
    console.log('📧 Simulando proceso de forgot-password...');
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    
    // Actualizar usuario con token de restablecimiento
    await prisma.user.update({
      where: { id: testUser.id },
      data: {
        verificationCode: resetToken,
        verificationCodeExpires: resetTokenExpires
      }
    });
    
    console.log('✅ Token de restablecimiento generado');
    console.log('🔑 Token:', resetToken);
    console.log('⏰ Expira:', resetTokenExpires.toLocaleString());
    
    // Test 4: Simular URL de restablecimiento
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    console.log('🔗 URL de restablecimiento:', resetUrl);
    
    // Test 5: Verificar token en base de datos
    console.log('🔍 Verificando token en base de datos...');
    const userWithToken = await prisma.user.findFirst({
      where: {
        verificationCode: resetToken,
        verificationCodeExpires: {
          gt: new Date()
        }
      }
    });
    
    if (userWithToken) {
      console.log('✅ Token válido encontrado en base de datos');
    } else {
      console.log('❌ Token no encontrado o expirado');
    }
    
    console.log('\n📋 Resumen del Test:');
    console.log('✅ Base de datos: Conectada');
    console.log('✅ Usuario: Encontrado');
    console.log('✅ Token: Generado y guardado');
    console.log('✅ URL: Lista para usar');
    console.log('\n🎯 Para probar el flujo completo:');
    console.log('1. Ve a: http://localhost:3000/forgot-password');
    console.log('2. Ingresa el email:', testUser.email);
    console.log('3. O usa directamente la URL:', resetUrl);
    
  } catch (error) {
    console.error('❌ Error en el test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el test
testPasswordReset(); 