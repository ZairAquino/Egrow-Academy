import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, extractTokenFromHeader, createSafeUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verificar token desde cookies o headers
    const cookieToken = request.cookies.get('session')?.value
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

    // ✅ OPTIMIZADO: Consulta con select específico y paginación
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        profileImage: true,
        bio: true,
        membershipLevel: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        stripeCustomerId: true,
        country: true,
        hasBeenPremium: true,
        // ✅ Solo enrollments recientes con datos esenciales
        enrollments: {
          select: {
            id: true,
            enrolledAt: true,
            progressPercentage: true,
            status: true,
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                imageUrl: true,
                shortDescription: true,
                lessonsCount: true,
                rating: true
              }
            }
          },
          take: 10, // ✅ Limitar a 10 cursos más recientes
          orderBy: { enrolledAt: 'desc' }
        },
        // ✅ Solo suscripciones activas
        subscriptions: {
          where: {
            status: { in: ['ACTIVE', 'TRIALING'] }
          },
          select: {
            id: true,
            status: true,
            currentPeriodEnd: true,
            price: {
              select: {
                unitAmount: true,
                currency: true,
                interval: true
              }
            }
          },
          take: 1 // ✅ Solo la suscripción más reciente
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