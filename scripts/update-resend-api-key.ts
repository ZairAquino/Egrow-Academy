import * as fs from 'fs'
import * as path from 'path'

async function updateResendApiKey() {
  console.log('🔧 [UPDATE] Actualizando API key de Resend...')
  
  const envPath = path.join(process.cwd(), '.env')
  const newApiKey = 're_3dBxozkz_8vtJ3EGNpGtr3C4PiAmgtU8d'
  
  try {
    // Leer el archivo .env actual
    let envContent = ''
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8')
    }
    
    // Buscar si ya existe RESEND_API_KEY
    const apiKeyRegex = /^RESEND_API_KEY=.*$/m
    const newApiKeyLine = `RESEND_API_KEY="${newApiKey}"`
    
    if (apiKeyRegex.test(envContent)) {
      // Reemplazar la línea existente
      envContent = envContent.replace(apiKeyRegex, newApiKeyLine)
      console.log('✅ [UPDATE] API key de Resend actualizada en .env existente')
    } else {
      // Agregar al final del archivo
      envContent += `\n# Email (Resend)\n${newApiKeyLine}\n`
      console.log('✅ [UPDATE] API key de Resend agregada al .env')
    }
    
    // Escribir el archivo actualizado
    fs.writeFileSync(envPath, envContent)
    console.log('💾 [UPDATE] Archivo .env guardado correctamente')
    
    // Verificar que se escribió correctamente
    const updatedContent = fs.readFileSync(envPath, 'utf8')
    if (updatedContent.includes(newApiKey)) {
      console.log('✅ [UPDATE] Verificación exitosa - API key de Resend encontrada en .env')
    } else {
      console.error('❌ [UPDATE] Error: API key no se escribió correctamente')
    }
    
  } catch (error) {
    console.error('❌ [UPDATE] Error actualizando .env:', error)
  }
}

updateResendApiKey() 