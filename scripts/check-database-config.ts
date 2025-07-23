import { PrismaClient } from '@prisma/client'

async function checkDatabaseConfig() {
  console.log('🔍 [CONFIG] Verificando configuración de base de datos...')
  
  // Verificar variables de entorno
  console.log('📋 [CONFIG] Variables de entorno:')
  console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada')
  console.log('   RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ No configurada')
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ [CONFIG] DATABASE_URL no está configurada')
    console.log('💡 [CONFIG] Asegúrate de tener un archivo .env con la URL de Neon')
    return
  }
  
  // Verificar si es Neon o local
  const isNeon = process.env.DATABASE_URL.includes('neon.tech')
  console.log('🌐 [CONFIG] Tipo de base de datos:', isNeon ? 'Neon (Cloud)' : 'Local')
  
  try {
    const prisma = new PrismaClient()
    
    // Intentar conectar
    console.log('🔌 [CONFIG] Intentando conectar a la base de datos...')
    await prisma.$connect()
    console.log('✅ [CONFIG] Conexión exitosa a la base de datos')
    
    // Verificar que las tablas existen
    console.log('📊 [CONFIG] Verificando estructura de la base de datos...')
    const userCount = await prisma.user.count()
    console.log('✅ [CONFIG] Tabla users accesible, usuarios encontrados:', userCount)
    
    await prisma.$disconnect()
    console.log('✅ [CONFIG] Configuración de base de datos correcta')
    
  } catch (error) {
    console.error('❌ [CONFIG] Error conectando a la base de datos:', error)
    console.log('💡 [CONFIG] Verifica que:')
    console.log('   1. La URL de Neon sea correcta')
    console.log('   2. La base de datos esté activa')
    console.log('   3. Las credenciales sean válidas')
  }
}

checkDatabaseConfig() 