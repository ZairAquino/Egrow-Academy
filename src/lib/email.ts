import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailVerificationData {
  email: string;
  name: string;
  verificationToken: string;
}

export interface EmailTemplateData {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  /**
   * Envía email de verificación de cuenta
   */
  static async sendVerificationEmail(data: EmailVerificationData): Promise<boolean> {
    try {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/verify-email?token=${data.verificationToken}`;
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Verifica tu cuenta - eGrow Academy</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 eGrow Academy</h1>
              <p>Verifica tu cuenta para comenzar a aprender IA</p>
            </div>
            <div class="content">
              <h2>¡Hola ${data.name}!</h2>
              <p>Gracias por registrarte en <strong>eGrow Academy</strong>. Para completar tu registro y acceder a todos nuestros cursos de Inteligencia Artificial, necesitas verificar tu dirección de email.</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">✅ Verificar mi cuenta</a>
              </div>
              
              <p><strong>¿No funciona el botón?</strong> Copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              
              <p><strong>¿No solicitaste esta cuenta?</strong> Puedes ignorar este email de forma segura.</p>
            </div>
            <div class="footer">
              <p>© 2024 eGrow Academy. Todos los derechos reservados.</p>
              <p>Este email fue enviado a ${data.email}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@egrow-academy.com',
        to: data.email,
        subject: '🎓 Verifica tu cuenta - eGrow Academy',
        html: html,
      });

      console.log('Email de verificación enviado:', result);
      return true;
    } catch (error) {
      console.error('Error enviando email de verificación:', error);
      return false;
    }
  }

  /**
   * Envía email de recordatorio de verificación
   */
  static async sendVerificationReminder(data: EmailVerificationData): Promise<boolean> {
    try {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/verify-email?token=${data.verificationToken}`;
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Recordatorio: Verifica tu cuenta - eGrow Academy</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 eGrow Academy</h1>
              <p>Recordatorio: Verifica tu cuenta</p>
            </div>
            <div class="content">
              <h2>¡Hola ${data.name}!</h2>
              <p>Notamos que aún no has verificado tu cuenta en <strong>eGrow Academy</strong>. Para acceder a todos nuestros cursos de IA y recursos exclusivos, necesitas completar la verificación.</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">✅ Verificar ahora</a>
              </div>
              
              <p><strong>¿Tienes problemas?</strong> Copia este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #ff6b6b;">${verificationUrl}</p>
              
              <p><em>Este recordatorio se enviará cada 24 horas hasta que verifiques tu cuenta.</em></p>
            </div>
            <div class="footer">
              <p>© 2024 eGrow Academy. Todos los derechos reservados.</p>
              <p>Este email fue enviado a ${data.email}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@egrow-academy.com',
        to: data.email,
        subject: '⏰ Recordatorio: Verifica tu cuenta - eGrow Academy',
        html: html,
      });

      console.log('Email de recordatorio enviado:', result);
      return true;
    } catch (error) {
      console.error('Error enviando email de recordatorio:', error);
      return false;
    }
  }

  /**
   * Envía email personalizado
   */
  static async sendCustomEmail(data: EmailTemplateData): Promise<boolean> {
    try {
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@egrow-academy.com',
        to: data.to,
        subject: data.subject,
        html: data.html,
      });

      console.log('Email personalizado enviado:', result);
      return true;
    } catch (error) {
      console.error('Error enviando email personalizado:', error);
      return false;
    }
  }
} 