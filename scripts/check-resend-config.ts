import { Resend } from 'resend'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

async function checkResendConfig() {
  console.log('🔍 [RESEND] Verificando configuración de Resend...')
  
  // Verificar API key
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('❌ [RESEND] No hay API key configurada')
    return
  }
  
  console.log('✅ [RESEND] API key encontrada')
  console.log('🔑 [RESEND] API key (primeros 10 caracteres):', apiKey.substring(0, 10) + '...')
  
  // Verificar formato de la API key
  if (!apiKey.startsWith('re_')) {
    console.error('❌ [RESEND] API key no tiene el formato correcto (debe empezar con "re_")')
    return
  }
  
  console.log('✅ [RESEND] Formato de API key correcto')
  
  try {
    // Intentar enviar un email de prueba
    const resend = new Resend(apiKey)
    
    console.log('📧 [RESEND] Enviando email de prueba...')
    const { data, error } = await resend.emails.send({
      from: 'noreply@egrowacademy.com',
      to: ['aquinozair3@gmail.com'], // Enviar a tu email para pruebas
      subject: '🧪 Prueba de configuración - eGrow Academy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🎓 eGrow Academy</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Prueba de configuración</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #374151; margin-top: 0;">¡Configuración exitosa! 🎉</h2>
            
            <p style="color: #6b7280; line-height: 1.6;">
              Este es un email de prueba para verificar que la configuración de Resend está funcionando correctamente.
            </p>
            
            <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #065f46; margin-top: 0;">✅ Configuración verificada:</h3>
              <ul style="color: #047857; line-height: 1.8;">
                <li>API key válida</li>
                <li>Dominio verificado</li>
                <li>Envío de emails funcionando</li>
              </ul>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 14px;">
            <p>© 2024 eGrow Academy. Todos los derechos reservados.</p>
          </div>
        </div>
      `
    })
    
    if (error) {
      console.error('❌ [RESEND] Error enviando email de prueba:', error)
      console.log('💡 [RESEND] Posibles soluciones:')
      console.log('   1. Verifica que la API key sea correcta')
      console.log('   2. Asegúrate de que el dominio esté verificado')
      console.log('   3. Revisa que no haya límites de envío')
    } else {
      console.log('✅ [RESEND] Email de prueba enviado exitosamente')
      console.log('📧 [RESEND] ID del email:', data?.id)
    }
    
  } catch (error) {
    console.error('💥 [RESEND] Error completo:', error)
  }
}

checkResendConfig() 