import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'
import { validateEmail } from '../src/lib/email-validation'
import { validateEmailServer } from '../src/lib/server-email-validation'
import { generateVerificationCode, sendVerificationEmail } from '../src/lib/email'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

const prisma = new PrismaClient()

async function debugEndpointStepByStep() {
  console.log('🔍 [STEP-BY-STEP] Debuggeando endpoint paso a paso...')
  
  const testData = {
    email: 'aquinozair3@gmail.com',
    password: 'testpassword123',
    firstName: 'Test',
    lastName: 'Step',
    username: 'teststep'
  }
  
  try {
    console.log('📝 [STEP-BY-STEP] Datos de prueba:', testData)
    
    // Paso 1: Validar campos requeridos
    console.log('\n1️⃣ [STEP-BY-STEP] Validando campos requeridos...')
    if (!testData.email || !testData.password || !testData.firstName || !testData.lastName) {
      console.log('❌ [STEP-BY-STEP] Campos requeridos faltantes')
      return
    }
    console.log('✅ [STEP-BY-STEP] Campos requeridos OK')
    
    // Paso 2: Validar email (cliente)
    console.log('\n2️⃣ [STEP-BY-STEP] Validando email (cliente)...')
    const emailValidation = validateEmail(testData.email)
    if (!emailValidation.isValid) {
      console.log('❌ [STEP-BY-STEP] Email inválido (cliente):', emailValidation.error)
      return
    }
    console.log('✅ [STEP-BY-STEP] Email válido (cliente)')
    
    // Paso 3: Validar email (servidor)
    console.log('\n3️⃣ [STEP-BY-STEP] Validando email (servidor)...')
    const serverEmailValidation = await validateEmailServer(testData.email)
    if (!serverEmailValidation.isValid) {
      console.log('❌ [STEP-BY-STEP] Email inválido (servidor):', serverEmailValidation.error)
      return
    }
    console.log('✅ [STEP-BY-STEP] Email válido (servidor)')
    
    // Paso 4: Validar contraseña
    console.log('\n4️⃣ [STEP-BY-STEP] Validando contraseña...')
    if (testData.password.length < 6) {
      console.log('❌ [STEP-BY-STEP] Contraseña muy corta')
      return
    }
    console.log('✅ [STEP-BY-STEP] Contraseña OK')
    
    // Paso 5: Validar nombres
    console.log('\n5️⃣ [STEP-BY-STEP] Validando nombres...')
    if (testData.firstName.trim().length < 2 || testData.lastName.trim().length < 2) {
      console.log('❌ [STEP-BY-STEP] Nombres muy cortos')
      return
    }
    console.log('✅ [STEP-BY-STEP] Nombres OK')
    
    // Paso 6: Verificar usuario existente
    console.log('\n6️⃣ [STEP-BY-STEP] Verificando usuario existente...')
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: testData.email },
          ...(testData.username ? [{ username: testData.username }] : [])
        ]
      }
    })
    
    if (existingUser) {
      console.log('❌ [STEP-BY-STEP] Usuario ya existe')
      return
    }
    console.log('✅ [STEP-BY-STEP] Usuario no existe')
    
    // Paso 7: Hashear contraseña
    console.log('\n7️⃣ [STEP-BY-STEP] Hasheando contraseña...')
    const passwordHash = await hashPassword(testData.password)
    console.log('✅ [STEP-BY-STEP] Contraseña hasheada')
    
    // Paso 8: Generar código de verificación
    console.log('\n8️⃣ [STEP-BY-STEP] Generando código de verificación...')
    const verificationCode = generateVerificationCode()
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000)
    console.log('✅ [STEP-BY-STEP] Código generado:', verificationCode)
    
    // Paso 9: Crear usuario
    console.log('\n9️⃣ [STEP-BY-STEP] Creando usuario...')
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
    console.log('✅ [STEP-BY-STEP] Usuario creado con ID:', user.id)
    
    // Paso 10: Enviar email
    console.log('\n🔟 [STEP-BY-STEP] Enviando email de verificación...')
    const emailResult = await sendVerificationEmail(testData.email, verificationCode, testData.firstName.trim())
    
    if (!emailResult.success) {
      console.log('❌ [STEP-BY-STEP] Error enviando email:', emailResult.error)
      
      // Limpiar usuario creado
      await prisma.user.delete({ where: { id: user.id } })
      console.log('🧹 [STEP-BY-STEP] Usuario eliminado por error de email')
      return
    }
    
    console.log('✅ [STEP-BY-STEP] Email enviado exitosamente')
    console.log('🎉 [STEP-BY-STEP] ¡Proceso de registro completado exitosamente!')
    
  } catch (error) {
    console.error('💥 [STEP-BY-STEP] Error durante el proceso:', error)
    
    if (error instanceof Error) {
      console.error('💥 [STEP-BY-STEP] Mensaje:', error.message)
      console.error('💥 [STEP-BY-STEP] Stack:', error.stack)
    }
  } finally {
    await prisma.$disconnect()
  }
}

debugEndpointStepByStep() 