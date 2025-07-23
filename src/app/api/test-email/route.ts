import { NextRequest, NextResponse } from 'next/server'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 [TEST-EMAIL] Probando envío de email')
    
    const body = await request.json()
    const { email, code } = body
    
    console.log('📧 [TEST-EMAIL] Datos recibidos:', { email, code })
    
    // Probar envío de email
    const result = await sendVerificationEmail(email, code, 'Test')
    
    console.log('📊 [TEST-EMAIL] Resultado del envío:', result)
    
    if (result.success) {
      return NextResponse.json({
        message: 'Email enviado exitosamente',
        success: true
      })
    } else {
      return NextResponse.json({
        error: result.error,
        success: false
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('💥 [TEST-EMAIL] Error completo:', error)
    return NextResponse.json({
      error: 'Error interno del servidor',
      success: false
    }, { status: 500 })
  }
} 