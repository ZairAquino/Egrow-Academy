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
 * Envía un código de verificación por email
 */
export async function sendVerificationEmail(
  email: string,
  code: string,
  firstName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔍 [EMAIL] Iniciando envío de verificación a:', email)
    console.log('🔍 [EMAIL] Código generado:', code)
    console.log('🔍 [EMAIL] API Key configurada:', !!process.env.RESEND_API_KEY)
    
    // Verificar que la API key esté configurada
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ [EMAIL] No hay API key de Resend configurada')
      return { success: false, error: 'Configuración de email incompleta' }
    }
    
    const { data, error } = await resend.emails.send({
      from: 'noreply@egrowacademy.com', // Usar dominio verificado
      to: [email], // Enviar al email real del usuario
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

    console.log('✅ [EMAIL] Email de verificación enviado a:', email)
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
    
    const { data, error } = await resend.emails.send({
      from: 'noreply@egrowacademy.com', // Usar dominio verificado
      to: [email], // Enviar al email real del usuario
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
      console.error('❌ [EMAIL] Error enviando email de bienvenida:', error)
      return { success: false, error: 'Error al enviar el email de bienvenida' }
    }

    console.log('✅ [EMAIL] Email de bienvenida enviado a:', email)
    return { success: true }
  } catch (error) {
    console.error('💥 [EMAIL] Error completo:', error)
    return { success: false, error: 'Error interno del servidor de email' }
  }
}

/**
 * Envía un email de bienvenida premium después del pago exitoso
 */
export async function sendPremiumWelcomeEmail(
  email: string,
  firstName: string,
  lastName: string,
  membershipLevel: string = 'PREMIUM'
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔍 [EMAIL] Iniciando envío de bienvenida premium a:', email)
    
    const { data, error } = await resend.emails.send({
      from: 'noreply@egrowacademy.com', // Usar dominio verificado
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
            
            <div style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #000; margin-top: 0; text-align: center;">🌟 Tu Acceso Premium Incluye:</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 6px;">
                  <h4 style="color: #000; margin: 0 0 8px 0;">📚 Cursos Especializados</h4>
                  <ul style="color: #000; margin: 0; padding-left: 20px; font-size: 14px;">
                    <li>Machine Learning Avanzado</li>
                    <li>Deep Learning con PyTorch</li>
                    <li>NLP y Transformers</li>
                    <li>Computer Vision</li>
                  </ul>
                </div>
                <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 6px;">
                  <h4 style="color: #000; margin: 0 0 8px 0;">🎯 Recursos Exclusivos</h4>
                  <ul style="color: #000; margin: 0; padding-left: 20px; font-size: 14px;">
                    <li>Certificados de finalización</li>
                    <li>Proyectos prácticos</li>
                    <li>Soporte prioritario</li>
                    <li>Comunidad exclusiva</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #065f46; margin-top: 0;">🚀 Próximos Pasos:</h3>
              <ol style="color: #047857; line-height: 1.8;">
                <li><strong>Explora nuestros cursos premium</strong> - Accede a contenido especializado</li>
                <li><strong>Completa tu perfil</strong> - Personaliza tu experiencia de aprendizaje</li>
                <li><strong>Únete a la comunidad</strong> - Conecta con otros profesionales</li>
                <li><strong>Descarga recursos</strong> - Accede a materiales exclusivos</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/courses" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 0 10px;">
                🎯 Explorar Cursos Premium
              </a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/my-courses" 
                 style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 0 10px;">
                📚 Mis Cursos
              </a>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <h4 style="color: #92400e; margin-top: 0;">💡 Consejo del Día:</h4>
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                Comienza con el curso "Machine Learning Fundamentals" si eres principiante, 
                o salta directamente a "Deep Learning con PyTorch" si ya tienes experiencia.
              </p>
            </div>
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <h3 style="color: #374151; margin-top: 0;">📞 ¿Necesitas Ayuda?</h3>
            <p style="color: #6b7280; line-height: 1.6;">
              Nuestro equipo de soporte está disponible para ayudarte en tu viaje de aprendizaje. 
              No dudes en contactarnos si tienes alguna pregunta.
            </p>
            <div style="text-align: center; margin-top: 15px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/contacto" 
                 style="color: #667eea; text-decoration: none; font-weight: bold;">
                Contactar Soporte →
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 14px;">
            <p>© 2024 eGrow Academy. Todos los derechos reservados.</p>
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
            <p>Tu suscripción premium se renueva automáticamente. Puedes cancelarla desde tu perfil en cualquier momento.</p>
          </div>
        </div>
      `
    })

    if (error) {
      console.error('❌ [EMAIL] Error enviando email de bienvenida premium:', error)
      return { success: false, error: 'Error al enviar el email de bienvenida premium' }
    }

    console.log('✅ [EMAIL] Email de bienvenida premium enviado a:', email)
    return { success: true }
  } catch (error) {
    console.error('💥 [EMAIL] Error completo:', error)
    return { success: false, error: 'Error interno del servidor de email' }
  }
} 