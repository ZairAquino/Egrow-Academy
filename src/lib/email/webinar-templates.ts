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
 * Plantilla para email de recordatorio (5 horas antes)
 */
export function getWebinarFiveHourReminderEmail(data: WebinarEmailData) {
  const { webinar, registration, userName, userEmail } = data;
  
  return {
    subject: `⏰ ¡Faltan solo 5 horas! Tu clase gratuita de eGrow Academy está por comenzar`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recordatorio de Webinar - eGrow Academy</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eeeeee;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #0D47A1;
            font-size: 24px;
            margin: 0;
          }
          .whatsapp-section {
            text-align: center;
            margin-top: 30px;
            padding: 30px 20px;
            background-color: #E8F5E9;
            border-radius: 8px;
            border: 2px solid #25D366;
          }
          .whatsapp-section h2 {
            color: #0D47A1;
            font-size: 24px;
            margin-bottom: 10px;
          }
          .whatsapp-button {
            display: inline-block;
            background-color: #25D366;
            color: #ffffff !important;
            padding: 15px 30px;
            text-align: center;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 18px;
            margin: 15px 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
          }
          .whatsapp-button:hover {
            background-color: #128C7E;
          }
          .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eeeeee;
            margin-top: 20px;
            font-size: 12px;
            color: #777777;
          }
          .schedule-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin-top: 20px;
            gap: 10px;
          }
          .schedule-box {
            background-color: #ffffff;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            text-align: center;
            width: 150px;
            color: #ffffff;
          }
          .box-blue { background-color: #2196F3; }
          .box-purple { background-color: #9C27B0; }
          .box-orange { background-color: #FF9800; }
          .box-red { background-color: #E53935; }
          .box-green { background-color: #4CAF50; }
          .box-pink { background-color: #E91E63; }
          .box-teal { background-color: #009688; }
          .schedule-box h4 {
            margin: 0 0 5px 0;
            font-size: 14px;
          }
          .schedule-box p {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
          }
          .urgent-banner {
            background: linear-gradient(135deg, #E53935, #FF5722);
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
          }
          .countdown {
            font-size: 28px;
            font-weight: bold;
            color: #E53935;
            text-align: center;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="urgent-banner">
            <h2 style="margin: 0; font-size: 22px;">🚨 ¡ÚLTIMO AVISO! 🚨</h2>
            <p style="margin: 5px 0 0 0; font-size: 16px;">Tu clase comienza en menos de 5 horas</p>
          </div>

          <div class="header">
            <h1>¡Tu clase de eGrow Academy será HOY!</h1>
          </div>
          
          <p>Hola ${userName},</p>

          <div class="countdown">
            ⏰ FALTAN SOLO 5 HORAS ⏰
          </div>

          <p>¡La espera está por terminar! En pocas horas comenzaremos nuestra clase interactiva gratuita. <strong>¡No te la puedes perder!</strong></p>
          
          <p style="font-size: 22px; font-weight: bold; color: #E91E63; margin-bottom: 5px; text-align: center;">
            🎥 Aprende a crear videos profesionales con IA
          </p>
          
          <p style="background: #f0f8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #2196F3;">
            <span style="color: #0D47A1; font-weight: bold;">📅 Fecha:</span> HOY - ${formatWebinarDate(webinar.dateTime)}<br>
            <span style="color: #0D47A1; font-weight: bold;">💻 Plataforma:</span> Google Meet<br>
            <span style="color: #0D47A1; font-weight: bold;">🔗 Enlace:</span> <a href="https://meet.google.com/ido-wvhw-zaj" style="color: #E91E63; font-weight: bold;">https://meet.google.com/ido-wvhw-zaj</a>
          </p>

          <p><span style="color: #0D47A1; font-weight: bold; font-size: 18px;">🕒 Horarios por país:</span></p>

          <div class="schedule-container">
            <div class="schedule-box box-blue">
              <h4>México / CDMX</h4>
              <p>5:00 PM</p>
            </div>
            <div class="schedule-box box-purple">
              <h4>El Salvador</h4>
              <p>4:00 PM</p>
            </div>
            <div class="schedule-box box-orange">
              <h4>Ecuador</h4>
              <p>5:00 PM</p>
            </div>
            <div class="schedule-box box-red">
              <h4>Chile</h4>
              <p>6:00 PM</p>
            </div>
            <div class="schedule-box box-green">
              <h4>Cuba</h4>
              <p>6:00 PM</p>
            </div>
            <div class="schedule-box box-pink">
              <h4>Venezuela</h4>
              <p>6:00 PM</p>
            </div>
            <div class="schedule-box box-teal">
              <h4>España</h4>
              <p>12:00 AM (9 de agosto)</p>
            </div>
          </div>
          
          <br style="clear:both;">

          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">📋 Prepárate para la clase:</h3>
            <ul style="color: #856404; margin-bottom: 0;">
              <li>Ten lista una libreta o tu computadora para tomar notas</li>
              <li>Asegúrate de tener conexión estable a internet</li>
              <li>Únete 5-10 minutos antes para evitar problemas técnicos</li>
              <li>¡Prepara tus preguntas para la sesión de Q&A!</li>
            </ul>
          </div>

          <div class="whatsapp-section">
              <h2>🚀 ¡No te quedes fuera! Únete a nuestra comunidad de WhatsApp</h2>
              <p style="font-size: 16px; color: #333333;">Este grupo es una plataforma de aprendizaje exclusiva para <strong>profesionistas y freelancers</strong>. Conéctate con otros, comparte tus proyectos y obtén feedback para mejorar tus habilidades. ¡Te esperamos!</p>
              <a href="https://chat.whatsapp.com/F2syDYAv6WS1ADYdUi7hxT" class="whatsapp-button">Unirte al Grupo de WhatsApp</a>
          </div>

          <div style="text-align: center; margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white;">
            <h3 style="margin-top: 0;">🎯 ¡Nos vemos en unas horas!</h3>
            <p style="margin-bottom: 0; font-size: 16px;">Recuerda marcar este correo como importante y añadir el evento a tu calendario para no olvidarlo.</p>
          </div>

          <div class="footer">
            <p>¡Te esperamos en la clase!<br>
            <strong>Equipo de eGrow Academy</strong><br>
            <a href="https://www.egrowacademy.com" style="color: #007bff; text-decoration: none;">www.egrowacademy.com</a></p>
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