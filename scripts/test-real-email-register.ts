import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

async function testRealEmailRegister() {
  console.log('🧪 [REAL] Probando registro con email real...')
  
  const testData = {
    email: 'aquinozair3@gmail.com', // Email real para pruebas
    password: 'testpassword123',
    firstName: 'Test',
    lastName: 'Real',
    username: 'testreal'
  }
  
  try {
    console.log('📤 [REAL] Enviando datos de prueba:', testData.email)
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    console.log('📊 [REAL] Status:', response.status)
    
    const data = await response.json()
    console.log('📄 [REAL] Response:', JSON.stringify(data, null, 2))
    
    if (response.ok) {
      console.log('✅ [REAL] Registro exitoso!')
      console.log('📧 [REAL] Usuario requiere verificación:', data.requiresVerification)
      console.log('👤 [REAL] Usuario creado:', data.user?.email)
      console.log('💬 [REAL] Mensaje:', data.message)
    } else {
      console.log('❌ [REAL] Error en el registro')
      console.log('💡 [REAL] Mensaje de error:', data.error)
      
      if (data.error.includes('ya existe')) {
        console.log('ℹ️ [REAL] El usuario ya existe, esto es normal')
      }
    }
    
  } catch (error) {
    console.error('💥 [REAL] Error de conexión:', error)
  }
}

testRealEmailRegister() 