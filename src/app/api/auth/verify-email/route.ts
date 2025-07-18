import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, createSafeUser } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [VERIFY] Iniciando verificación de email')
    
    const body = await request.json()
    const { email, code } = body
    
    console.log('📝 [VERIFY] Datos recibidos:', { email, code })

    // Validar campos requeridos
    if (!email || !code) {
      console.log('❌ [VERIFY] Campos requeridos faltantes')
      return NextResponse.json(
        { error: 'Por favor, proporciona el email y el código de verificación' },
        { status: 400 }
      )
    }

    console.log('✅ [VERIFY] Validaciones pasadas, buscando usuario')

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('❌ [VERIFY] Usuario no encontrado:', email)
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ [VERIFY] Usuario encontrado, verificando código')

    // Verificar que el usuario no esté ya verificado
    if (user.emailVerified) {
      console.log('❌ [VERIFY] Usuario ya verificado:', email)
      return NextResponse.json(
        { error: 'Tu cuenta ya está verificada' },
        { status: 400 }
      )
    }

    // Verificar que el código coincida
    if (user.verificationCode !== code) {
      console.log('❌ [VERIFY] Código incorrecto para:', email)
      return NextResponse.json(
        { error: 'Código de verificación incorrecto' },
        { status: 400 }
      )
    }

    // Verificar que el código no haya expirado
    if (user.verificationExpires && user.verificationExpires < new Date()) {
      console.log('❌ [VERIFY] Código expirado para:', email)
      return NextResponse.json(
        { error: 'El código de verificación ha expirado. Solicita uno nuevo.' },
        { status: 400 }
      )
    }

    console.log('✅ [VERIFY] Código válido, actualizando usuario')

    // Actualizar usuario como verificado
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationExpires: null
      }
    })

    console.log('✅ [VERIFY] Usuario verificado, generando token')

    // Generar token
    const token = generateToken(updatedUser.id)
    console.log('✅ [VERIFY] Token generado')

    // Crear sesión
    await prisma.session.create({
      data: {
        userId: updatedUser.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      }
    })

    console.log('✅ [VERIFY] Sesión creada')

    // Enviar email de bienvenida
    console.log('✅ [VERIFY] Enviando email de bienvenida')
    await sendWelcomeEmail(email, updatedUser.firstName)

    // Devolver usuario sin passwordHash
    const safeUser = createSafeUser(updatedUser)

    // Crear respuesta con cookie
    const response = NextResponse.json({
      user: safeUser,
      token,
      message: '¡Cuenta verificada exitosamente! Ya puedes acceder a todos nuestros cursos.'
    })

    // Establecer cookie HTTP-only para mantener sesión
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 días en segundos
      path: '/'
    })

    console.log('✅ [VERIFY] Verificación completada exitosamente')
    return response
  } catch (error) {
    console.error('💥 [VERIFY] Error completo:', error)
    
    if (error instanceof Error) {
      console.error('💥 [VERIFY] Mensaje de error:', error.message)
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor. Inténtalo más tarde.' },
      { status: 500 }
    )
  }
} 