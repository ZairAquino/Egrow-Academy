import { validateEmailServer } from '../src/lib/server-email-validation'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

async function testEmailValidation() {
  console.log('🧪 [EMAIL-VALIDATION] Probando validación de email...')
  
  const testEmails = [
    'luisdavid.ls47@gmail.com',
    'test@example.com',
    'user@nonexistentdomain.xyz',
    'aquinozair3@gmail.com'
  ]
  
  for (const email of testEmails) {
    console.log(`\n📧 [EMAIL-VALIDATION] Probando: ${email}`)
    
    try {
      const result = await validateEmailServer(email)
      console.log(`   Resultado: ${result.isValid ? '✅ Válido' : '❌ Inválido'}`)
      
      if (!result.isValid) {
        console.log(`   Error: ${result.error}`)
      }
    } catch (error) {
      console.error(`   💥 Error:`, error)
    }
  }
}

testEmailValidation() 