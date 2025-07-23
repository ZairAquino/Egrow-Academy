import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

async function testAppDatabase() {
  console.log('🔍 [APP-DB] Probando conexión a BD desde contexto de aplicación...')
  
  try {
    // Crear cliente de Prisma con la misma configuración que la app
    const prisma = new PrismaClient({
      log: ['query', 'error', 'warn']
    })
    
    console.log('🔌 [APP-DB] Intentando conectar...')
    await prisma.$connect()
    console.log('✅ [APP-DB] Conexión exitosa')
    
    // Probar una consulta simple
    console.log('📊 [APP-DB] Probando consulta...')
    const userCount = await prisma.user.count()
    console.log('✅ [APP-DB] Consulta exitosa, usuarios:', userCount)
    
    // Probar crear un usuario de prueba
    console.log('🧪 [APP-DB] Probando creación de usuario...')
    const testUser = await prisma.user.create({
      data: {
        email: 'test-app@example.com',
        passwordHash: 'test-hash',
        firstName: 'Test',
        lastName: 'App',
        emailVerified: false,
        verificationCode: '123456',
        verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000)
      }
    })
    console.log('✅ [APP-DB] Usuario de prueba creado:', testUser.id)
    
    // Limpiar usuario de prueba
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    console.log('🧹 [APP-DB] Usuario de prueba eliminado')
    
    await prisma.$disconnect()
    console.log('✅ [APP-DB] Conexión cerrada correctamente')
    console.log('🎉 [APP-DB] ¡Base de datos funcionando correctamente desde la aplicación!')
    
  } catch (error) {
    console.error('❌ [APP-DB] Error:', error)
    
    if (error instanceof Error) {
      console.error('💥 [APP-DB] Mensaje:', error.message)
      
      if (error.message.includes('connect')) {
        console.log('💡 [APP-DB] Problema de conexión detectado')
        console.log('🔧 [APP-DB] Posibles soluciones:')
        console.log('   1. Verificar que la URL de Neon sea correcta')
        console.log('   2. Verificar que la base de datos esté activa')
        console.log('   3. Regenerar el cliente de Prisma')
      }
    }
  }
}

testAppDatabase() 