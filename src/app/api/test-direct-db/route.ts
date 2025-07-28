import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  let prisma: PrismaClient | null = null
  
  try {
    console.log('🔍 [DIRECT-DB] Probando conexión directa...')
    
    // URL directa sin variable de entorno
    const directUrl = "postgresql://neondb_owner:npg_AZ3bcE1lmxuo@ep-billowing-glitter-aekqfnw5-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
    
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: directUrl
        }
      },
      log: ['query', 'error', 'info', 'warn']
    })
    
    console.log('✅ [DIRECT-DB] Cliente creado, probando conexión...')
    
    // Intentar conectar explícitamente
    await prisma.$connect()
    console.log('✅ [DIRECT-DB] Conexión establecida')
    
    // Probar consulta simple
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ [DIRECT-DB] Query raw exitosa:', result)
    
    // Probar modelo User si existe
    try {
      const userCount = await prisma.user.count()
      console.log('✅ [DIRECT-DB] Conteo de usuarios:', userCount)
      
      return NextResponse.json({
        success: true,
        message: 'Conexión directa exitosa',
        data: {
          rawQuery: result,
          userCount,
          url: directUrl.replace(/:npg_AZ3bcE1lmxuo@/, ':***@')
        }
      })
    } catch (modelError) {
      console.log('⚠️ [DIRECT-DB] Error en modelo User:', modelError)
      
      return NextResponse.json({
        success: true,
        message: 'Conexión exitosa pero problema con modelo User',
        data: {
          rawQuery: result,
          modelError: modelError instanceof Error ? modelError.message : 'Error desconocido',
          url: directUrl.replace(/:npg_AZ3bcE1lmxuo@/, ':***@')
        }
      })
    }
    
  } catch (error) {
    console.error('❌ [DIRECT-DB] Error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Error en conexión directa',
      details: {
        message: error instanceof Error ? error.message : 'Error desconocido',
        name: error instanceof Error ? error.name : 'Unknown',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 })
    
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}