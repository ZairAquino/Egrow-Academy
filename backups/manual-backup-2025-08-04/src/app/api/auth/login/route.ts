import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken, createSafeUser } from '@/lib/auth'
import { LoginData } from '@/types/auth'
import { 
  getClientIP, 
  checkLoginRateLimit, 
  resetLoginAttempts, 
  logSecurityEvent,
  validateEmailSecurity,
  sanitizeInput,
  addSecurityHeaders 
} from '@/lib/security'

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)
  let body: LoginData | null = null
  
  try {
    console.log('🔍 [LOGIN] Iniciando proceso de login desde IP:', ip)
    
    body = await request.json()
    const { email, password } = body
    
    // Sanitizar entrada
    const sanitizedEmail = sanitizeInput(email)
    const sanitizedPassword = sanitizeInput(password)
    
    console.log('📝 [LOGIN] Datos recibidos:', { 
      email: sanitizedEmail, 
      passwordLength: sanitizedPassword?.length || 0 
    })

    // Validar campos requeridos
    if (!sanitizedEmail || !sanitizedPassword) {
      console.log('❌ [LOGIN] Campos requeridos faltantes')
      await logSecurityEvent('LOGIN_FAILED_MISSING_FIELDS', { ip }, ip)
      return addSecurityHeaders(NextResponse.json(
        { error: 'Por favor, completa todos los campos requeridos' },
        { status: 400 }
      ))
    }

    // Validar email con seguridad mejorada
    const emailValidation = validateEmailSecurity(sanitizedEmail)
    if (!emailValidation.valid) {
      console.log('❌ [LOGIN] Email inválido:', sanitizedEmail, emailValidation.reason)
      await logSecurityEvent('LOGIN_FAILED_INVALID_EMAIL', { email: sanitizedEmail, reason: emailValidation.reason }, ip)
      return addSecurityHeaders(NextResponse.json(
        { error: emailValidation.reason || 'Por favor, ingresa un correo electrónico válido' },
        { status: 400 }
      ))
    }

    console.log('✅ [LOGIN] Validaciones pasadas, buscando usuario')

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    })

    if (!user) {
      console.log('❌ [LOGIN] Usuario no encontrado:', sanitizedEmail)
      await logSecurityEvent('LOGIN_FAILED_USER_NOT_FOUND', { email: sanitizedEmail }, ip)
      return addSecurityHeaders(NextResponse.json(
        { error: 'No existe una cuenta con este correo electrónico. ¿Te registraste?' },
        { status: 401 }
      ))
    }

    console.log('✅ [LOGIN] Usuario encontrado, verificando contraseña')

    // Verificar si el usuario tiene contraseña (no es usuario OAuth)
    if (!user.passwordHash) {
      console.log('❌ [LOGIN] Usuario sin contraseña (probablemente OAuth):', sanitizedEmail)
      await logSecurityEvent('LOGIN_FAILED_NO_PASSWORD', { email: sanitizedEmail }, ip)
      return addSecurityHeaders(NextResponse.json(
        { error: 'Esta cuenta fue creada con Google. Por favor, inicia sesión con Google' },
        { status: 401 }
      ))
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(sanitizedPassword, user.passwordHash)

    if (!isValidPassword) {
      console.log('❌ [LOGIN] Contraseña incorrecta para:', sanitizedEmail)
      await logSecurityEvent('LOGIN_FAILED_INVALID_PASSWORD', { email: sanitizedEmail }, ip)
      return addSecurityHeaders(NextResponse.json(
        { error: 'La contraseña es incorrecta. Inténtalo de nuevo' },
        { status: 401 }
      ))
    }

    console.log('✅ [LOGIN] Contraseña correcta, verificando cuenta activa')

    // Verificar si la cuenta está activa
    if (!user.isActive) {
      console.log('❌ [LOGIN] Cuenta desactivada:', sanitizedEmail)
      await logSecurityEvent('LOGIN_FAILED_INACTIVE_ACCOUNT', { email: sanitizedEmail }, ip)
      return addSecurityHeaders(NextResponse.json(
        { error: 'Tu cuenta está desactivada. Contacta al administrador' },
        { status: 403 }
      ))
    }

    // Verificar que el email esté verificado
    if (!user.emailVerified) {
      console.log('❌ [LOGIN] Email no verificado para:', sanitizedEmail)
      await logSecurityEvent('LOGIN_FAILED_UNVERIFIED_EMAIL', { email: sanitizedEmail }, ip)
      return addSecurityHeaders(NextResponse.json(
        { 
          error: 'Tu cuenta no está verificada. Revisa tu correo electrónico para el código de verificación.',
          requiresVerification: true
        },
        { status: 401 }
      ))
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

    // Reset login attempts on successful login
    resetLoginAttempts(ip)

    // Log successful login
    await logSecurityEvent('LOGIN_SUCCESS', { 
      email: sanitizedEmail, 
      userId: user.id 
    }, ip)

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
    return addSecurityHeaders(response)
  } catch (error) {
    console.error('💥 [LOGIN] Error completo:', error)
    
    // Log security event for errors
    await logSecurityEvent('LOGIN_ERROR', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      email: body?.email 
    }, ip)
    
    // Manejar errores específicos de base de datos
    if (error instanceof Error) {
      console.error('💥 [LOGIN] Mensaje de error:', error.message)
      console.error('💥 [LOGIN] Stack trace:', error.stack)
      
      if (error.message.includes('connect')) {
        console.error('💥 [LOGIN] Error de conexión a BD')
        return addSecurityHeaders(NextResponse.json(
          { error: 'Error de conexión con la base de datos. Inténtalo más tarde' },
          { status: 503 }
        ))
      }
      
      // Devolver error más específico en desarrollo
      if (process.env.NODE_ENV === 'development') {
        return addSecurityHeaders(NextResponse.json(
          { 
            error: 'Error interno del servidor',
            details: error.message,
          },
          { status: 500 }
        ))
      }
    }
    
    console.error('💥 [LOGIN] Error genérico, devolviendo 500')
    return addSecurityHeaders(NextResponse.json(
      { error: 'Error interno del servidor. Inténtalo más tarde' },
      { status: 500 }
    ))
  }
}