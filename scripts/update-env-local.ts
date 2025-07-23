import * as fs from 'fs'
import * as path from 'path'

async function updateEnvLocal() {
  console.log('🔧 [UPDATE-ENV-LOCAL] Actualizando API key en .env.local...')
  
  const envLocalPath = path.join(process.cwd(), '.env.local')
  const newApiKey = 're_3dBxozkz_8vtJ3EGNpGtr3C4PiAmgtU8d'
  
  try {
    // Leer el archivo .env.local
    let envContent = fs.readFileSync(envLocalPath, 'utf8')
    
    // Buscar y reemplazar la línea de RESEND_API_KEY
    const apiKeyRegex = /^RESEND_API_KEY=.*$/m
    const newApiKeyLine = `RESEND_API_KEY="${newApiKey}"`
    
    if (apiKeyRegex.test(envContent)) {
      // Reemplazar la línea existente
      envContent = envContent.replace(apiKeyRegex, newApiKeyLine)
      console.log('✅ [UPDATE-ENV-LOCAL] API key actualizada en .env.local')
    } else {
      // Agregar al final del archivo
      envContent += `\nRESEND_API_KEY="${newApiKey}"\n`
      console.log('✅ [UPDATE-ENV-LOCAL] API key agregada al .env.local')
    }
    
    // Escribir el archivo actualizado
    fs.writeFileSync(envLocalPath, envContent)
    console.log('💾 [UPDATE-ENV-LOCAL] Archivo .env.local guardado correctamente')
    
    // Verificar que se escribió correctamente
    const updatedContent = fs.readFileSync(envLocalPath, 'utf8')
    if (updatedContent.includes(newApiKey)) {
      console.log('✅ [UPDATE-ENV-LOCAL] Verificación exitosa - API key encontrada en .env.local')
    } else {
      console.error('❌ [UPDATE-ENV-LOCAL] Error: API key no se escribió correctamente')
    }
    
  } catch (error) {
    console.error('❌ [UPDATE-ENV-LOCAL] Error actualizando .env.local:', error)
  }
}

updateEnvLocal() 