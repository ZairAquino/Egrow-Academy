import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken, createSafeUser } from '@/lib/auth'
import { RegisterData } from '@/types/auth'
import { EmailService } from '@/lib/email'
import { VerificationService } from '@/lib/verification'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [REGISTER] Iniciando proceso de registro')
    
    const body: RegisterData = await request.json()
    const { email, password, firstName, lastName, username } = body
    
    console.log('📝 [REGISTER] Datos recibidos:', { 
      email, 
      firstName, 
      lastName, 
      username: username || 'no username',
      passwordLength: password?.length || 0 
    })

    // Validar campos requeridos
    if (!email || !password || !firstName || !lastName) {
      console.log('❌ [REGISTER] Campos requeridos faltantes')
      return NextResponse.json(
        { error: 'Por favor, completa todos los campos obligatorios' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ [REGISTER] Email inválido:', email)
      return NextResponse.json(
        { error: 'Por favor, ingresa un correo electrónico válido' },
        { status: 400 }
      )
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      console.log('❌ [REGISTER] Contraseña muy corta')
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Validar que la contraseña no sea muy débil
    const weakPasswordRegex = /^(123456|password|qwerty|abc123)$/i
    if (weakPasswordRegex.test(password)) {
      console.log('❌ [REGISTER] Contraseña débil detectada')
      return NextResponse.json(
        { error: 'Por favor, elige una contraseña más segura' },
        { status: 400 }
      )
    }

    // Validar nombres
    if (firstName.trim().length < 2) {
      console.log('❌ [REGISTER] Nombre muy corto')
      return NextResponse.json(
        { error: 'El nombre debe tener al menos 2 caracteres' },
        { status: 400 }
      )
    }

    if (lastName.trim().length < 2) {
      console.log('❌ [REGISTER] Apellido muy corto')
      return NextResponse.json(
        { error: 'El apellido debe tener al menos 2 caracteres' },
        { status: 400 }
      )
    }

    // Validar username si se proporciona
    if (username) {
      if (username.length < 3) {
        console.log('❌ [REGISTER] Username muy corto')
        return NextResponse.json(
          { error: 'El nombre de usuario debe tener al menos 3 caracteres' },
          { status: 400 }
        )
      }
      
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        console.log('❌ [REGISTER] Username con caracteres inválidos')
        return NextResponse.json(
          { error: 'El nombre de usuario solo puede contener letras, números y guiones bajos' },
          { status: 400 }
        )
      }
    }

    console.log('✅ [REGISTER] Validaciones pasadas, verificando usuario existente')

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
        console.log('❌ [REGISTER] Email ya existe:', email)
        return NextResponse.json(
          { error: 'Ya existe una cuenta con este correo electrónico. ¿Ya tienes una cuenta?' },
          { status: 409 }
        )
      }
      if (username && existingUser.username === username) {
        console.log('❌ [REGISTER] Username ya existe:', username)
        return NextResponse.json(
          { error: 'Este nombre de usuario ya está en uso. Elige otro' },
          { status: 409 }
        )
      }
    }

    console.log('✅ [REGISTER] Usuario no existe, hasheando contraseña')

    // Hashear contraseña
    const passwordHash = await hashPassword(password)
    console.log('✅ [REGISTER] Contraseña hasheada correctamente')

    console.log('✅ [REGISTER] Generando token de verificación')

    // Generar token de verificación
    const verificationToken = VerificationService.generateVerificationToken()

    console.log('✅ [REGISTER] Creando usuario en base de datos')

    // Crear usuario con token de verificación
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username?.trim() || null,
        emailVerificationToken: verificationToken.token,
        emailVerificationExpires: verificationToken.expiresAt
      }
    })

    console.log('✅ [REGISTER] Usuario creado con ID:', user.id)

    // Generar token
    const token = generateToken(user.id)
    console.log('✅ [REGISTER] Token generado')

    // Crear sesión
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      }
    })

    console.log('✅ [REGISTER] Sesión creada')

    // Enviar email de verificación
    console.log('📧 [REGISTER] Enviando email de verificación')
    const emailSent = await EmailService.sendVerificationEmail({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      verificationToken: verificationToken.token
    })

    if (emailSent) {
      console.log('✅ [REGISTER] Email de verificación enviado exitosamente')
    } else {
      console.log('⚠️ [REGISTER] Error enviando email de verificación')
    }

    // Devolver usuario sin passwordHash
    const safeUser = createSafeUser(user)

    // Crear respuesta con cookie
    const response = NextResponse.json({
      user: safeUser,
      token,
      message: emailSent 
        ? '¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta'
        : '¡Cuenta creada exitosamente! (Error enviando email de verificación)'
    })

    // Establecer cookie HTTP-only para mantener sesión
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 días en segundos
      path: '/'
    })

    console.log('✅ [REGISTER] Registro completado exitosamente')
    return response
  } catch (error) {
    console.error('💥 [REGISTER] Error completo:', error)
    
    // Manejar errores específicos de base de datos
    if (error instanceof Error) {
      console.error('💥 [REGISTER] Mensaje de error:', error.message)
      
      if (error.message.includes('connect')) {
        console.error('💥 [REGISTER] Error de conexión a BD')
        return NextResponse.json(
          { error: 'Error de conexión con la base de datos. Inténtalo más tarde' },
          { status: 503 }
        )
      }
      
      if (error.message.includes('Unique constraint')) {
        console.error('💥 [REGISTER] Error de constraint único')
        return NextResponse.json(
          { error: 'Ya existe una cuenta con estos datos. ¿Ya tienes una cuenta?' },
          { status: 409 }
        )
      }
    }
    
    console.error('💥 [REGISTER] Error genérico, devolviendo 500')
    return NextResponse.json(
      { error: 'Error interno del servidor. Inténtalo más tarde' },
      { status: 500 }
    )
  }
}