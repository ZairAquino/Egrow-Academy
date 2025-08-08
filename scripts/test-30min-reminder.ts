import { sendWebinarThirtyMinuteReminderEmail } from '@/lib/email/webinar-email-service';

/**
 * Script de prueba para el recordatorio de 30 minutos
 * Envía un correo de prueba a luisdavid.ls47@gmail.com
 * NO EJECUTA EL ENVÍO AUTOMÁTICO, solo testea la funcionalidad
 */

async function testThirtyMinuteReminder() {
  try {
    console.log('🧪 INICIANDO TEST DEL RECORDATORIO DE 30 MINUTOS...');
    console.log('📧 Enviando correo de prueba para verificar diseño');
    console.log('⚠️ Este es solo un test, NO es el envío automático');
    
    // Datos simulados del webinar
    const mockWebinar = {
      id: 'test-webinar-id',
      title: 'Aprende a crear videos profesionales con IA',
      description: 'Clase gratuita donde aprenderás las mejores técnicas para crear contenido profesional usando inteligencia artificial',
      dateTime: new Date('2025-08-08T22:00:00.000Z'), // Viernes 8 de agosto, 5:00 PM CDMX
      duration: 90,
      hostName: 'eGrow Academy',
      slug: 'videos-profesionales-ia',
      meetingUrl: 'https://meet.google.com/ido-wvhw-zaj',
      recordingUrl: null,
      isActive: true,
      maxAttendees: 1000,
      createdAt: new Date(),
      updatedAt: new Date(),
      registrations: []
    };

    // Datos simulados del registro (el correo de prueba)
    const mockRegistration = {
      id: 'test-registration-id',
      webinarId: 'test-webinar-id',
      email: 'luisdavid.ls47@gmail.com',
      firstName: 'Luis David',
      lastName: 'Salinas',
      phone: null,
      isConfirmed: true,
      confirmationToken: 'test-token',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('📧 Datos del test:');
    console.log(`   📧 Destinatario: ${mockRegistration.email}`);
    console.log(`   🎯 Webinar: ${mockWebinar.title}`);
    console.log(`   📅 Hora simulada: ${mockWebinar.dateTime.toLocaleString('es-MX')}`);
    console.log(`   🚨 Tipo: Recordatorio de 30 minutos (URGENTE)`);

    // Verificar variables de entorno
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ ERROR: RESEND_API_KEY no está configurada en las variables de entorno');
      console.log('💡 Asegúrate de tener el archivo .env.local con RESEND_API_KEY configurada');
      return;
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      console.warn('⚠️ ADVERTENCIA: RESEND_FROM_EMAIL no está configurada, usando valor por defecto');
    }

    console.log('\n📤 Enviando correo de prueba...');

    // Enviar el correo de prueba
    const result = await sendWebinarThirtyMinuteReminderEmail(mockWebinar, mockRegistration);
    
    if (result) {
      console.log('\n✅ ¡Correo de prueba de 30 minutos enviado exitosamente!');
      console.log('📬 Revisa la bandeja de entrada de luisdavid.ls47@gmail.com');
      console.log('📧 Asunto: 🚨 ¡ATENCIÓN! Tu clase comienza en 30 minutos');
      
      console.log('\n🎨 CARACTERÍSTICAS DEL EMAIL DE 30 MINUTOS:');
      console.log('   🚨 Alerta roja pulsante con animación');
      console.log('   🔗 Acceso directo destacado a Google Meet');
      console.log('   ✅ Checklist de preparación última hora');
      console.log('   📱 Tono más urgente que el de 5 horas');
      console.log('   🚀 Llamada final a WhatsApp community');
      
      console.log('\n⚙️ CONFIGURACIÓN AUTOMÁTICA:');
      console.log('   📅 Se ejecutará automáticamente 30 minutos antes de cada webinar');
      console.log('   🔄 Verificación cada minuto via cron job (recomendado)');
      console.log('   🎯 Rate limiting inteligente según número de registrados');
      console.log('   ⏱️ Ventana de ejecución: ±1 minuto de precisión');
      
    } else {
      console.error('\n❌ ERROR: No se pudo enviar el correo de prueba');
      console.log('🔧 Verifica tu configuración de Resend y las variables de entorno');
    }

  } catch (error) {
    console.error('\n💥 Error ejecutando test:', error);
    console.log('📋 Detalles del error:');
    console.log('   - Mensaje:', error.message);
    if (error.stack) {
      console.log('   - Stack:', error.stack.split('\n').slice(0, 3).join('\n'));
    }
  }
}

// Ejecutar el test
console.log('🧪 TEST DE RECORDATORIO DE 30 MINUTOS');
console.log('📧 Enviando email de prueba con diseño final');
console.log('🚨 Alerta urgente + checklist + acceso directo');
console.log('');

testThirtyMinuteReminder().then(() => {
  console.log('\n🏁 Test completado');
  console.log('💡 Para envío automático, programa: npx tsx scripts/auto-send-30min-reminder.ts');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 Error fatal en test:', error);
  process.exit(1);
});