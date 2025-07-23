import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

async function testVerifyEmail() {
  console.log('🧪 [TEST-VERIFY-EMAIL] Probando verificación de email')
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'luisdavid.ls47@gmail.com',
        code: '443738' // Código actual en la base de datos
      })
    })
    
    const data = await response.json()
    
    console.log('📊 [TEST-VERIFY-EMAIL] Respuesta del servidor:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    })
    
    if (response.ok) {
      console.log('✅ [TEST-VERIFY-EMAIL] Verificación exitosa')
      console.log('👤 [TEST-VERIFY-EMAIL] Usuario verificado:', data.user?.email)
      console.log('🔐 [TEST-VERIFY-EMAIL] Token generado:', data.token ? 'Sí' : 'No')
    } else {
      console.log('❌ [TEST-VERIFY-EMAIL] Error en verificación:', data.error)
    }
    
  } catch (error) {
    console.error('💥 [TEST-VERIFY-EMAIL] Error de conexión:', error)
  }
}

testVerifyEmail() 