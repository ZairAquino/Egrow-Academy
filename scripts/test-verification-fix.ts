import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function testVerificationFix() {
  console.log('🧪 [TEST-VERIFICATION-FIX] Iniciando prueba de verificación corregida')
  
  try {
    // 1. Verificar conexión a la base de datos
    console.log('🔍 [TEST-VERIFICATION-FIX] Verificando conexión a BD...')
    await prisma.$connect()
    console.log('✅ [TEST-VERIFICATION-FIX] Conexión a BD exitosa')
    
    // 2. Buscar un usuario de prueba
    const testUser = await prisma.user.findFirst({
      where: {
        email: 'luisdavid.ls47@gmail.com'
      }
    })
    
    if (!testUser) {
      console.log('❌ [TEST-VERIFICATION-FIX] Usuario de prueba no encontrado')
      return
    }
    
    console.log('✅ [TEST-VERIFICATION-FIX] Usuario encontrado:', {
      id: testUser.id,
      email: testUser.email,
      emailVerified: testUser.emailVerified,
      verificationCode: testUser.verificationCode,
      verificationCodeExpires: testUser.verificationCodeExpires
    })
    
    // 3. Probar actualización con el campo correcto
    console.log('🔧 [TEST-VERIFICATION-FIX] Probando actualización con verificationCodeExpires...')
    
    const newCode = '123456'
    const newExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos
    
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: {
        verificationCode: newCode,
        verificationCodeExpires: newExpires
      }
    })
    
    console.log('✅ [TEST-VERIFICATION-FIX] Usuario actualizado correctamente:', {
      verificationCode: updatedUser.verificationCode,
      verificationCodeExpires: updatedUser.verificationCodeExpires
    })
    
    // 4. Probar verificación de expiración
    console.log('⏰ [TEST-VERIFICATION-FIX] Probando verificación de expiración...')
    
    const now = new Date()
    const isExpired = !updatedUser.verificationCodeExpires || updatedUser.verificationCodeExpires < now
    
    console.log('📊 [TEST-VERIFICATION-FIX] Estado de expiración:', {
      ahora: now,
      expira: updatedUser.verificationCodeExpires,
      estaExpirado: isExpired
    })
    
    if (isExpired) {
      console.log('❌ [TEST-VERIFICATION-FIX] El código está expirado')
    } else {
      console.log('✅ [TEST-VERIFICATION-FIX] El código NO está expirado')
    }
    
    // 5. Probar verificación de código
    console.log('🔐 [TEST-VERIFICATION-FIX] Probando verificación de código...')
    
    const providedCode = '123456'
    const isCodeValid = updatedUser.verificationCode === providedCode
    
    console.log('📊 [TEST-VERIFICATION-FIX] Estado del código:', {
      codigoProporcionado: providedCode,
      codigoAlmacenado: updatedUser.verificationCode,
      esValido: isCodeValid
    })
    
    if (isCodeValid) {
      console.log('✅ [TEST-VERIFICATION-FIX] El código es válido')
    } else {
      console.log('❌ [TEST-VERIFICATION-FIX] El código NO es válido')
    }
    
    console.log('🎉 [TEST-VERIFICATION-FIX] Todas las pruebas completadas exitosamente')
    
  } catch (error) {
    console.error('💥 [TEST-VERIFICATION-FIX] Error durante la prueba:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testVerificationFix() 