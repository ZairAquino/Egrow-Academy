import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

async function testResendVerification() {
  console.log('🧪 [TEST-RESEND-VERIFICATION] Probando reenvío de verificación')
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'luisdavid.ls47@gmail.com'
      })
    })
    
    const data = await response.json()
    
    console.log('📊 [TEST-RESEND-VERIFICATION] Respuesta del servidor:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    })
    
    if (response.ok) {
      console.log('✅ [TEST-RESEND-VERIFICATION] Reenvío exitoso')
    } else {
      console.log('❌ [TEST-RESEND-VERIFICATION] Error en reenvío:', data.error)
    }
    
  } catch (error) {
    console.error('💥 [TEST-RESEND-VERIFICATION] Error de conexión:', error)
  }
}

testResendVerification() 