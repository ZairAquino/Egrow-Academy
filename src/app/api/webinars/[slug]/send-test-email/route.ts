import { NextRequest, NextResponse } from 'next/server';
import { getWebinarBySlug } from '@/lib/webinar';
import { sendWebinarConfirmationEmail, sendWebinarReminderEmail } from '@/lib/email/webinar-email-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { email, type } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Obtener el webinar
    const webinar = await getWebinarBySlug(params.slug);
    
    if (!webinar) {
      return NextResponse.json(
        { success: false, message: 'Webinar no encontrado' },
        { status: 404 }
      );
    }

    // Crear un registro de prueba
    const testRegistration = {
      id: 'test-registration',
      webinarId: webinar.id,
      userId: null,
      email: email,
      firstName: 'Usuario',
      lastName: 'Prueba',
      phone: '+52 55 1234 5678',
      company: 'Empresa de Prueba',
      position: 'Desarrollador',
      questions: 'Pregunta de prueba',
      isConfirmed: true,
      attended: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let emailSent = false;
    let emailType = '';

    // Enviar el tipo de email solicitado
    switch (type) {
      case 'confirmation':
        emailSent = await sendWebinarConfirmationEmail(webinar, testRegistration);
        emailType = 'confirmación';
        break;
      case 'reminder':
        emailSent = await sendWebinarReminderEmail(webinar, testRegistration);
        emailType = 'recordatorio';
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Tipo de email inválido. Usa "confirmation" o "reminder"' },
          { status: 400 }
        );
    }

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: `Email de ${emailType} enviado exitosamente a ${email}`,
        emailType,
        recipient: email
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Error enviando el email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error enviando email de prueba:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 