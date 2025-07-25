import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [LOGIN-TEST] Iniciando proceso de login de prueba')
    
    const body = await request.json()
    const { email, password } = body
    
    console.log('📝 [LOGIN-TEST] Email:', email)

    // Validar campos requeridos
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Por favor, completa todos los campos requeridos' },
        { status: 400 }
      )
    }

    // Crear nueva instancia de Prisma
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()
    
    console.log('✅ [LOGIN-TEST] Prisma inicializado, buscando usuario...')

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('❌ [LOGIN-TEST] Usuario no encontrado:', email)
      await prisma.$disconnect()
      return NextResponse.json(
        { error: 'No existe una cuenta con este correo electrónico' },
        { status: 401 }
      )
    }

    console.log('✅ [LOGIN-TEST] Usuario encontrado:', user.email)
    console.log('📋 [LOGIN-TEST] Membership Level:', user.membershipLevel)

    // Verificar contraseña
    if (!user.passwordHash) {
      await prisma.$disconnect()
      return NextResponse.json(
        { error: 'Esta cuenta fue creada con Google. Por favor, inicia sesión con Google' },
        { status: 401 }
      )
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash)

    if (!isValidPassword) {
      console.log('❌ [LOGIN-TEST] Contraseña incorrecta')
      await prisma.$disconnect()
      return NextResponse.json(
        { error: 'La contraseña es incorrecta. Inténtalo de nuevo' },
        { status: 401 }
      )
    }

    console.log('✅ [LOGIN-TEST] Contraseña correcta, generando token...')

    // Generar token
    const token = generateToken(user.id)

    // Crear sesión
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    // Actualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    await prisma.$disconnect()

    // Devolver usuario sin passwordHash
    const { passwordHash, ...safeUser } = user

    // Crear respuesta con cookie
    const response = NextResponse.json({
      user: safeUser,
      token,
      message: '¡Bienvenido de vuelta!',
      logoToUse: safeUser.membershipLevel === 'PREMIUM' ? 'logop.png' : 'logog.png'
    })

    // Establecer cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    })

    console.log('✅ [LOGIN-TEST] Login completado exitosamente')
    return response

  } catch (error) {
    console.error('💥 [LOGIN-TEST] Error:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}