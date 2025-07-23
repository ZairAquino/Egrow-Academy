import { sendVerificationEmail } from '../src/lib/email'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

async function testEmailSend() {
  console.log('🧪 [EMAIL] Probando envío de email directamente...')
  
  const testEmail = 'aquinozair3@gmail.com'
  const testCode = '123456'
  const testName = 'Test User'
  
  try {
    console.log('📧 [EMAIL] Enviando email de verificación...')
    console.log('   Email:', testEmail)
    console.log('   Código:', testCode)
    console.log('   Nombre:', testName)
    
    const result = await sendVerificationEmail(testEmail, testCode, testName)
    
    console.log('📄 [EMAIL] Resultado:', JSON.stringify(result, null, 2))
    
    if (result.success) {
      console.log('✅ [EMAIL] Email enviado exitosamente')
    } else {
      console.log('❌ [EMAIL] Error enviando email:', result.error)
    }
    
  } catch (error) {
    console.error('💥 [EMAIL] Error completo:', error)
    
    if (error instanceof Error) {
      console.error('💥 [EMAIL] Mensaje:', error.message)
      console.error('💥 [EMAIL] Stack:', error.stack)
    }
  }
}

testEmailSend() 