import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, createSafeUser } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [VERIFY-EMAIL] Iniciando verificación de email')
    
    const body = await request.json()
    const { email, code } = body
    
    console.log('📝 [VERIFY-EMAIL] Datos recibidos:', { email, code })

    // Validar campos requeridos
    if (!email || !code) {
      console.log('❌ [VERIFY-EMAIL] Campos requeridos faltantes')
      return NextResponse.json(
        { error: 'Email y código de verificación son requeridos' },
        { status: 400 }
      )
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('❌ [VERIFY-EMAIL] Usuario no encontrado:', email)
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si ya está verificado
    if (user.emailVerified) {
      console.log('❌ [VERIFY-EMAIL] Usuario ya verificado:', email)
      return NextResponse.json(
        { error: 'Tu cuenta ya está verificada' },
        { status: 400 }
      )
    }

    // Verificar código de verificación
    if (!user.verificationCode || user.verificationCode !== code) {
      console.log('❌ [VERIFY-EMAIL] Código inválido:', { 
        provided: code, 
        stored: user.verificationCode 
      })
      return NextResponse.json(
        { error: 'Código de verificación inválido' },
        { status: 400 }
      )
    }

    // Verificar si el código ha expirado
    if (!user.verificationCodeExpires || user.verificationCodeExpires < new Date()) {
      console.log('❌ [VERIFY-EMAIL] Código expirado:', user.verificationCodeExpires)
      return NextResponse.json(
        { error: 'El código de verificación ha expirado. Solicita uno nuevo.' },
        { status: 400 }
      )
    }

    console.log('✅ [VERIFY-EMAIL] Código válido, actualizando usuario')

    // Actualizar usuario como verificado
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpires: null
      }
    })

    console.log('✅ [VERIFY-EMAIL] Usuario verificado exitosamente')

    // Generar token para login automático
    const token = generateToken(updatedUser.id)
    console.log('✅ [VERIFY-EMAIL] Token generado para login automático')

    // Crear sesión automáticamente
    await prisma.session.create({
      data: {
        userId: updatedUser.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      }
    })

    console.log('✅ [VERIFY-EMAIL] Sesión creada automáticamente')

    // Enviar email de bienvenida
    console.log('📧 [VERIFY-EMAIL] Enviando email de bienvenida')
    const welcomeEmailResult = await sendWelcomeEmail(email, updatedUser.firstName)
    
    if (!welcomeEmailResult.success) {
      console.warn('⚠️ [VERIFY-EMAIL] Error enviando email de bienvenida:', welcomeEmailResult.error)
      // No fallamos la verificación por un error en el email de bienvenida
    } else {
      console.log('✅ [VERIFY-EMAIL] Email de bienvenida enviado exitosamente')
    }

    // Devolver usuario sin passwordHash
    const safeUser = createSafeUser(updatedUser)

    // Crear respuesta CON cookie (usuario autenticado)
    const response = NextResponse.json({
      user: safeUser,
      token,
      message: '¡Cuenta verificada exitosamente! Bienvenido a eGrow Academy.',
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

    console.log('✅ [VERIFY-EMAIL] Verificación completada exitosamente')
    return response
  } catch (error) {
    console.error('💥 [VERIFY-EMAIL] Error completo:', error)
    
    // Manejar errores específicos de base de datos
    if (error instanceof Error) {
      console.error('💥 [VERIFY-EMAIL] Mensaje de error:', error.message)
      
      if (error.message.includes('connect')) {
        console.error('💥 [VERIFY-EMAIL] Error de conexión a BD')
        return NextResponse.json(
          { error: 'Error de conexión con la base de datos. Inténtalo más tarde' },
          { status: 503 }
        )
      }
    }
    
    console.error('💥 [VERIFY-EMAIL] Error genérico, devolviendo 500')
    return NextResponse.json(
      { error: 'Error interno del servidor. Inténtalo más tarde' },
      { status: 500 }
    )
  }
} 