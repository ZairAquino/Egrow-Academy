import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function checkCurrentCode() {
  console.log('🔍 [CHECK-CURRENT-CODE] Verificando código actual')
  
  try {
    await prisma.$connect()
    
    const user = await prisma.user.findFirst({
      where: {
        email: 'luisdavid.ls47@gmail.com'
      }
    })
    
    if (!user) {
      console.log('❌ [CHECK-CURRENT-CODE] Usuario no encontrado')
      return
    }
    
    console.log('📊 [CHECK-CURRENT-CODE] Estado actual del usuario:', {
      email: user.email,
      emailVerified: user.emailVerified,
      verificationCode: user.verificationCode,
      verificationCodeExpires: user.verificationCodeExpires,
      ahora: new Date(),
      estaExpirado: user.verificationCodeExpires ? user.verificationCodeExpires < new Date() : true
    })
    
  } catch (error) {
    console.error('💥 [CHECK-CURRENT-CODE] Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCurrentCode() 