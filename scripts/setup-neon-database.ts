import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

async function setupNeonDatabase() {
  console.log('🚀 [SETUP] Configurando base de datos Neon...')
  
  try {
    // 1. Verificar si ya tenemos una URL de Neon
    const currentDbUrl = process.env.DATABASE_URL
    if (currentDbUrl && currentDbUrl.includes('neon.tech')) {
      console.log('✅ [SETUP] Ya tienes una URL de Neon configurada')
    } else {
      console.log('⚠️ [SETUP] No se detectó URL de Neon')
      console.log('💡 [SETUP] Necesitas configurar tu archivo .env con la URL de Neon')
      console.log('📝 [SETUP] Ejemplo: DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/dbname"')
      return
    }
    
    // 2. Generar el cliente de Prisma
    console.log('🔧 [SETUP] Generando cliente de Prisma...')
    execSync('npx prisma generate', { stdio: 'inherit' })
    console.log('✅ [SETUP] Cliente de Prisma generado')
    
    // 3. Aplicar migraciones
    console.log('📦 [SETUP] Aplicando migraciones...')
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    console.log('✅ [SETUP] Migraciones aplicadas')
    
    // 4. Verificar conexión
    console.log('🔍 [SETUP] Verificando conexión...')
    const prisma = new PrismaClient()
    await prisma.$connect()
    
    // 5. Verificar estructura
    const userCount = await prisma.user.count()
    console.log('✅ [SETUP] Conexión exitosa, usuarios en BD:', userCount)
    
    await prisma.$disconnect()
    console.log('🎉 [SETUP] Base de datos Neon configurada correctamente!')
    
  } catch (error) {
    console.error('❌ [SETUP] Error configurando Neon:', error)
    console.log('💡 [SETUP] Asegúrate de:')
    console.log('   1. Tener la URL correcta de Neon en .env')
    console.log('   2. Que la base de datos esté activa en Neon')
    console.log('   3. Que las credenciales sean válidas')
  }
}

setupNeonDatabase() 