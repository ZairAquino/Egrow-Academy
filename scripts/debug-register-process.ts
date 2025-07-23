import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'
import { validateEmail, getEmailSuggestions } from '../src/lib/email-validation'
import { validateEmailServer } from '../src/lib/server-email-validation'
import { generateVerificationCode, sendVerificationEmail } from '../src/lib/email'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

const prisma = new PrismaClient()

async function debugRegisterProcess() {
  console.log('🔍 [DEBUG] Debuggeando proceso de registro...')
  
  const testData = {
    email: 'luisdavid.ls47@gmail.com',
    password: 'testpassword123',
    firstName: 'Luis David',
    lastName: 'Solis Martínez',
    username: 'LuisMartinez'
  }
  
  try {
    console.log('📝 [DEBUG] Datos de prueba:', testData)
    
    // 1. Validar campos requeridos
    console.log('\n1️⃣ [DEBUG] Validando campos requeridos...')
    if (!testData.email || !testData.password || !testData.firstName || !testData.lastName) {
      console.log('❌ [DEBUG] Campos requeridos faltantes')
      return
    }
    console.log('✅ [DEBUG] Campos requeridos OK')
    
    // 2. Validar email (cliente)
    console.log('\n2️⃣ [DEBUG] Validando email (cliente)...')
    const emailValidation = validateEmail(testData.email)
    if (!emailValidation.isValid) {
      console.log('❌ [DEBUG] Email inválido (cliente):', emailValidation.error)
      return
    }
    console.log('✅ [DEBUG] Email válido (cliente)')
    
    // 3. Validar email (servidor)
    console.log('\n3️⃣ [DEBUG] Validando email (servidor)...')
    const serverEmailValidation = await validateEmailServer(testData.email)
    if (!serverEmailValidation.isValid) {
      console.log('❌ [DEBUG] Email inválido (servidor):', serverEmailValidation.error)
      return
    }
    console.log('✅ [DEBUG] Email válido (servidor)')
    
    // 4. Validar contraseña
    console.log('\n4️⃣ [DEBUG] Validando contraseña...')
    if (testData.password.length < 6) {
      console.log('❌ [DEBUG] Contraseña muy corta')
      return
    }
    console.log('✅ [DEBUG] Contraseña OK')
    
    // 5. Validar nombres
    console.log('\n5️⃣ [DEBUG] Validando nombres...')
    if (testData.firstName.trim().length < 2 || testData.lastName.trim().length < 2) {
      console.log('❌ [DEBUG] Nombres muy cortos')
      return
    }
    console.log('✅ [DEBUG] Nombres OK')
    
    // 6. Verificar usuario existente
    console.log('\n6️⃣ [DEBUG] Verificando usuario existente...')
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: testData.email },
          ...(testData.username ? [{ username: testData.username }] : [])
        ]
      }
    })
    
    if (existingUser) {
      console.log('❌ [DEBUG] Usuario ya existe')
      return
    }
    console.log('✅ [DEBUG] Usuario no existe')
    
    // 7. Hashear contraseña
    console.log('\n7️⃣ [DEBUG] Hasheando contraseña...')
    const passwordHash = await hashPassword(testData.password)
    console.log('✅ [DEBUG] Contraseña hasheada')
    
    // 8. Generar código de verificación
    console.log('\n8️⃣ [DEBUG] Generando código de verificación...')
    const verificationCode = generateVerificationCode()
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000)
    console.log('✅ [DEBUG] Código generado:', verificationCode)
    
    // 9. Crear usuario
    console.log('\n9️⃣ [DEBUG] Creando usuario...')
    const user = await prisma.user.create({
      data: {
        email: testData.email,
        passwordHash,
        firstName: testData.firstName.trim(),
        lastName: testData.lastName.trim(),
        username: testData.username?.trim() || null,
        emailVerified: false,
        verificationCode,
        verificationCodeExpires
      }
    })
    console.log('✅ [DEBUG] Usuario creado con ID:', user.id)
    
    // 10. Enviar email
    console.log('\n🔟 [DEBUG] Enviando email de verificación...')
    const emailResult = await sendVerificationEmail(testData.email, verificationCode, testData.firstName.trim())
    
    if (!emailResult.success) {
      console.log('❌ [DEBUG] Error enviando email:', emailResult.error)
      
      // Limpiar usuario creado
      await prisma.user.delete({ where: { id: user.id } })
      console.log('🧹 [DEBUG] Usuario eliminado por error de email')
      return
    }
    
    console.log('✅ [DEBUG] Email enviado exitosamente')
    console.log('🎉 [DEBUG] ¡Proceso de registro completado exitosamente!')
    
  } catch (error) {
    console.error('💥 [DEBUG] Error durante el proceso:', error)
    
    if (error instanceof Error) {
      console.error('💥 [DEBUG] Mensaje:', error.message)
      console.error('💥 [DEBUG] Stack:', error.stack)
    }
  } finally {
    await prisma.$disconnect()
  }
}

debugRegisterProcess() 