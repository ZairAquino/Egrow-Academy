import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

async function testRegisterEndpoint() {
  console.log('🧪 [ENDPOINT] Probando endpoint de registro...')
  
  const testData = {
    email: 'test-endpoint@example.com',
    password: 'testpassword123',
    firstName: 'Test',
    lastName: 'Endpoint',
    username: 'testendpoint'
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
    console.log('📋 [ENDPOINT] Headers:', Object.fromEntries(response.headers.entries()))
    
    const data = await response.json()
    console.log('📄 [ENDPOINT] Response:', JSON.stringify(data, null, 2))
    
    if (response.ok) {
      console.log('✅ [ENDPOINT] Registro exitoso!')
      console.log('📧 [ENDPOINT] Usuario requiere verificación:', data.requiresVerification)
    } else {
      console.log('❌ [ENDPOINT] Error en el registro')
      console.log('💡 [ENDPOINT] Mensaje de error:', data.error)
    }
    
  } catch (error) {
    console.error('💥 [ENDPOINT] Error de conexión:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.log('💡 [ENDPOINT] El servidor no está ejecutándose en localhost:3000')
        console.log('🔧 [ENDPOINT] Asegúrate de que el servidor esté iniciado')
      }
    }
  }
}

// Esperar un poco para que el servidor se inicie
setTimeout(() => {
  testRegisterEndpoint()
}, 5000) 