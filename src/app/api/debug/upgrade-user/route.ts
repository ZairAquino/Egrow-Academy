import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Importar Prisma dinámicamente
    const { prisma } = await import('@/lib/prisma')

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar a premium
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        membershipLevel: 'PREMIUM'
      }
    })

    return NextResponse.json({
      message: 'Usuario actualizado a premium',
      user: {
        email: updatedUser.email,
        membershipLevel: updatedUser.membershipLevel
      }
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('🔍 [DEBUG] Intentando conectar a la base de datos...')
    
    // Importar Prisma dinámicamente
    const { prisma } = await import('@/lib/prisma')
    
    // Verificar conexión primero
    await prisma.$connect()
    console.log('✅ [DEBUG] Conexión a BD exitosa')
    
    // Listar todos los usuarios y sus niveles de membresía
    console.log('🔍 [DEBUG] Obteniendo usuarios...')
    const users = await prisma.user.findMany({
      select: {
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true
      }
    })
    
    console.log(`✅ [DEBUG] Encontrados ${users.length} usuarios`)
    return NextResponse.json({ 
      users,
      count: users.length,
      message: 'Usuarios obtenidos exitosamente'
    })
  } catch (error) {
    console.error('💥 [DEBUG] Error completo:', error)
    console.error('💥 [DEBUG] Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('💥 [DEBUG] Error stack:', error instanceof Error ? error.stack : 'No stack')
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: 'database_error'
      },
      { status: 500 }
    )
  }
}