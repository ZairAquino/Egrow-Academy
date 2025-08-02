import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [RESEND-VERIFICATION] Iniciando reenvío de verificación')
    
    const body = await request.json()
    const { email } = body
    
    console.log('📝 [RESEND-VERIFICATION] Email recibido:', email)

    // Validar email
    if (!email) {
      console.log('❌ [RESEND-VERIFICATION] Email faltante')
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('❌ [RESEND-VERIFICATION] Usuario no encontrado:', email)
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si ya está verificado
    if (user.emailVerified) {
      console.log('❌ [RESEND-VERIFICATION] Usuario ya verificado:', email)
      return NextResponse.json(
        { error: 'Tu cuenta ya está verificada' },
        { status: 400 }
      )
    }

    // Generar nuevo código de verificación
    const newVerificationCode = generateVerificationCode()
    const newVerificationExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hora
    
    console.log('✅ [RESEND-VERIFICATION] Nuevo código generado:', newVerificationCode)

    // Actualizar usuario con nuevo código
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: newVerificationCode,
        verificationCodeExpires: newVerificationExpires
      }
    })

    console.log('✅ [RESEND-VERIFICATION] Usuario actualizado con nuevo código')

    // Enviar nuevo email de verificación
    console.log('📧 [RESEND-VERIFICATION] Enviando nuevo email de verificación')
    const emailResult = await sendVerificationEmail(email, newVerificationCode, user.firstName)
    
    if (!emailResult.success) {
      console.error('❌ [RESEND-VERIFICATION] Error enviando email:', emailResult.error)
      return NextResponse.json(
        { error: 'Error al enviar el email de verificación. Inténtalo más tarde.' },
        { status: 500 }
      )
    }

    console.log('✅ [RESEND-VERIFICATION] Nuevo email de verificación enviado exitosamente')

    return NextResponse.json({
      message: 'Nuevo código de verificación enviado a tu email.',
      expiresIn: '10 minutos'
    })
  } catch (error) {
    console.error('💥 [RESEND-VERIFICATION] Error completo:', error)
    
    // Manejar errores específicos de base de datos
    if (error instanceof Error) {
      console.error('💥 [RESEND-VERIFICATION] Mensaje de error:', error.message)
      
      if (error.message.includes('connect')) {
        console.error('💥 [RESEND-VERIFICATION] Error de conexión a BD')
        return NextResponse.json(
          { error: 'Error de conexión con la base de datos. Inténtalo más tarde' },
          { status: 503 }
        )
      }
    }
    
    console.error('💥 [RESEND-VERIFICATION] Error genérico, devolviendo 500')
    return NextResponse.json(
      { error: 'Error interno del servidor. Inténtalo más tarde' },
      { status: 500 }
    )
  }
} 