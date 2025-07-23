import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

async function testRegisterWithValidEmail() {
  console.log('🧪 [ENDPOINT] Probando registro con email válido...')
  
  const testData = {
    email: 'test-register-2@gmail.com', // Email válido de Gmail
    password: 'testpassword123',
    firstName: 'Luis David',
    lastName: 'Solis Martínez',
    username: 'LuisMartinez'
  }
  
  try {
    console.log('📤 [ENDPOINT] Enviando datos de prueba:', testData.email)
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    console.log('📊 [ENDPOINT] Status:', response.status)
    
    const data = await response.json()
    console.log('📄 [ENDPOINT] Response:', JSON.stringify(data, null, 2))
    
    if (response.ok) {
      console.log('✅ [ENDPOINT] Registro exitoso!')
      console.log('📧 [ENDPOINT] Usuario requiere verificación:', data.requiresVerification)
      console.log('👤 [ENDPOINT] Usuario creado:', data.user?.email)
    } else {
      console.log('❌ [ENDPOINT] Error en el registro')
      console.log('💡 [ENDPOINT] Mensaje de error:', data.error)
      
      if (data.error.includes('ya existe')) {
        console.log('ℹ️ [ENDPOINT] El usuario ya existe, esto es normal')
      }
    }
    
  } catch (error) {
    console.error('💥 [ENDPOINT] Error de conexión:', error)
  }
}

testRegisterWithValidEmail() 