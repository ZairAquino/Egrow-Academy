import { sendEmail } from '../src/lib/email';

async function testEmailSystem() {
  console.log('🧪 Probando sistema de email...');
  
  try {
    // Test 1: Verificar configuración
    console.log('📧 Verificando configuración de email...');
    
    if (!process.env.RESEND_API_KEY) {
      console.log('❌ RESEND_API_KEY no está configurada');
      console.log('💡 Para configurar:');
      console.log('1. Ve a https://resend.com/');
      console.log('2. Crea una cuenta y obtén tu API key');
      console.log('3. Añade RESEND_API_KEY=tu_api_key a tu .env.local');
      return;
    }
    
    console.log('✅ RESEND_API_KEY configurada');
    
    // Test 2: Enviar email de prueba
    console.log('📤 Enviando email de prueba...');
    
    const testEmail = 'test@example.com'; // Cambia por tu email real
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
            Este es un email de prueba para verificar que el sistema de email está funcionando correctamente.
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
    } else {
      console.log('❌ Error enviando email:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error en el test:', error);
  }
}

// Ejecutar el test
testEmailSystem(); 