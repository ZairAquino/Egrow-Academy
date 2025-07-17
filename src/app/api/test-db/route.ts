import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 [TEST-DB] Iniciando prueba de conexión')
    console.log('🔍 [TEST-DB] DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')
    
    // Probar conexión básica
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ [TEST-DB] Conexión exitosa:', result)
    
    // Probar consulta a la tabla users
    const userCount = await prisma.user.count()
    console.log('✅ [TEST-DB] Número de usuarios:', userCount)
    
    return NextResponse.json({
      success: true,
      connection: 'OK',
      userCount,
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...'
    })
  } catch (error) {
    console.error('💥 [TEST-DB] Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...'
    }, { status: 500 })
  }
} 