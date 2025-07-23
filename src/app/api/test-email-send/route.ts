import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    
    console.log('🔍 [TEST-EMAIL] Intentando enviar a:', email)
    console.log('🔍 [TEST-EMAIL] API Key presente:', !!process.env.RESEND_API_KEY)
    
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [email],
      subject: 'Test de Email - eGrow Academy',
      html: '<h1>Test de Email</h1><p>Si recibes este email, el sistema funciona correctamente.</p>'
    })

    if (error) {
      console.error('❌ [TEST-EMAIL] Error:', error)
      return NextResponse.json({ 
        error: 'Error enviando email', 
        details: error,
        apiKeyPresent: !!process.env.RESEND_API_KEY 
      }, { status: 500 })
    }

    console.log('✅ [TEST-EMAIL] Email enviado:', data)
    return NextResponse.json({ 
      success: true, 
      message: 'Email enviado correctamente',
      data 
    })
  } catch (error) {
    console.error('💥 [TEST-EMAIL] Error completo:', error)
    return NextResponse.json({ 
      error: 'Error interno',
      message: (error as Error).message 
    }, { status: 500 })
  }
}