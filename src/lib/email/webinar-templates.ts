import { Webinar, WebinarRegistration } from '@/types/webinar';
import { formatWebinarDate } from '@/lib/webinar';

export interface WebinarEmailData {
  webinar: Webinar;
  registration: WebinarRegistration;
  userName: string;
  userEmail: string;
}

/**
 * Plantilla para email de confirmación de registro
 */
export function getWebinarConfirmationEmail(data: WebinarEmailData) {
  const { webinar, registration, userName, userEmail } = data;
  
  return {
    subject: `✅ Confirmación: Registro exitoso a "${webinar.title}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Registro - eGrow Academy</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #ffeaa7; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 ¡Registro Confirmado!</h1>
            <p>Tu lugar está reservado para el webinar</p>
          </div>
          
          <div class="content">
            <h2>Hola ${userName},</h2>
            
            <p>¡Excelente! Tu registro al webinar <strong>"${webinar.title}"</strong> ha sido confirmado exitosamente.</p>
            
            <div class="info-box">
              <h3>📅 Detalles del Evento</h3>
              <p><strong>Fecha y Hora:</strong> ${formatWebinarDate(webinar.dateTime)}</p>
              <p><strong>Duración:</strong> ${webinar.duration} minutos</p>
              <p><strong>Ponente:</strong> ${webinar.hostName}</p>
              <p><strong>Plataforma:</strong> Google Meet</p>
            </div>
            
            <div class="highlight">
              <h4>🔗 Link de Acceso</h4>
              <p><strong>Guarda este email con tu información de acceso:</strong></p>
              <p><strong>Google Meet:</strong> <a href="https://meet.google.com/ido-wvhw-zaj" style="color: #667eea;">https://meet.google.com/ido-wvhw-zaj</a></p>
              <p style="margin-top: 10px; font-size: 0.9em; color: #666;">
                <em>Te enviaremos un recordatorio 15 minutos antes del evento con esta misma información.</em>
              </p>
            </div>
            
            <h3>📋 Lo que aprenderás:</h3>
            <ul>
              <li>Estrategias prácticas para implementar en tu negocio</li>
              <li>Casos de estudio reales y ejemplos aplicables</li>
              <li>Herramientas y recursos gratuitos para empezar</li>
              <li>Sesión de preguntas y respuestas en vivo</li>
            </ul>
            
            <h3>📱 Preparación</h3>
            <p>Para una mejor experiencia:</p>
            <ul>
              <li>Asegúrate de tener una conexión estable a internet</li>
              <li>Usa auriculares para mejor audio</li>
              <li>Ten papel y lápiz listos para tomar notas</li>
              <li>Únete 5 minutos antes del inicio</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://egrow-academy.com/webinar/${webinar.slug}" class="button">
                Ver Detalles del Webinar
              </a>
            </div>
            
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            
            <p>¡Nos vemos en el webinar!</p>
            
            <p>Saludos,<br>
            <strong>El equipo de eGrow Academy</strong></p>
          </div>
          
          <div class="footer">
            <p>© 2024 eGrow Academy. Todos los derechos reservados.</p>
            <p>Si no puedes asistir, te enviaremos la grabación por email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

/**
 * Plantilla para email de recordatorio (15 minutos antes)
 */
export function getWebinarReminderEmail(data: WebinarEmailData) {
  const { webinar, registration, userName, userEmail } = data;
  
  return {
    subject: `⏰ ¡El webinar comienza en 15 minutos! - "${webinar.title}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recordatorio de Webinar - eGrow Academy</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b6b; }
          .urgent { background: #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; border: 2px solid #fdcb6e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ ¡El webinar comienza en 15 minutos!</h1>
            <p>No te pierdas esta oportunidad única</p>
          </div>
          
          <div class="content">
            <h2>Hola ${userName},</h2>
            
            <div class="urgent">
              <h3>🚨 ¡URGENTE!</h3>
              <p>El webinar <strong>"${webinar.title}"</strong> comienza en <strong>15 minutos</strong>.</p>
            </div>
            
            <div class="info-box">
              <h3>🔗 Link de Acceso Directo</h3>
              <p><strong>Google Meet:</strong> <a href="https://meet.google.com/ido-wvhw-zaj">https://meet.google.com/ido-wvhw-zaj</a></p>
              <p><strong>Hora de inicio:</strong> ${formatWebinarDate(webinar.dateTime)}</p>
            </div>
            
            <h3>📋 Prepárate:</h3>
            <ul>
              <li>✅ Ten tu computadora lista</li>
              <li>✅ Verifica tu conexión a internet</li>
              <li>✅ Usa auriculares para mejor audio</li>
              <li>✅ Ten papel y lápiz para notas</li>
              <li>✅ Únete 5 minutos antes</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://meet.google.com/ido-wvhw-zaj" class="button">
                🚀 Unirse Ahora al Webinar
              </a>
            </div>
            
            <p><strong>¿No puedes asistir?</strong> No te preocupes, te enviaremos la grabación por email después del evento.</p>
            
            <p>¡Nos vemos en el webinar!</p>
            
            <p>Saludos,<br>
            <strong>El equipo de eGrow Academy</strong></p>
          </div>
          
          <div class="footer">
            <p>© 2024 eGrow Academy. Todos los derechos reservados.</p>
            <p>Si tienes problemas para unirte, contacta soporte@egrow-academy.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

/**
 * Plantilla para email de grabación disponible
 */
export function getWebinarRecordingEmail(data: WebinarEmailData) {
  const { webinar, registration, userName, userEmail } = data;
  
  return {
    subject: `📹 Grabación disponible: "${webinar.title}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Grabación de Webinar - eGrow Academy</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #00b894 0%, #00a085 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #00b894; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00b894; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📹 Grabación Disponible</h1>
            <p>El webinar "${webinar.title}" ya está disponible</p>
          </div>
          
          <div class="content">
            <h2>Hola ${userName},</h2>
            
            <p>¡La grabación del webinar <strong>"${webinar.title}"</strong> ya está disponible!</p>
            
            <div class="info-box">
              <h3>📺 Ver Grabación</h3>
              <p>Puedes ver la grabación completa del webinar en cualquier momento.</p>
              ${webinar.recordingUrl ? `<p><strong>Link de grabación:</strong> <a href="${webinar.recordingUrl}">${webinar.recordingUrl}</a></p>` : ''}
            </div>
            
            <h3>📚 Recursos Adicionales</h3>
            <ul>
              <li>📖 Presentación en PDF</li>
              <li>🛠️ Herramientas mencionadas</li>
              <li>📝 Notas del webinar</li>
              <li>❓ Preguntas y respuestas</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://egrow-academy.com/courses" class="button">
                🎓 Ver Más Cursos
              </a>
            </div>
            
            <p>¡Esperamos que hayas disfrutado el webinar!</p>
            
            <p>Saludos,<br>
            <strong>El equipo de eGrow Academy</strong></p>
          </div>
          
          <div class="footer">
            <p>© 2024 eGrow Academy. Todos los derechos reservados.</p>
            <p>¿Tienes preguntas? Contacta soporte@egrow-academy.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
} 