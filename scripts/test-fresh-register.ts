import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

async function testFreshRegister() {
  console.log('🧪 [FRESH] Probando registro con email completamente nuevo...')
  
  // Generar email único basado en timestamp
  const timestamp = Date.now()
  const testData = {
    email: `test-fresh-${timestamp}@gmail.com`,
    password: 'testpassword123',
    firstName: 'Test',
    lastName: 'Fresh',
    username: `testfresh${timestamp}`
  }
  
  try {
    console.log('📤 [FRESH] Enviando datos de prueba:', testData.email)
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    console.log('📊 [FRESH] Status:', response.status)
    
    const data = await response.json()
    console.log('📄 [FRESH] Response:', JSON.stringify(data, null, 2))
    
    if (response.ok) {
      console.log('✅ [FRESH] Registro exitoso!')
      console.log('📧 [FRESH] Usuario requiere verificación:', data.requiresVerification)
      console.log('👤 [FRESH] Usuario creado:', data.user?.email)
      console.log('💬 [FRESH] Mensaje:', data.message)
    } else {
      console.log('❌ [FRESH] Error en el registro')
      console.log('💡 [FRESH] Mensaje de error:', data.error)
    }
    
  } catch (error) {
    console.error('💥 [FRESH] Error de conexión:', error)
  }
}

testFreshRegister() 