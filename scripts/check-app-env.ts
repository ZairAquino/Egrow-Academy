import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

async function checkAppEnvironment() {
  console.log('🔍 [APP] Verificando variables de entorno para la aplicación...')
  
  // Verificar variables críticas
  const criticalVars = {
    'DATABASE_URL': process.env.DATABASE_URL,
    'RESEND_API_KEY': process.env.RESEND_API_KEY,
    'JWT_SECRET': process.env.JWT_SECRET,
    'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET
  }
  
  console.log('\n📋 [APP] Variables de entorno:')
  let allConfigured = true
  
  for (const [key, value] of Object.entries(criticalVars)) {
    if (value) {
      console.log(`   ✅ ${key}: Configurada`)
      if (key.includes('KEY') || key.includes('SECRET')) {
        console.log(`      🔑 Valor (primeros 10 chars): ${value.substring(0, 10)}...`)
      } else if (key === 'DATABASE_URL') {
        const isNeon = value.includes('neon.tech')
        console.log(`      🌐 Tipo: ${isNeon ? 'Neon (Cloud)' : 'Local'}`)
      }
    } else {
      console.log(`   ❌ ${key}: No configurada`)
      allConfigured = false
    }
  }
  
  if (allConfigured) {
    console.log('\n✅ [APP] Todas las variables críticas están configuradas')
  } else {
    console.log('\n❌ [APP] Faltan variables críticas')
  }
  
  // Verificar configuración específica de la aplicación
  console.log('\n🔧 [APP] Configuración de la aplicación:')
  console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || 'No configurado'}`)
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'No configurado'}`)
  
  // Verificar si las variables están disponibles en el proceso
  console.log('\n📊 [APP] Verificación del proceso:')
  console.log(`   process.env.DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Disponible' : '❌ No disponible'}`)
  console.log(`   process.env.RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Disponible' : '❌ No disponible'}`)
}

checkAppEnvironment() 