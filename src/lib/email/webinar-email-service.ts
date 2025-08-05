import { Resend } from 'resend';
import { Webinar, WebinarRegistration } from '@/types/webinar';
import { 
  getWebinarConfirmationEmail, 
  getWebinarReminderEmail, 
  getWebinarRecordingEmail,
  WebinarEmailData 
} from './webinar-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface WebinarEmailService {
  sendConfirmationEmail(webinar: Webinar, registration: WebinarRegistration): Promise<boolean>;
  sendReminderEmail(webinar: Webinar, registration: WebinarRegistration): Promise<boolean>;
  sendRecordingEmail(webinar: Webinar, registration: WebinarRegistration): Promise<boolean>;
  sendBulkReminderEmails(webinarId: string): Promise<{ success: number; failed: number }>;
}

/**
 * Envía email de confirmación de registro
 */
export async function sendWebinarConfirmationEmail(
  webinar: Webinar, 
  registration: WebinarRegistration
): Promise<boolean> {
  try {
    const userName = `${registration.firstName} ${registration.lastName}`.trim();
    const userEmail = registration.email;

    console.log('📧 Preparando email para:', userEmail);
    console.log('📧 Webinar:', webinar.title);

    const emailData: WebinarEmailData = {
      webinar,
      registration,
      userName,
      userEmail
    };

    const emailContent = getWebinarConfirmationEmail(emailData);

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@egrowacademy.com';
    console.log('📧 API Key configurada:', !!process.env.RESEND_API_KEY);
    console.log('📧 Remitente:', `eGrow Academy <${fromEmail}>`);
    console.log('📧 Destinatario:', userEmail);

    const result = await resend.emails.send({
      from: `eGrow Academy <${fromEmail}>`,
      to: [userEmail],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log('✅ Email de confirmación enviado:', result);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email de confirmación:', error);
    console.error('❌ Detalles del error:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    });
    return false;
  }
}

/**
 * Envía email de recordatorio (15 minutos antes)
 */
export async function sendWebinarReminderEmail(
  webinar: Webinar, 
  registration: WebinarRegistration
): Promise<boolean> {
  try {
    const userName = `${registration.firstName} ${registration.lastName}`.trim();
    const userEmail = registration.email;

    const emailData: WebinarEmailData = {
      webinar,
      registration,
      userName,
      userEmail
    };

    const emailContent = getWebinarReminderEmail(emailData);

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@egrowacademy.com';
    const result = await resend.emails.send({
      from: `eGrow Academy <${fromEmail}>`,
      to: [userEmail],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log('✅ Email de recordatorio enviado:', result);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email de recordatorio:', error);
    return false;
  }
}

/**
 * Envía email de grabación disponible
 */
export async function sendWebinarRecordingEmail(
  webinar: Webinar, 
  registration: WebinarRegistration
): Promise<boolean> {
  try {
    const userName = `${registration.firstName} ${registration.lastName}`.trim();
    const userEmail = registration.email;

    const emailData: WebinarEmailData = {
      webinar,
      registration,
      userName,
      userEmail
    };

    const emailContent = getWebinarRecordingEmail(emailData);

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@egrowacademy.com';
    const result = await resend.emails.send({
      from: `eGrow Academy <${fromEmail}>`,
      to: [userEmail],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log('✅ Email de grabación enviado:', result);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email de grabación:', error);
    return false;
  }
}

/**
 * Envía recordatorios masivos para un webinar
 */
export async function sendBulkWebinarReminders(webinarId: string): Promise<{ success: number; failed: number }> {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    // Obtener webinar y registros confirmados
    const webinar = await prisma.webinar.findUnique({
      where: { id: webinarId },
      include: {
        registrations: {
          where: { isConfirmed: true }
        }
      }
    });

    if (!webinar) {
      console.error('❌ Webinar no encontrado:', webinarId);
      return { success: 0, failed: 0 };
    }

    let success = 0;
    let failed = 0;

    // Enviar emails a todos los registrados
    for (const registration of webinar.registrations) {
      const result = await sendWebinarReminderEmail(webinar, registration);
      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    console.log(`📧 Recordatorios enviados: ${success} exitosos, ${failed} fallidos`);
    return { success, failed };
  } catch (error) {
    console.error('❌ Error enviando recordatorios masivos:', error);
    return { success: 0, failed: 0 };
  }
}

/**
 * Programa recordatorios automáticos para un webinar
 */
export async function scheduleWebinarReminders(webinarId: string): Promise<void> {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    const webinar = await prisma.webinar.findUnique({
      where: { id: webinarId }
    });

    if (!webinar) {
      console.error('❌ Webinar no encontrado para programar recordatorios');
      return;
    }

    const webinarTime = new Date(webinar.dateTime);
    const reminderTime = new Date(webinarTime.getTime() - 15 * 60 * 1000); // 15 minutos antes
    const now = new Date();

    if (reminderTime > now) {
      const delay = reminderTime.getTime() - now.getTime();
      
      console.log(`⏰ Programando recordatorio para ${reminderTime.toISOString()}`);
      
      setTimeout(async () => {
        await sendBulkWebinarReminders(webinarId);
      }, delay);
    } else {
      console.log('⚠️ El webinar ya pasó, no se pueden programar recordatorios');
    }
  } catch (error) {
    console.error('❌ Error programando recordatorios:', error);
  }
} 