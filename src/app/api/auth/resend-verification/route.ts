import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [RESEND] Iniciando reenvío de verificación')
    
    const body = await request.json()
    const { email } = body
    
    console.log('📝 [RESEND] Email recibido:', email)

    // Validar campo requerido
    if (!email) {
      console.log('❌ [RESEND] Email faltante')
      return NextResponse.json(
        { error: 'Por favor, proporciona tu dirección de correo electrónico' },
        { status: 400 }
      )
    }

    console.log('✅ [RESEND] Validaciones pasadas, buscando usuario')

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('❌ [RESEND] Usuario no encontrado:', email)
      return NextResponse.json(
        { error: 'No se encontró una cuenta con este correo electrónico' },
        { status: 404 }
      )
    }

    console.log('✅ [RESEND] Usuario encontrado, verificando estado')

    // Verificar que el usuario no esté ya verificado
    if (user.emailVerified) {
      console.log('❌ [RESEND] Usuario ya verificado:', email)
      return NextResponse.json(
        { error: 'Tu cuenta ya está verificada' },
        { status: 400 }
      )
    }

    console.log('✅ [RESEND] Generando nuevo código de verificación')

    // Generar nuevo código de verificación
    const verificationCode = generateVerificationCode()
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos

    // Actualizar usuario con nuevo código
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode,
        verificationExpires
      }
    })

    console.log('✅ [RESEND] Código actualizado, enviando email')

    // Enviar email de verificación
    const emailResult = await sendVerificationEmail(
      email,
      verificationCode,
      user.firstName
    )

    if (!emailResult.success) {
      console.log('❌ [RESEND] Error enviando email:', emailResult.error)
      return NextResponse.json(
        { error: 'Error al enviar el email de verificación. Inténtalo más tarde.' },
        { status: 500 }
      )
    }

    console.log('✅ [RESEND] Email enviado exitosamente')

    return NextResponse.json({
      message: 'Código de verificación reenviado. Revisa tu correo electrónico.'
    })
  } catch (error) {
    console.error('💥 [RESEND] Error completo:', error)
    
    if (error instanceof Error) {
      console.error('💥 [RESEND] Mensaje de error:', error.message)
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor. Inténtalo más tarde.' },
      { status: 500 }
    )
  }
} 