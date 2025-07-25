import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { sendContactConfirmationEmail } from '@/lib/email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validación básica
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Mapear el subject seleccionado a un texto más descriptivo
    const subjectMap: { [key: string]: string } = {
      'consulta-cursos': 'Consulta sobre cursos',
      'soporte-tecnico': 'Soporte técnico',
      'colaboracion': 'Oportunidades de colaboración',
      'feedback': 'Feedback y sugerencias',
      'otro': 'Consulta general'
    };

    const subjectText = subjectMap[subject] || subject;

    // Crear el template del email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Nuevo mensaje de contacto</h1>
          <p style="color: white; margin: 10px 0 0 0;">eGrow Academy</p>
        </div>
        
        <div style="padding: 30px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Información del contacto:</h2>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Nombre:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${name}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Email:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${email}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Asunto:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${subjectText}</span>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #374151;">Mensaje:</strong>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 10px; border-left: 4px solid #667eea;">
              <p style="color: #374151; margin: 0; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0; font-size: 14px;">
            Este mensaje fue enviado desde el formulario de contacto de eGrow Academy
          </p>
          <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 12px;">
            Para responder, usa directamente el email: ${email}
          </p>
        </div>
      </div>
    `;

    // Configuración de emails
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@egrowacademy.com';
    const toEmail = process.env.CONTACT_NOTIFICATION_EMAIL || 'egrowsuite@gmail.com';

    console.log('📧 [CONTACT-API] Enviando email con datos:', {
      from: fromEmail,
      to: toEmail,
      subject: `[Contacto Web] ${subjectText} - ${name}`,
      replyTo: email,
      userName: name,
      userEmail: email
    });

    // Enviar el email
    const data = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `[Contacto Web] ${subjectText} - ${name}`,
      html: emailHtml,
      replyTo: email // Para que puedas responder directamente al usuario
    });

    console.log('✅ [CONTACT-API] Email enviado exitosamente. ID del email:', data.data?.id);
    console.log('📊 [CONTACT-API] Respuesta completa de Resend:', JSON.stringify(data, null, 2));

    // Enviar email de confirmación al usuario
    try {
      const confirmationResult = await sendContactConfirmationEmail(email, name, subject);
      if (confirmationResult.success) {
        console.log('✅ [CONTACT-API] Email de confirmación enviado al usuario');
      } else {
        console.error('⚠️ [CONTACT-API] Error enviando confirmación al usuario:', confirmationResult.error);
      }
    } catch (error) {
      console.error('❌ [CONTACT-API] Error al enviar confirmación:', error);
      // No fallar la petición por error en confirmación
    }

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado correctamente'
    });

  } catch (error) {
    console.error('❌ [CONTACT-API] Error al enviar email:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor. Por favor, inténtalo de nuevo.' 
      },
      { status: 500 }
    );
  }
}