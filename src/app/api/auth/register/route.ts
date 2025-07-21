import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken, createSafeUser } from '@/lib/auth'
import { validateEmail, getEmailSuggestions } from '@/lib/email-validation'
import { validateEmailServer } from '@/lib/server-email-validation'
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email'
import { RegisterData } from '@/types/auth'

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

    // Validar email con validación completa (cliente)
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      console.log('❌ [REGISTER] Email inválido (cliente):', email, emailValidation.error)
      
      // Obtener sugerencias si el dominio no es confiable
      const suggestions = getEmailSuggestions(email)
      const responseData: any = { error: emailValidation.error }
      
      if (suggestions.length > 0) {
        responseData.suggestions = suggestions
      }
      
      return NextResponse.json(responseData, { status: 400 })
    }

    // Validar email con verificación DNS (servidor)
    const serverEmailValidation = await validateEmailServer(email)
    if (!serverEmailValidation.isValid) {
      console.log('❌ [REGISTER] Email inválido (servidor):', email, serverEmailValidation.error)
      return NextResponse.json(
        { error: serverEmailValidation.error },
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

    // Si el usuario ya existe, devolver error sin revelar información específica
    if (existingUser) {
      console.log('❌ [REGISTER] Usuario ya existe, devolviendo error genérico')
      return NextResponse.json(
        { error: 'No se pudo completar el registro. Verifica tus datos e inténtalo nuevamente.' },
        { status: 400 }
      )
    }

    console.log('✅ [REGISTER] Usuario no existe, hasheando contraseña')

    // Hashear contraseña
    const passwordHash = await hashPassword(password)
    console.log('✅ [REGISTER] Contraseña hasheada correctamente')

    console.log('✅ [REGISTER] Creando usuario en base de datos (MODO DEMO - Sin verificación)')

    // Crear usuario VERIFICADO automáticamente (MODO DEMO para presentación)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username?.trim() || null,
        emailVerified: true, // Verificado automáticamente (MODO DEMO)
        verificationCode: null,
        verificationExpires: null
      }
    })

    console.log('✅ [REGISTER] Usuario creado con ID:', user.id)

    // Generar token para login automático
    const token = generateToken(user.id)
    console.log('✅ [REGISTER] Token generado para login automático')

    // Crear sesión automáticamente
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      }
    })

    console.log('✅ [REGISTER] Sesión creada automáticamente')

    // Devolver usuario sin passwordHash
    const safeUser = createSafeUser(user)

    // Crear respuesta CON cookie (usuario autenticado automáticamente)
    const response = NextResponse.json({
      user: safeUser,
      token,
      message: '¡Cuenta creada exitosamente! Ya puedes acceder a todos los cursos.',
      requiresVerification: false
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