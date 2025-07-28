import { sendEmail } from '../src/lib/email';

async function testProductionEmail() {
  console.log('🧪 Probando envío de email en producción...');
  
  try {
    // Test 1: Verificar configuración
    console.log('📧 Verificando configuración de email...');
    
    if (!process.env.RESEND_API_KEY) {
      console.log('❌ RESEND_API_KEY no está configurada');
      console.log('💡 Para configurar en Vercel:');
      console.log('1. Ve a tu dashboard de Vercel');
      console.log('2. Selecciona tu proyecto');
      console.log('3. Ve a Settings > Environment Variables');
      console.log('4. Añade RESEND_API_KEY con tu API key de Resend');
      return;
    }
    
    console.log('✅ RESEND_API_KEY configurada');
    console.log('🔑 API Key (primeros 10 caracteres):', process.env.RESEND_API_KEY.substring(0, 10) + '...');
    
    // Test 2: Verificar dominio de envío
    console.log('📧 Verificando dominio de envío...');
    
    if (!process.env.RESEND_FROM_EMAIL) {
      console.log('⚠️ RESEND_FROM_EMAIL no está configurada');
      console.log('💡 Añade RESEND_FROM_EMAIL=noreply@egrowacademy.com en Vercel');
    } else {
      console.log('✅ RESEND_FROM_EMAIL configurada:', process.env.RESEND_FROM_EMAIL);
    }
    
    // Test 3: Enviar email de prueba
    console.log('📤 Enviando email de prueba...');
    
    const testEmail = 'aquinozair3@gmail.com'; // Cambia por tu email real
    const testSubject = '🧪 Prueba de Sistema - eGrow Academy';
    const testHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🎓 eGrow Academy</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Prueba del Sistema de Email</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #374151; margin-top: 0;">¡Hola!</h2>
          
          <p style="color: #6b7280; line-height: 1.6;">
            Este es un email de prueba para verificar que el sistema de email está funcionando correctamente en producción.
          </p>
          
          <div style="background: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #374151; font-weight: 600;">✅ Sistema de Email Funcionando</p>
          </div>
          
          <p style="color: #6b7280; line-height: 1.6;">
            Si recibes este email, significa que la configuración de Resend está correcta y puedes usar el sistema de restablecimiento de contraseña.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 14px;">
          <p>© 2024 eGrow Academy. Todos los derechos reservados.</p>
          <p>Este es un email de prueba.</p>
        </div>
      </div>
    `;
    
    const result = await sendEmail(testEmail, testSubject, testHtml);
    
    if (result.success) {
      console.log('✅ Email enviado exitosamente');
      console.log('📧 Revisa tu bandeja de entrada (y spam)');
      console.log('📧 Email enviado a:', testEmail);
    } else {
      console.log('❌ Error enviando email:', result.error);
      console.log('💡 Posibles soluciones:');
      console.log('1. Verifica que la API key de Resend sea válida');
      console.log('2. Verifica que el dominio esté verificado en Resend');
      console.log('3. Revisa los logs de Resend en su dashboard');
    }
    
  } catch (error) {
    console.error('❌ Error en el test:', error);
  }
}

// Ejecutar el test
testProductionEmail(); 