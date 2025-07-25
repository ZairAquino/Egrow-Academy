import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Intentando importar Prisma...')
    
    // Importar dinámicamente para evitar problemas
    const { prisma } = await import('@/lib/prisma')
    
    console.log('✅ Prisma importado, verificando conexión...')
    
    // Test simple de conexión
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    console.log('✅ Conexión exitosa:', result)
    
    return NextResponse.json({ 
      message: 'Prisma funcionando correctamente',
      connectionTest: result
    })
  } catch (error) {
    console.error('💥 Error con Prisma:', error)
    return NextResponse.json(
      { 
        error: 'Error con Prisma',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}