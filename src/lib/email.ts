import { Resend } from 'resend'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Genera un código de verificación de 6 dígitos
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Obtiene la dirección de email remitente según el entorno
 */
function getFromEmail(): string {
  // Debug: mostrar variables de entorno
  console.log('🔍 [EMAIL DEBUG] RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL)
  console.log('🔍 [EMAIL DEBUG] NODE_ENV:', process.env.NODE_ENV)
  
  // Usar el dominio verificado si está configurado
  if (process.env.RESEND_FROM_EMAIL) {
    console.log('✅ [EMAIL DEBUG] Usando dominio configurado:', process.env.RESEND_FROM_EMAIL)
    return process.env.RESEND_FROM_EMAIL
  }
  
  // Fallback al dominio verificado por defecto
  console.log('⚠️ [EMAIL DEBUG] Usando dominio por defecto: noreply@egrowacademy.com')
  return 'noreply@egrowacademy.com'
}

/**
 * Envía un código de verificación por email
 */
export async function sendVerificationEmail(
  email: string,
  code: string,
  firstName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verificar que la API key esté configurada
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ [EMAIL] No hay API key de Resend configurada')
      return { success: false, error: 'Configuración de email incompleta' }
    }
    
    const fromEmail = getFromEmail()
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: '🔐 Verifica tu cuenta - eGrow Academy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🎓 eGrow Academy</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Verificación de cuenta</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #374151; margin-top: 0;">¡Hola ${firstName}!</h2>
            
            <p style="color: #6b7280; line-height: 1.6;">
              Gracias por registrarte en eGrow Academy. Para completar tu registro y acceder a todos nuestros cursos de IA, 
              necesitamos verificar tu dirección de correo electrónico.
            </p>
            
            <div style="background: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #374151; font-weight: 600;">Tu código de verificación es:</p>
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 32px; font-weight: bold; padding: 15px; border-radius: 8px; letter-spacing: 5px; font-family: monospace;">
                ${code}
              </div>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6;">
              Ingresa este código en la página de verificación para activar tu cuenta. 
              Este código expira en 10 minutos por seguridad.
            </p>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>⚠️ Importante:</strong> Si no solicitaste este código, puedes ignorar este email de forma segura.
              </p>
            </div>
            
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 14px;">
            <p>© 2024 eGrow Academy. Todos los derechos reservados.</p>
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      `
    })

    if (error) {
      console.error('❌ [EMAIL] Error enviando email:', error)
      return { success: false, error: 'Error al enviar el email de verificación' }
    }

    console.log('✅ [EMAIL] Email de verificación enviado exitosamente a:', email)
    return { success: true }
  } catch (error) {
    console.error('💥 [EMAIL] Error completo:', error)
    return { success: false, error: 'Error interno del servidor de email' }
  }
}

/**
 * Envía un email de bienvenida después de la verificación
 */
export async function sendWelcomeEmail(
  email: string,
  firstName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verificar que la API key esté configurada
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ [EMAIL] No hay API key de Resend configurada')
      return { success: false, error: 'Configuración de email incompleta' }
    }
    
    const fromEmail = getFromEmail()
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: '🎉 ¡Bienvenido a eGrow Academy!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🎓 eGrow Academy</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">¡Cuenta verificada exitosamente!</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #374151; margin-top: 0;">¡Felicidades ${firstName}! 🎉</h2>
            
            <p style="color: #6b7280; line-height: 1.6;">
              Tu cuenta ha sido verificada exitosamente. Ya puedes acceder a todos nuestros cursos de Inteligencia Artificial 
              y comenzar tu viaje de aprendizaje.
            </p>
            
            <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #065f46; margin-top: 0;">🚀 ¿Qué puedes hacer ahora?</h3>
              <ul style="color: #047857; line-height: 1.8;">
                <li>Explorar nuestros cursos de IA</li>
                <li>Acceder a recursos exclusivos</li>
                <li>Unirte a nuestra comunidad</li>
                <li>Recibir notificaciones de nuevos cursos</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/courses" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                🎯 Explorar Cursos
              </a>
            </div>
            
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 14px;">
            <p>© 2024 eGrow Academy. Todos los derechos reservados.</p>
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      `
    })

    if (error) {
      console.error('❌ [EMAIL] Error enviando email:', error)
      return { success: false, error: 'Error al enviar el email de bienvenida' }
    }

    console.log('✅ [EMAIL] Email de bienvenida enviado exitosamente a:', email)
    return { success: true }
  } catch (error) {
    console.error('💥 [EMAIL] Error completo:', error)
    return { success: false, error: 'Error interno del servidor de email' }
  }
}

/**
 * Envía un email de bienvenida premium
 */
export async function sendPremiumWelcomeEmail(
  email: string,
  firstName: string,
  lastName: string,
  membershipLevel: string = 'PREMIUM'
): Promise<{ success: boolean; error?: string }> {
  try {
    const fromEmail = getFromEmail()
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: '⭐ ¡Bienvenido a eGrow Academy Premium!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #000; padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🎓 eGrow Academy</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; font-weight: bold;">¡Bienvenido al Plan Premium!</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #374151; margin-top: 0;">¡Felicidades ${firstName} ${lastName}! ⭐</h2>
            
            <p style="color: #6b7280; line-height: 1.6;">
              Tu suscripción premium ha sido activada exitosamente. Ahora tienes acceso completo a todos nuestros 
              cursos especializados y recursos exclusivos de Inteligencia Artificial.
            </p>
            
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 14px;">
            <p>© 2024 eGrow Academy. Todos los derechos reservados.</p>
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      `
    })

    if (error) {
      console.error('❌ [EMAIL] Error enviando email:', error)
      return { success: false, error: 'Error al enviar el email de bienvenida premium' }
    }

    console.log('✅ [EMAIL] Email de bienvenida premium enviado exitosamente a:', email)
    return { success: true }
  } catch (error) {
    console.error('💥 [EMAIL] Error completo:', error)
    return { success: false, error: 'Error interno del servidor de email' }
  }
} 