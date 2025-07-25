import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader, createSafeUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Obtener token desde cookies o headers
    const cookieToken = request.cookies.get('auth-token')?.value
    const headerToken = extractTokenFromHeader(request)
    
    const token = cookieToken || headerToken

    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Usuario no autenticado - no token'
      })
    }

    // Verificar token JWT
    const { userId } = verifyToken(token)

    // Importar Prisma dinámicamente
    const { prisma } = await import('@/lib/prisma')

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    // Devolver usuario sin passwordHash
    const safeUser = createSafeUser(user)

    return NextResponse.json({
      success: true,
      user: safeUser,
      logoToUse: safeUser.membershipLevel === 'PREMIUM' ? 'logop.png' : 'logog.png'
    })
    
  } catch (error) {
    console.error('💥 [DEBUG] Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      )
    }
    
    // Mensaje con instrucciones
    return NextResponse.json({
      message: 'Para actualizar el usuario, usa Prisma Studio:',
      instructions: [
        '1. Abre http://localhost:5556 (Prisma Studio)',
        '2. Ve a la tabla User',
        '3. Busca el usuario con email: ' + email,
        '4. Cambia membershipLevel de FREE a PREMIUM',
        '5. Guarda los cambios'
      ]
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error procesando solicitud' },
      { status: 500 }
    )
  }
}