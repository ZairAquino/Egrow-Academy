import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken, createSafeUser } from '@/lib/auth'
import { LoginData } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    const body: LoginData = await request.json()
    const { email, password } = body

    // Validar campos requeridos
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Por favor, completa todos los campos requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Por favor, ingresa un correo electrónico válido' },
        { status: 400 }
      )
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'No existe una cuenta con este correo electrónico. ¿Te registraste?' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'La contraseña es incorrecta. Inténtalo de nuevo' },
        { status: 401 }
      )
    }

    // Verificar si la cuenta está activa
    if (user.status === 'INACTIVE') {
      return NextResponse.json(
        { error: 'Tu cuenta está desactivada. Contacta al administrador' },
        { status: 403 }
      )
    }

    // Generar token
    const token = generateToken(user.id)

    // Crear sesión
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      }
    })

    // Actualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    // Devolver usuario sin passwordHash
    const safeUser = createSafeUser(user)

    // Crear respuesta con cookie
    const response = NextResponse.json({
      user: safeUser,
      token,
      message: '¡Bienvenido de vuelta!'
    })

    // Establecer cookie HTTP-only para mantener sesión
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 días en segundos
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Error en login:', error)
    
    // Manejar errores específicos de base de datos
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        return NextResponse.json(
          { error: 'Error de conexión con la base de datos. Inténtalo más tarde' },
          { status: 503 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor. Inténtalo más tarde' },
      { status: 500 }
    )
  }
}