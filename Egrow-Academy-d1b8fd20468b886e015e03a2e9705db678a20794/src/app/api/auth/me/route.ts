import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, extractTokenFromHeader, createSafeUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verificar token desde cookies o headers
    const cookieToken = request.cookies.get('auth-token')?.value
    const headerToken = extractTokenFromHeader(request)
    
    const token = cookieToken || headerToken

    if (!token) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 401 }
      )
    }

    // Verificar token JWT
    const { userId } = verifyToken(token)

    // Verificar si es una sesión de base de datos
    const session = await prisma.session.findUnique({
      where: { token }
    })

    // Si es una sesión de BD, verificar que no haya expirado
    if (session && session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Sesión expirada' },
        { status: 401 }
      )
    }

    // Obtener usuario con enrollments
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Devolver usuario sin passwordHash
    const safeUser = createSafeUser(user)

    return NextResponse.json({ user: safeUser })
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 401 }
    )
  }
}