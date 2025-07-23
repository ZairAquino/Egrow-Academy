import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

async function checkServerEnvironment() {
  console.log('🔍 [SERVER-ENV] Verificando variables de entorno del servidor...')
  
  try {
    // Crear un endpoint temporal para verificar las variables
    console.log('📤 [SERVER-ENV] Enviando solicitud de verificación...')
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test-env@example.com',
        password: 'test',
        firstName: 'Test',
        lastName: 'Env'
      })
    })
    
    console.log('📊 [SERVER-ENV] Status:', response.status)
    
    const data = await response.json()
    console.log('📄 [SERVER-ENV] Response:', JSON.stringify(data, null, 2))
    
    // Verificar variables locales
    console.log('\n📋 [SERVER-ENV] Variables locales:')
    console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✅' : '❌')
    console.log('   RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅' : '❌')
    
    if (process.env.RESEND_API_KEY) {
      console.log('   API Key (primeros 10 chars):', process.env.RESEND_API_KEY.substring(0, 10) + '...')
    }
    
  } catch (error) {
    console.error('💥 [SERVER-ENV] Error:', error)
  }
}

checkServerEnvironment() 