import { sendWebinarFiveHourReminderEmail } from '@/lib/email/webinar-email-service';

/**
 * Script para probar el envío del recordatorio de 5 horas
 * Envía un correo de prueba a luisdavid.ls47@gmail.com
 */

async function testFiveHourReminder() {
  try {
    console.log('🧪 Iniciando test de recordatorio de 5 horas...');
    
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

    console.log('📧 Enviando correo de prueba a:', mockRegistration.email);
    console.log('🎯 Webinar:', mockWebinar.title);
    console.log('📅 Fecha:', mockWebinar.dateTime.toLocaleString('es-MX'));

    // Verificar variables de entorno
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ ERROR: RESEND_API_KEY no está configurada en las variables de entorno');
      console.log('💡 Asegúrate de tener el archivo .env.local con RESEND_API_KEY configurada');
      return;
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      console.warn('⚠️ ADVERTENCIA: RESEND_FROM_EMAIL no está configurada, usando valor por defecto');
    }

    // Enviar el correo
    const result = await sendWebinarFiveHourReminderEmail(mockWebinar, mockRegistration);
    
    if (result) {
      console.log('✅ ¡Correo de prueba enviado exitosamente!');
      console.log('📬 Revisa la bandeja de entrada de luisdavid.ls47@gmail.com');
      console.log('📧 Asunto: ⏰ ¡Faltan solo 5 horas! Tu clase gratuita de eGrow Academy está por comenzar');
    } else {
      console.error('❌ ERROR: No se pudo enviar el correo de prueba');
      console.log('🔧 Verifica tu configuración de Resend y las variables de entorno');
    }

  } catch (error) {
    console.error('💥 Error ejecutando test:', error);
    console.log('📋 Detalles del error:');
    console.log('   - Mensaje:', error.message);
    console.log('   - Stack:', error.stack);
  }
}

// Ejecutar el test
testFiveHourReminder().then(() => {
  console.log('🏁 Test completado');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});