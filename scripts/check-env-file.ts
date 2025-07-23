import * as fs from 'fs'
import * as path from 'path'

async function checkEnvFile() {
  console.log('🔍 [ENV] Verificando archivo .env...')
  
  const envPath = path.join(process.cwd(), '.env')
  
  try {
    if (!fs.existsSync(envPath)) {
      console.error('❌ [ENV] Archivo .env no existe')
      return
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8')
    console.log('✅ [ENV] Archivo .env encontrado')
    console.log('📄 [ENV] Contenido del archivo:')
    console.log('--- INICIO DEL ARCHIVO .env ---')
    console.log(envContent)
    console.log('--- FIN DEL ARCHIVO .env ---')
    
    // Verificar variables específicas
    const hasDatabaseUrl = envContent.includes('DATABASE_URL')
    const hasResendApiKey = envContent.includes('RESEND_API_KEY')
    
    console.log('\n📋 [ENV] Variables encontradas:')
    console.log('   DATABASE_URL:', hasDatabaseUrl ? '✅' : '❌')
    console.log('   RESEND_API_KEY:', hasResendApiKey ? '✅' : '❌')
    
    if (hasResendApiKey) {
      const apiKeyMatch = envContent.match(/RESEND_API_KEY="([^"]+)"/)
      if (apiKeyMatch) {
        const apiKey = apiKeyMatch[1]
        console.log('🔑 [ENV] API key encontrada (primeros 10 caracteres):', apiKey.substring(0, 10) + '...')
      }
    }
    
  } catch (error) {
    console.error('❌ [ENV] Error leyendo archivo .env:', error)
  }
}

checkEnvFile() 