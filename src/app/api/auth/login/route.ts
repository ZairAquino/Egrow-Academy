import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken, createSafeUser } from '@/lib/auth'
import { LoginData } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [LOGIN] Iniciando proceso de login')
    
    const body: LoginData = await request.json()
    const { email, password } = body
    
    console.log('📝 [LOGIN] Datos recibidos:', { 
      email, 
      passwordLength: password?.length || 0 
    })

    // Validar campos requeridos
    if (!email || !password) {
      console.log('❌ [LOGIN] Campos requeridos faltantes')
      return NextResponse.json(
        { error: 'Por favor, completa todos los campos requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ [LOGIN] Email inválido:', email)
      return NextResponse.json(
        { error: 'Por favor, ingresa un correo electrónico válido' },
        { status: 400 }
      )
    }

    console.log('✅ [LOGIN] Validaciones pasadas, buscando usuario')

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('❌ [LOGIN] Usuario no encontrado:', email)
      return NextResponse.json(
        { error: 'No existe una cuenta con este correo electrónico. ¿Te registraste?' },
        { status: 401 }
      )
    }

    console.log('✅ [LOGIN] Usuario encontrado, verificando contraseña')

    // Verificar si el usuario tiene contraseña (no es usuario OAuth)
    if (!user.passwordHash) {
      console.log('❌ [LOGIN] Usuario sin contraseña (probablemente OAuth):', email)
      return NextResponse.json(
        { error: 'Esta cuenta fue creada con Google. Por favor, inicia sesión con Google' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.passwordHash)

    if (!isValidPassword) {
      console.log('❌ [LOGIN] Contraseña incorrecta para:', email)
      return NextResponse.json(
        { error: 'La contraseña es incorrecta. Inténtalo de nuevo' },
        { status: 401 }
      )
    }

    console.log('✅ [LOGIN] Contraseña correcta, verificando cuenta activa')

    // Verificar si la cuenta está activa
    if (!user.isActive) {
      console.log('❌ [LOGIN] Cuenta desactivada:', email)
      return NextResponse.json(
        { error: 'Tu cuenta está desactivada. Contacta al administrador' },
        { status: 403 }
      )
    }

    console.log('✅ [LOGIN] Cuenta activa, generando token')

    // Generar token
    const token = generateToken(user.id)
    console.log('✅ [LOGIN] Token generado')

    console.log('✅ [LOGIN] Creando sesión')

    // Crear sesión
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      }
    })

    console.log('✅ [LOGIN] Sesión creada')

    // Actualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    console.log('✅ [LOGIN] Último login actualizado')

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

    console.log('✅ [LOGIN] Login completado exitosamente')
    return response
  } catch (error) {
    console.error('💥 [LOGIN] Error completo:', error)
    
    // Manejar errores específicos de base de datos
    if (error instanceof Error) {
      console.error('💥 [LOGIN] Mensaje de error:', error.message)
      
      if (error.message.includes('connect')) {
        console.error('💥 [LOGIN] Error de conexión a BD')
        return NextResponse.json(
          { error: 'Error de conexión con la base de datos. Inténtalo más tarde' },
          { status: 503 }
        )
      }
    }
    
    console.error('💥 [LOGIN] Error genérico, devolviendo 500')
    return NextResponse.json(
      { error: 'Error interno del servidor. Inténtalo más tarde' },
      { status: 500 }
    )
  }
}