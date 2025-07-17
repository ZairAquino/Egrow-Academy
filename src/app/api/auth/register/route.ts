import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken, createSafeUser } from '@/lib/auth'
import { RegisterData } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json()
    const { email, password, firstName, lastName, username } = body

    // Validar campos requeridos
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Por favor, completa todos los campos obligatorios' },
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

    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Validar que la contraseña no sea muy débil
    const weakPasswordRegex = /^(123456|password|qwerty|abc123)$/i
    if (weakPasswordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Por favor, elige una contraseña más segura' },
        { status: 400 }
      )
    }

    // Validar nombres
    if (firstName.trim().length < 2) {
      return NextResponse.json(
        { error: 'El nombre debe tener al menos 2 caracteres' },
        { status: 400 }
      )
    }

    if (lastName.trim().length < 2) {
      return NextResponse.json(
        { error: 'El apellido debe tener al menos 2 caracteres' },
        { status: 400 }
      )
    }

    // Validar username si se proporciona
    if (username) {
      if (username.length < 3) {
        return NextResponse.json(
          { error: 'El nombre de usuario debe tener al menos 3 caracteres' },
          { status: 400 }
        )
      }
      
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return NextResponse.json(
          { error: 'El nombre de usuario solo puede contener letras, números y guiones bajos' },
          { status: 400 }
        )
      }
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(username ? [{ username }] : [])
        ]
      }
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'Ya existe una cuenta con este correo electrónico. ¿Ya tienes una cuenta?' },
          { status: 409 }
        )
      }
      if (username && existingUser.username === username) {
        return NextResponse.json(
          { error: 'Este nombre de usuario ya está en uso. Elige otro' },
          { status: 409 }
        )
      }
    }

    // Hashear contraseña
    const passwordHash = await hashPassword(password)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username?.trim() || null
      }
    })

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

    // Devolver usuario sin passwordHash
    const safeUser = createSafeUser(user)

    // Crear respuesta con cookie
    const response = NextResponse.json({
      user: safeUser,
      token,
      message: '¡Cuenta creada exitosamente! Bienvenido a eGrow Academy'
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
    console.error('Error en registro:', error)
    
    // Manejar errores específicos de base de datos
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        return NextResponse.json(
          { error: 'Error de conexión con la base de datos. Inténtalo más tarde' },
          { status: 503 }
        )
      }
      
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Ya existe una cuenta con estos datos. ¿Ya tienes una cuenta?' },
          { status: 409 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor. Inténtalo más tarde' },
      { status: 500 }
    )
  }
}