import * as fs from 'fs'
import * as path from 'path'

async function updateNeonUrl() {
  console.log('🔧 [UPDATE] Actualizando URL de Neon...')
  
  const envPath = path.join(process.cwd(), '.env')
  const neonUrl = 'postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
  
  try {
    // Leer el archivo .env actual
    let envContent = ''
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8')
    }
    
    // Buscar si ya existe DATABASE_URL
    const dbUrlRegex = /^DATABASE_URL=.*$/m
    const newDbUrlLine = `DATABASE_URL="${neonUrl}"`
    
    if (dbUrlRegex.test(envContent)) {
      // Reemplazar la línea existente
      envContent = envContent.replace(dbUrlRegex, newDbUrlLine)
      console.log('✅ [UPDATE] URL de Neon actualizada en .env existente')
    } else {
      // Agregar al final del archivo
      envContent += `\n# Database (Neon)\n${newDbUrlLine}\n`
      console.log('✅ [UPDATE] URL de Neon agregada al .env')
    }
    
    // Escribir el archivo actualizado
    fs.writeFileSync(envPath, envContent)
    console.log('💾 [UPDATE] Archivo .env guardado correctamente')
    
    // Verificar que se escribió correctamente
    const updatedContent = fs.readFileSync(envPath, 'utf8')
    if (updatedContent.includes(neonUrl)) {
      console.log('✅ [UPDATE] Verificación exitosa - URL de Neon encontrada en .env')
    } else {
      console.error('❌ [UPDATE] Error: URL no se escribió correctamente')
    }
    
  } catch (error) {
    console.error('❌ [UPDATE] Error actualizando .env:', error)
  }
}

updateNeonUrl() 