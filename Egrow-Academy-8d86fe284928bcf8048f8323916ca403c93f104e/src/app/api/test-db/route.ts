import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 [TEST-DB] Probando conexión a la base de datos...')
    
    // Intentar hacer una consulta simple
    const userCount = await prisma.user.count()
    
    console.log('✅ [TEST-DB] Conexión exitosa. Usuarios en BD:', userCount)
    
    return NextResponse.json({
      success: true,
      message: 'Conexión a la base de datos exitosa',
      userCount,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ [TEST-DB] Error de conexión:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Error de conexión con la base de datos',
      details: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 