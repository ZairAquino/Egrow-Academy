import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, extractTokenFromHeader, createSafeUser } from '@/lib/auth'
import { auth } from '@/lib/auth.config'

export async function GET(request: NextRequest) {
  try {
    // Primero verificar si hay sesión de NextAuth (Google OAuth)
    const session = await auth()
    
    if (session?.user?.email) {
      // Obtener usuario desde la base de datos usando el email de la sesión
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          enrollments: {
            include: {
              course: true
            }
          }
        }
      })

      if (user) {
        const safeUser = createSafeUser(user)
        return NextResponse.json({ user: safeUser })
      }
    }

    // Si no hay sesión de NextAuth, verificar con el sistema manual
    const cookieToken = request.cookies.get('auth-token')?.value
    const authHeader = request.headers.get('authorization')
    const headerToken = extractTokenFromHeader(authHeader)
    
    const token = cookieToken || headerToken

    if (!token) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 401 }
      )
    }

    // Verificar token
    const { userId } = verifyToken(token)

    // Verificar sesión manual
    const manualSession = await prisma.session.findUnique({
      where: { token }
    })

    if (!manualSession || manualSession.expiresAt < new Date()) {
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