import { PrismaClient } from '@prisma/client'
import { generateVerificationCode, sendVerificationEmail, sendWelcomeEmail } from '../src/lib/email'

const prisma = new PrismaClient()

async function testEmailVerification() {
  console.log('🧪 [TEST] Iniciando prueba del sistema de verificación de email...')
  
  try {
    // 1. Crear un usuario de prueba
    const testEmail = 'test@example.com'
    const testUser = await prisma.user.upsert({
      where: { email: testEmail },
      update: {},
      create: {
        email: testEmail,
        firstName: 'Usuario',
        lastName: 'Prueba',
        passwordHash: 'hashedpassword123',
        emailVerified: false,
        verificationCode: null,
        verificationCodeExpires: null
      }
    })
    
    console.log('✅ [TEST] Usuario de prueba creado:', testUser.email)
    
    // 2. Generar código de verificación
    const verificationCode = generateVerificationCode()
    console.log('🔐 [TEST] Código generado:', verificationCode)
    
    // 3. Actualizar usuario con el código
    await prisma.user.update({
      where: { email: testEmail },
      data: {
        verificationCode,
        verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutos
      }
    })
    
    console.log('✅ [TEST] Código guardado en base de datos')
    
    // 4. Enviar email de verificación
    console.log('📧 [TEST] Enviando email de verificación...')
    const verificationResult = await sendVerificationEmail(testEmail, verificationCode, testUser.firstName)
    
    if (verificationResult.success) {
      console.log('✅ [TEST] Email de verificación enviado exitosamente')
    } else {
      console.error('❌ [TEST] Error enviando email de verificación:', verificationResult.error)
    }
    
    // 5. Simular verificación exitosa
    await prisma.user.update({
      where: { email: testEmail },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpires: null
      }
    })
    
    console.log('✅ [TEST] Usuario marcado como verificado')
    
    // 6. Enviar email de bienvenida
    console.log('📧 [TEST] Enviando email de bienvenida...')
    const welcomeResult = await sendWelcomeEmail(testEmail, testUser.firstName)
    
    if (welcomeResult.success) {
      console.log('✅ [TEST] Email de bienvenida enviado exitosamente')
    } else {
      console.error('❌ [TEST] Error enviando email de bienvenida:', welcomeResult.error)
    }
    
    console.log('🎉 [TEST] Prueba completada exitosamente!')
    
  } catch (error) {
    console.error('💥 [TEST] Error durante la prueba:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar la prueba
testEmailVerification() 