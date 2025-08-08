import { sendWebinarLiveNowEmail } from '@/lib/email/webinar-email-service';

/**
 * Script de prueba para la notificación EN VIVO
 * Envía un correo de prueba a luisdavid.ls47@gmail.com
 * NO EJECUTA EL ENVÍO AUTOMÁTICO, solo testea la funcionalidad
 */

async function testLiveNowNotification() {
  try {
    console.log('🧪 INICIANDO TEST DE NOTIFICACIÓN EN VIVO...');
    console.log('📧 Enviando correo de prueba para verificar diseño');
    console.log('🔴 Simulando webinar que ACABA DE COMENZAR');
    console.log('⚠️ Este es solo un test, NO es la notificación automática');
    
    // Datos simulados del webinar
    const mockWebinar = {
      id: 'test-webinar-id',
      title: 'Aprende a crear videos profesionales con IA',
      description: 'Clase gratuita donde aprenderás las mejores técnicas para crear contenido profesional usando inteligencia artificial',
      dateTime: new Date(), // AHORA MISMO (simulando que acaba de empezar)
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
    console.log(`   📅 Hora simulada: AHORA (${mockWebinar.dateTime.toLocaleString('es-MX')})`);
    console.log(`   🔴 Tipo: Notificación EN VIVO (MÁXIMA URGENCIA)`);

    // Verificar variables de entorno
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ ERROR: RESEND_API_KEY no está configurada en las variables de entorno');
      console.log('💡 Asegúrate de tener el archivo .env.local con RESEND_API_KEY configurada');
      return;
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      console.warn('⚠️ ADVERTENCIA: RESEND_FROM_EMAIL no está configurada, usando valor por defecto');
    }

    console.log('\n📤 Enviando correo de prueba EN VIVO...');

    // Enviar el correo de prueba
    const result = await sendWebinarLiveNowEmail(mockWebinar, mockRegistration);
    
    if (result) {
      console.log('\n✅ ¡Correo de prueba EN VIVO enviado exitosamente!');
      console.log('📬 Revisa la bandeja de entrada de luisdavid.ls47@gmail.com');
      console.log('📧 Asunto: 🚀 ¡Ya estamos en vivo! Tu clase gratuita de eGrow Academy ha comenzado');
      
      console.log('\n🎨 CARACTERÍSTICAS DEL EMAIL EN VIVO:');
      console.log('   🔴 Indicador "EN VIVO AHORA" parpadeante');
      console.log('   🚨 Banner rojo con animación de resplandor'); 
      console.log('   🚀 Botón verde gigante pulsante para unirse');
      console.log('   ⚡ Mensaje de máxima urgencia');
      console.log('   📱 Diseño optimizado para acción inmediata');
      console.log('   🔗 Acceso directo súper destacado');
      
      console.log('\n⚙️ CONFIGURACIÓN AUTOMÁTICA:');
      console.log('   📅 Se ejecutará automáticamente justo cuando comience cada webinar');
      console.log('   🔄 Verificación cada minuto via cron job (recomendado)');
      console.log('   ⚡ Rate limiting optimizado para máxima velocidad');
      console.log('   🕐 Ventana de ejecución: ±1 minuto desde la hora exacta');
      console.log('   🚨 Prioridad MÁXIMA - delays mínimos para envío inmediato');
      
      console.log('\n🔴 CRONOLOGÍA COMPLETA:');
      console.log('   12:00 PM (5h antes) → Recordatorio de expectativa ✅');
      console.log('   4:30 PM (30m antes) → Recordatorio URGENTE ✅');
      console.log('   5:00 PM (EN VIVO) → Notificación INMEDIATA ✅ ← NUEVO');
      console.log('   Después → Email con grabación ✅');
      
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
console.log('🧪 TEST DE NOTIFICACIÓN EN VIVO');
console.log('🔴 Enviando email de prueba con indicador EN VIVO');
console.log('🚨 Máxima urgencia + botón pulsante + acceso inmediato');
console.log('');

testLiveNowNotification().then(() => {
  console.log('\n🏁 Test completado');
  console.log('💡 Para envío automático, programa: npx tsx scripts/auto-send-live-now-notification.ts');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 Error fatal en test:', error);
  process.exit(1);
});